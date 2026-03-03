<script lang="ts">
	import { onMount } from "svelte";
	import { page } from "$app/stores";
	import {
		listTasks,
		deleteTask,
		ApiError,
		isLoggedIn,
		fetchBalance,
		getUser,
		telegramAuth,
		ordersApi,
		type Transaction,
	} from "$lib/api";
	import { authModalOpen, userStore } from "$lib/stores";
	import { formatDate, formatGB } from "$lib/utils/format";
	import type { Task, UserBalance } from "$lib/types";
	import ConfirmModal from "$lib/components/ConfirmModal.svelte";

	async function fetchTransactions(userId: string): Promise<Transaction[]> {
		return [];
	}

	let tasks: Task[] = [];
	let transactions: Transaction[] = [];
	let balance: UserBalance | null = null;
	let loading = true;
	let error = "";
	let statusFilter = "";
	let loggedIn = false;
	let activeTab: "transfers" | "topups" = "transfers";
	let authInitialized = false;
	let captureStatus = ""; // "capturing" | "captured" | "capture_error"

	// Custom delete confirmation modal state
	let deleteModalOpen = false;
	let deleteTargetId = "";
	let deleteError = "";
	let telegramLinkError = "";

	const BOT_NAME = import.meta.env.VITE_TELEGRAM_BOT_NAME || "Fastbaidu_bot";

	const RETENTION_DAYS = 7;

	const statusColors: Record<string, string> = {
		pending: "bg-amber-500/20 text-amber-300",
		pending_payment: "bg-orange-500/20 text-orange-300",
		processing: "bg-indigo-500/20 text-indigo-300",
		completed: "bg-emerald-500/20 text-emerald-300",
		failed: "bg-red-500/20 text-red-300",
	};

	const txTypeLabels: Record<string, string> = {
		purchase: "💎 Top Up",
		usage: "📤 Usage",
		refund: "↩️ Refund",
		admin_adjust: "🔧 Admin",
		trial: "🎁 Trial",
	};

	const txMethodLabels: Record<string, string> = {
		paypal: "PayPal",
		crypto: "Crypto",
		crypto_usdt: "USDT",
		crypto_busd: "BUSD",
		crypto_usdc: "USDC",
		balance: "Balance",
		trial: "Free Trial",
		admin: "Admin",
	};

	function getExpiryDate(task: Task): Date | null {
		if (task.status !== "completed" || !task.completed_at) return null;
		const completed = new Date(task.completed_at);
		return new Date(
			completed.getTime() + RETENTION_DAYS * 24 * 60 * 60 * 1000,
		);
	}

	function isExpired(task: Task): boolean {
		const expiry = getExpiryDate(task);
		if (!expiry) return false;
		return new Date() > expiry;
	}

	function formatExpiry(task: Task): string {
		const expiry = getExpiryDate(task);
		if (!expiry) return "—";
		return formatDate(expiry.toISOString());
	}

	function extractGdriveId(link: string): string | null {
		const matchId = link.match(/[?&]id=([a-zA-Z0-9_-]+)/);
		if (matchId) return matchId[1];
		const matchD = link.match(/\/d\/([a-zA-Z0-9_-]+)/);
		if (matchD) return matchD[1];
		if (link.startsWith('http')) return 'direct';
		return null;
	}

	async function loadTasks() {
		loading = true;
		error = "";
		try {
			const rawJobs = await listTasks(statusFilter || undefined);
			// Parse payload/result from raw job records
			tasks = (rawJobs || []).map((job: any) => {
				const payload = typeof job.payload === 'string' ? (() => { try { return JSON.parse(job.payload); } catch { return {}; } })() : (job.payload || {});
				const result = typeof job.result === 'string' ? (() => { try { return JSON.parse(job.result); } catch { return {}; } })() : (job.result || {});
				const statusMap: Record<string, string> = { done: 'completed', running: 'processing', pending: 'pending', failed: 'failed', cancelled: 'cancelled' };
				return {
					...job,
					status: statusMap[job.status] || job.status,
					url: payload.share_url || '',
					gdrive_link: result.cloud_path || '',
					total_size: result.total_bytes || 0,
					size_gb: (result.total_bytes || 0) / (1024 * 1024 * 1024),
					total_files: result.total_files || 0,
					error_msg: job.error_msg || '',
					created: job.created_at || job.created || '',
					completed_at: job.status === 'done' ? (job.updated_at || job.updated || '') : '',
				};
			});
		} catch (err) {
			error =
				err instanceof ApiError ? err.message : "Failed to load tasks";
		} finally {
			loading = false;
		}
	}

	function requestDelete(id: string) {
		deleteTargetId = id;
		deleteError = "";
		deleteModalOpen = true;
	}

	async function confirmDelete() {
		if (!deleteTargetId) return;
		try {
			await deleteTask(deleteTargetId);
			tasks = tasks.filter((t) => t.id !== deleteTargetId);
			deleteTargetId = "";
		} catch (err: any) {
			console.error("Delete failed:", err);
			throw new Error(err?.message || "Failed to delete task. You may not have permission.");
		}
	}

	function onCancelDelete() {
		deleteTargetId = "";
	}

	function telegramLinkWidget(node: HTMLElement) {
		(window as any).onDashboardTelegramAuth = async (user: any) => {
			try {
				const data: Record<string, string> = {};
				for (const [k, v] of Object.entries(user)) {
					data[k] = String(v);
				}
				await telegramAuth(data);
				window.location.reload();
			} catch (err: any) {
				console.error("Failed to link Telegram:", err);
				telegramLinkError = err.message || "Unknown error";
				setTimeout(() => telegramLinkError = "", 6000);
			}
		};

		const script = document.createElement("script");
		script.src = "https://telegram.org/js/telegram-widget.js?22";
		script.setAttribute("data-telegram-login", BOT_NAME);
		script.setAttribute("data-size", "medium");
		script.setAttribute("data-radius", "8");
		script.setAttribute("data-userpic", "false");
		script.setAttribute("data-onauth", "onDashboardTelegramAuth(user)");
		script.setAttribute("data-request-access", "write");
		script.async = true;
		node.appendChild(script);

		return {
			destroy() {}
		};
	}

	onMount(async () => {
		authInitialized = true;
		loggedIn = isLoggedIn();
		await loadTasks();
		if (loggedIn) {
			// ── PayPal Capture: finalize payment when returning from PayPal ──
			const urlParams = new URLSearchParams(window.location.search);
			const topupStatus = urlParams.get("topup");
			const paypalToken = urlParams.get("token");
			if (topupStatus === "success" && paypalToken) {
				captureStatus = "capturing";
				try {
					await ordersApi.capturePaypal(paypalToken);
					captureStatus = "captured";
					console.log("[PayPal] Order captured successfully!");
				} catch (err: any) {
					console.error("[PayPal] Capture failed:", err);
					captureStatus = "capture_error";
				}
				// Clean URL params
				window.history.replaceState({}, "", "/dashboard");
			}

			try {
				balance = await fetchBalance();
			} catch {
				// silent
			}
			try {
				const user = getUser();
				if (user?.id) {
					transactions = await fetchTransactions(user.id);
				}
			} catch {
				// silent
			}
		}
	});
</script>

<svelte:head>
	<title>My Account — FastBaidu</title>
</svelte:head>

<div class="max-w-6xl mx-auto px-4 py-10">
	{#if !authInitialized}
		<div class="flex justify-center py-20">
			<div
				class="w-12 h-12 border-4 border-surface-700/50 border-t-brand-500 rounded-full animate-spin"
			></div>
		</div>
	{:else if !loggedIn}
		<div class="glass rounded-2xl p-12 text-center">
			<div class="text-6xl mb-5">🔒</div>
			<h1 class="text-2xl font-bold text-white mb-3">Login Required</h1>
			<p class="text-surface-400 mb-8 max-w-md mx-auto">
				Sign in to view your account details, balance, and transfer
				history.
			</p>
			<button
				on:click={() => ($authModalOpen = true)}
				class="px-8 py-3 rounded-xl gradient-brand text-white font-semibold text-sm hover:opacity-90 transition-opacity shadow-lg shadow-brand-500/25"
			>
				Login to Access
			</button>
		</div>
	{:else}
		<!-- Top Row: Profile + Wallet -->
		<div class="grid lg:grid-cols-3 gap-6 mb-8">
			<!-- Profile Card -->
			<div class="lg:col-span-2 glass rounded-2xl p-6">
				<div class="flex items-start gap-5">
					{#if $userStore?.avatar}
						<img
							src={$userStore.avatar}
							alt="Avatar"
							class="w-16 h-16 rounded-2xl shadow-lg object-cover ring-2 ring-brand-500/20"
						/>
					{:else}
						<div
							class="w-16 h-16 rounded-2xl bg-brand-500/20 text-brand-400 flex items-center justify-center text-2xl font-bold shadow-lg ring-2 ring-brand-500/20"
						>
							{$userStore?.first_name?.[0] || "U"}
						</div>
					{/if}
					<div class="flex-1 min-w-0">
						<h1 class="text-xl font-bold text-white truncate">
							{$userStore?.first_name || "User"}
							{$userStore?.last_name || ""}
						</h1>
						{#if $userStore?.username}
							<p
								class="text-sm text-brand-400/80 font-mono truncate"
							>
								@{$userStore.username}
							</p>
						{/if}
						{#if $userStore?.email}
							<p
								class="text-sm text-surface-400 mt-1 truncate flex items-center gap-1.5"
							>
								<svg
									class="w-3.5 h-3.5 text-surface-500 shrink-0"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
									/>
								</svg>
								{$userStore.email}
							</p>
						{/if}
					</div>
				</div>

				<!-- Account Badges -->
				<div class="flex flex-wrap items-center gap-2 mt-5 h-10">
					{#if balance?.is_telegram_user}
						<span
							class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-sky-500/15 text-sky-300 text-xs font-semibold"
						>
							<svg
								class="w-3.5 h-3.5"
								viewBox="0 0 24 24"
								fill="currentColor"
							>
								<path
									d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z"
								/>
							</svg>
							Telegram Linked
						</span>
					{:else}
						<!-- Inline Telegram Linking Container -->
						<div class="relative group">
							{#if telegramLinkError}
								<div class="absolute -top-12 right-0 left-0 bg-red-500/90 text-white rounded-lg px-3 py-2 text-xs font-semibold shadow-lg backdrop-blur-md z-50 flex items-center justify-between whitespace-nowrap overflow-hidden text-ellipsis animate-fade-in border border-red-400/50">
									{telegramLinkError}
									<button class="ml-2 w-5 h-5 flex items-center justify-center rounded-full bg-black/20 hover:bg-black/40 transition-colors" on:click={() => telegramLinkError = ''}>✕</button>
								</div>
							{/if}
							<div
								class="flex items-center gap-3 bg-surface-800/50 rounded-lg pr-1 border border-surface-700/50 overflow-hidden shrink-0"
							>
								<div
									class="px-3 text-xs font-medium text-surface-300"
								>
									Link Telegram for <strong class="text-brand-400"
										>+1.00 GB Quota</strong
									> 👉
								</div>
								<div
									use:telegramLinkWidget
									class="flex items-center justify-center shrink-0 [&>iframe]:rounded relative z-10"
								></div>
							</div>
						</div>
					{/if}
				</div>
			</div>

			<!-- Wallet Card -->
			<div
				class="glass rounded-2xl p-6 relative overflow-hidden flex flex-col"
			>
				<div
					class="absolute inset-0 bg-gradient-to-br from-brand-500/10 via-transparent to-indigo-500/5"
				></div>
				<div class="relative z-10 flex-1">
					<p
						class="text-[11px] font-bold text-surface-400 tracking-wider uppercase mb-2 flex items-center gap-1.5"
					>
						<svg
							class="w-3.5 h-3.5 text-brand-400"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
							/>
						</svg>
						Wallet Balance
					</p>
					{#if balance}
						<div
							class="text-4xl font-black text-white tracking-tight mb-1"
						>
							{balance.balance_gb.toFixed(2)}
							<span class="text-lg font-semibold text-brand-400"
								>GB</span
							>
						</div>
						<p class="text-xs text-surface-500">
							Total spent: ${balance.total_spent_usd.toFixed(2)}
						</p>
					{:else}
						<div class="text-4xl font-black text-white mb-1">
							—
							<span class="text-lg font-semibold text-surface-500"
								>GB</span
							>
						</div>
					{/if}
				</div>
				<a
					href="/topup"
					class="relative z-10 mt-4 block w-full text-center py-2.5 rounded-xl text-sm font-semibold gradient-brand text-white hover:opacity-90 transition-opacity"
				>
					Top Up Credits
				</a>
			</div>
		</div>

		<!-- Tab Buttons -->
		<div class="flex gap-2 mb-6">
			<button
				on:click={() => (activeTab = "transfers")}
				class="px-4 py-2 rounded-lg text-sm font-semibold transition-all
				{activeTab === 'transfers'
					? 'gradient-brand text-white'
					: 'bg-surface-800/50 text-surface-400 hover:text-white hover:bg-surface-700'}"
			>
				⚡ Transfer History
			</button>
			<button
				on:click={() => (activeTab = "topups")}
				class="px-4 py-2 rounded-lg text-sm font-semibold transition-all
				{activeTab === 'topups'
					? 'gradient-brand text-white'
					: 'bg-surface-800/50 text-surface-400 hover:text-white hover:bg-surface-700'}"
			>
				💎 Top-Up History
			</button>
		</div>

		<!-- Transfer History Tab -->
		{#if activeTab === "transfers"}
			<div class="glass rounded-2xl p-6">
				<div class="flex items-center justify-between mb-6">
					<h2 class="text-lg font-bold text-white">Leech History</h2>
					<div class="flex gap-2 flex-wrap">
						{#each ["", "pending", "completed", "failed"] as filter}
							<button
								on:click={() => {
									statusFilter = filter;
									loadTasks();
								}}
								class="px-3 py-1.5 rounded-lg text-xs font-medium transition-all
								{statusFilter === filter
									? 'gradient-brand text-white'
									: 'bg-surface-800/50 text-surface-400 hover:text-white hover:bg-surface-700'}"
							>
								{filter || "All"}
							</button>
						{/each}
					</div>
				</div>

				{#if loading}
					<div class="space-y-3">
						{#each Array(3) as _}
							<div
								class="h-16 bg-surface-800/50 rounded-xl animate-pulse"
							></div>
						{/each}
					</div>
				{:else if error}
					<div
						class="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-300 text-sm"
					>
						{error}
					</div>
				{:else if tasks.length === 0}
					<div class="text-center py-12">
						<div class="text-5xl mb-4">📭</div>
						<p class="text-surface-500">
							No transfers yet. Start one from the <a
								href="/"
								class="text-brand-400 hover:underline"
								>home page</a
							>.
						</p>
					</div>
				{:else}
					<!-- Table header -->
					<div
						class="hidden sm:grid grid-cols-12 gap-4 px-4 pb-3 text-xs font-semibold text-surface-500 uppercase tracking-wider border-b border-surface-800"
					>
						<div class="col-span-4">Source URL</div>
						<div class="col-span-1">Status</div>
						<div class="col-span-1">Size</div>
						<div class="col-span-3">Leech Link</div>
						<div class="col-span-2">Expires At</div>
						<div class="col-span-1"></div>
					</div>

					<div class="space-y-2 mt-2">
						{#each tasks as task}
							<div
								class="grid grid-cols-1 sm:grid-cols-12 gap-2 sm:gap-4 items-center p-4 rounded-xl bg-surface-800/30 hover:bg-surface-800/50 transition-colors"
							>
								<!-- Source URL -->
								<div class="col-span-4 min-w-0">
									<a
										href="/task/{task.id}"
										class="text-sm text-surface-200 hover:text-brand-400 transition-colors truncate block font-mono"
										title={task.url}
									>
										{task.url}
									</a>
								</div>

								<!-- Status -->
								<div class="col-span-1">
									<span
										class="px-2.5 py-1 rounded-full text-xs font-semibold {statusColors[
											task.status
										] ?? 'bg-surface-700 text-surface-400'}"
									>
										{task.status}
									</span>
								</div>

								<!-- Size -->
								<div
									class="col-span-1 text-surface-400 text-sm"
								>
									{formatGB(task.size_gb)}
								</div>

								<!-- Leech Link -->
								<div class="col-span-3 min-w-0">
									{#if task.status === "completed" && task.gdrive_link}
										{@const gid = extractGdriveId(
											task.gdrive_link,
										)}
										<div class="flex items-center gap-2">
											<a
												href={task.gdrive_link}
												target="_blank"
												rel="noopener"
												class="text-brand-400 hover:text-brand-300 text-xs truncate"
												title={task.gdrive_link}
											>
												📂 Drive
											</a>
											{#if gid}
									<a
										href={gid === 'direct' ? task.gdrive_link : `https://drive.usercontent.google.com/download?id=${gid}&export=download&authuser=0`}
										target="_blank"
										rel="noopener"
										class="text-emerald-400 hover:text-emerald-300 text-xs"
									>
										⬇ Download
									</a>
								{/if}
										</div>
									{:else}
										<span class="text-surface-600 text-xs"
											>—</span
										>
									{/if}
								</div>

								<!-- Expires At -->
								<div class="col-span-2">
									{#if task.status === "completed"}
										<span
											class="text-xs font-mono
											{isExpired(task) ? 'text-red-400 font-bold' : 'text-surface-400'}"
										>
											{#if isExpired(task)}
												⚠ Expired
											{:else}
												{formatExpiry(task)}
											{/if}
										</span>
									{:else}
										<span class="text-surface-600 text-xs"
											>—</span
										>
									{/if}
								</div>

								<!-- Actions -->
								<div class="col-span-1 text-right">
									<button
										on:click={() => requestDelete(task.id)}
										class="text-surface-600 hover:text-red-400 transition-colors"
										title="Delete"
									>
										🗑️
									</button>
								</div>
							</div>
						{/each}
					</div>
				{/if}
			</div>
		{/if}

		<!-- Top-Up History Tab -->
		{#if activeTab === "topups"}
			<div class="glass rounded-2xl p-6">
				<h2 class="text-lg font-bold text-white mb-6">
					Transaction History
				</h2>
				{#if transactions.length === 0}
					<div class="text-center py-12">
						<div class="text-5xl mb-4">💳</div>
						<p class="text-surface-500">
							No transactions yet. <a
								href="/topup"
								class="text-brand-400 hover:underline"
								>Buy a package</a
							> to get started.
						</p>
					</div>
				{:else}
					<div
						class="hidden sm:grid grid-cols-12 gap-4 px-4 pb-3 text-xs font-semibold text-surface-500 uppercase tracking-wider border-b border-surface-800"
					>
						<div class="col-span-2">Date</div>
						<div class="col-span-2">Type</div>
						<div class="col-span-2">Method</div>
						<div class="col-span-2 text-right">Amount (GB)</div>
						<div class="col-span-2 text-right">Amount (USD)</div>
						<div class="col-span-2">Reference</div>
					</div>
					<div class="space-y-2 mt-2">
						{#each transactions as tx}
							<div
								class="grid grid-cols-1 sm:grid-cols-12 gap-2 sm:gap-4 items-center p-4 rounded-xl bg-surface-800/30 hover:bg-surface-800/50 transition-colors"
							>
								<div
									class="col-span-2 text-surface-400 text-xs font-mono"
								>
									{formatDate(tx.created)}
								</div>
								<div class="col-span-2">
									<span
										class="px-2.5 py-1 rounded-full text-xs font-semibold
										{tx.type === 'purchase'
											? 'bg-emerald-500/20 text-emerald-300'
											: tx.type === 'usage'
												? 'bg-amber-500/20 text-amber-300'
												: tx.type === 'refund'
													? 'bg-sky-500/20 text-sky-300'
													: 'bg-surface-700 text-surface-400'}"
									>
										{txTypeLabels[tx.type] || tx.type}
									</span>
								</div>
								<div
									class="col-span-2 text-surface-400 text-sm"
								>
									{txMethodLabels[tx.method] || tx.method}
								</div>
								<div
									class="col-span-2 text-right text-sm font-semibold
									{tx.amount_gb > 0
										? 'text-emerald-400'
										: tx.amount_gb < 0
											? 'text-red-400'
											: 'text-surface-400'}"
								>
									{tx.amount_gb > 0
										? "+"
										: ""}{tx.amount_gb.toFixed(2)} GB
								</div>
								<div
									class="col-span-2 text-right text-surface-400 text-sm"
								>
									{tx.amount_usd > 0
										? `$${tx.amount_usd.toFixed(2)}`
										: "—"}
								</div>
								<div class="col-span-2 min-w-0">
									{#if tx.task_id}
										<a
											href="/task/{tx.task_id}"
											class="text-xs text-brand-400/70 hover:text-brand-300 font-mono truncate block"
										>
											{tx.task_id.slice(0, 8)}…
										</a>
									{:else}
										<span class="text-surface-600 text-xs"
											>—</span
										>
									{/if}
								</div>
							</div>
						{/each}
					</div>
				{/if}
			</div>
		{/if}
	{/if}
</div>

<!-- Custom Delete Confirmation Modal -->
<ConfirmModal
	bind:open={deleteModalOpen}
	title="Delete this task?"
	message="This action cannot be undone. The task record will be permanently removed."
	confirmText="Delete"
	cancelText="Cancel"
	icon="🗑️"
	onConfirm={confirmDelete}
	on:cancel={onCancelDelete}
/>
