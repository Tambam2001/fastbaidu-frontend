<script lang="ts">
	import {
		preview,
		createTask,
		ApiError,
		fetchBalance,
		fetchPackages,
	} from "$lib/api";
	import type { PackageTier } from "$lib/api";
	import { formatBytes } from "$lib/utils/format";
	import type { PreviewResponse, PreviewFile, UserBalance } from "$lib/types";
	import { goto } from "$app/navigation";
	import { onMount, tick } from "svelte";
	import { userStore, authModalOpen } from "$lib/stores";
	import {
		loadPreviewState,
		savePreviewState,
		clearPreviewState,
	} from "$lib/stores/previewStore";	
	import ConfirmModal from "$lib/components/ConfirmModal.svelte";

	let url = "";
	let password = "";

	// UI States: 'idle' | 'password_prompt' | 'scanning' | 'result'
	let currentState: "idle" | "password_prompt" | "scanning" | "result" = "idle";

	let previewData: PreviewResponse | null = null;
	let errorMsg = "";
	let submitLoading = false;
	let userBalance: UserBalance | null = null;
	let balanceTab: "packages" | "onetime" = "packages";
	
	let teleportModalOpen = false;
	let teleportMethod: "balance" | "onetime" = "balance";

	// Dynamic Pricing State
	let dynamicPackages: PackageTier[] = [];
	let pricingSettings = {
		base: 0.99,
		per_gb: 0.5,
	};

	// Radar texts sequence
	const radarTexts = [
		"> Connecting to Baidu Server...",
		"> Handshaking...",
		"> Retrieving file metadata...",
		"> Calculating transfer time...",
	];
	let currentRadarText = radarTexts[0];

	const isValidBaiduPattern =
		/^(https?:\/\/)?(pan|yun)\.baidu\.com\/(s\/|e\/|share\/init\?surl=)[A-Za-z0-9_-]{22,23}$/;
	$: isValidUrl = isValidBaiduPattern.test(url);

	$: displayUrlError = url.length > 0 && !isValidUrl;

	function parseShareUrl(rawInput: string) {
		let urlStr = rawInput.trim();
		let pwdStr = "";

		// Look for a 4-character password from various sources:
		// ?pwd=XXXX, &pwd=XXXX, 提取码: XXXX, or trailing 4 chars after whitespace
		const pwdMatch = urlStr.match(
			/(?:[?&]pwd=|提取码[：:\s]*|pwd[=:\s]*)([A-Za-z0-9]{4})(?:[#&\s]|$)/i,
		);
		if (pwdMatch) {
			pwdStr = pwdMatch[1];
		}

		// Look for the Baidu Share ID pattern (23 chars of alphanumeric, dash, underscore)
		const shareIdMatch = urlStr.match(
			/(pan|yun)\.baidu\.com\/(s\/|e\/|share\/init\?surl=)([A-Za-z0-9_-]{23})/i,
		);

		let finalUrl = urlStr;
		if (shareIdMatch) {
			// Reconstruct a clean, standard Baidu share link
			const domain = shareIdMatch[1]; // pan or yun
			const shareType = shareIdMatch[2]; // s/ or e/ or share/init?surl=
			const shareId = shareIdMatch[3]; // The 23-char ID

			// Always standardizing to https://pan.baidu.com/s/... for simplicity if the backend handles it.
			// The backend typically parses out the ID anyway. We will preserve the original shareType to be safe.
			finalUrl = `https://${domain}.baidu.com/${shareType}${shareId}`;
		}

		return { url: finalUrl, password: pwdStr };
	}

	function handleUrlInput(e: Event) {
		const target = e.target as HTMLInputElement;
		const val = target.value;

		if (val.length > 0) {
			const parsed = parseShareUrl(val);
			if (parsed.url !== val) {
				url = parsed.url;
				if (parsed.password && parsed.password.length === 4) {
					password = parsed.password;
				}
			}
		}
	}

	// Dynamic Math logic from Backend Settings
	$: guestPrice = previewData
		? pricingSettings.base +
			pricingSettings.per_gb * previewData.total_size_gb
		: 0;

	$: memberCredits = previewData ? previewData.total_size_gb : 0;

	// Estimated time at 80MB/s
	$: estimatedSeconds = previewData
		? (previewData.total_size_gb * 1024 * 1024 * 1024) /
			(80 * 1024 * 1024)
		: 0;

	// Balance scenario logic
	$: fileSize = previewData ? previewData.total_size_gb : 0;
	$: hasSufficientBalance =
		userBalance !== null &&
		fileSize > 0 &&
		userBalance.balance_gb >= fileSize;
	$: hasPartialBalance =
		userBalance !== null &&
		userBalance.balance_gb > 0 &&
		userBalance.balance_gb < fileSize;
	$: hasNoBalance =
		userBalance !== null && userBalance.balance_gb === 0;
	$: remainingBalance = userBalance
		? Math.max(0, userBalance.balance_gb - fileSize)
		: 0;

	// Pricing helpers
	$: oneTimePrice = pricingSettings.base + pricingSettings.per_gb * fileSize;

	// Recommend the smallest package that covers the file size
	$: recommendedPkg =
		dynamicPackages.find((p) => p.size_gb >= fileSize) ??
		dynamicPackages[dynamicPackages.length - 1];

	// Automatically fetch balance when viewing the scan result, and keep it updated
	// if the user auth state changes or if they return to this tab after recharging.
	$: if ($userStore && currentState === "result") {
		// Fetch unconditionally to ensure we have the latest balance if they just recharged
		fetchBalance()
			.then((b) => {
				userBalance = b;
			})
			.catch(() => {
				// Silent fail, userBalance remains whatever it was or null
			});
	}

	// Support visibility change to refresh balance when returning to tab
	onMount(() => {
		const handleVisibility = () => {
			if (
				document.visibilityState === "visible" &&
				$userStore &&
				currentState === "result"
			) {
				fetchBalance()
					.then((b) => (userBalance = b))
					.catch(() => {});
			}
		};
		document.addEventListener("visibilitychange", handleVisibility);
		return () =>
			document.removeEventListener("visibilitychange", handleVisibility);
	});

	async function runRadarAnimation() {
		for (let i = 0; i < radarTexts.length; i++) {
			currentRadarText = radarTexts[i];
			await new Promise((r) => setTimeout(r, 600 + Math.random() * 400));
		}
	}

	async function initiateScan() {
		if (!isValidUrl) {
			errorMsg = "Please enter a valid Baidu Pan link";
			return;
		}

		errorMsg = "";
		currentState = "scanning";

		// Run animation and API call concurrently
		const [previewRes] = await Promise.allSettled([
			preview({ url, password: password || undefined }),
			runRadarAnimation(),
		]);

		if (previewRes.status === "fulfilled") {
			previewData = previewRes.value;
			currentState = "result";
			// Fetch balance for logged-in users to determine which action panel to show
			if ($userStore) {
				try {
					userBalance = await fetchBalance();
				} catch {
					userBalance = null;
				}
			}
		} else {
			// Check if it's a password error (you might need to adjust this condition based on your actual API error structure)
			const err = previewRes.reason as ApiError;
			if (
				err.message.toLowerCase().includes("password") ||
				err.message.toLowerCase().includes("extraction code") ||
				err.status === 401
			) {
				currentState = "password_prompt";
				errorMsg = "";
			} else {
				errorMsg = err.message || "Failed to analyze link";
				currentState = "idle";
			}
		}
	}

	function requestTeleportTask(method: "balance" | "onetime") {
		teleportMethod = method;
		teleportModalOpen = true;
	}

	async function confirmTeleportTask() {
		if (!previewData) return;
		errorMsg = "";
		submitLoading = true;

		try {
			const res = await createTask({
				url,
				password: password || undefined,
				size_gb: previewData.total_size_gb,
			});

			// Clear scan state so homepage is fresh when user returns
			clearResult();
			url = "";
			password = "";

			if (res.payment_required) {
				goto(`/payment/${res.task.id}`);
			} else {
				goto(`/task/${res.task.id}`);
			}
		} catch (err) {
			errorMsg =
				err instanceof ApiError ? err.message : "Failed to create task";
			submitLoading = false;
		}
	}

	function formatTime(seconds: number): string {
		if (seconds < 60) return `${Math.round(seconds)} Seconds`;
		const m = Math.floor(seconds / 60);
		const s = Math.round(seconds % 60);
		return `${m}m ${s}s`;
	}

	function fileIcon(file: PreviewFile): string {
		if (file.is_dir) return "📁";
		const ext = file.path.split(".").pop()?.toLowerCase() || "";
		if (["mp4", "mkv", "avi"].includes(ext)) return "🎬";
		if (["zip", "rar", "7z"].includes(ext)) return "📦";
		if (["pdf", "doc", "txt"].includes(ext)) return "📄";
		return "📄";
	}

	let passInput: HTMLInputElement;

	// 16-C: Restore preview state from sessionStorage on mount & fetch prices
	onMount(() => {
		fetchPackages()
			.then((res) => {
				if (res && res.tiers) {
					dynamicPackages = res.tiers;
					if (res.default) {
						pricingSettings = {
							base: res.default.base ?? 0.99,
							per_gb: res.default.per_gb ?? 0.5,
						};
					}
				}
			})
			.catch(console.error);

		const saved = loadPreviewState();
		if (saved) {
			url = saved.url;
			password = saved.password;
			currentState = saved.currentState;
			previewData = saved.previewData;
			userBalance = saved.userBalance;
		}
	});

	// 16-C: Save preview state whenever it changes
	$: if (currentState === "result" && previewData) {
		savePreviewState({
			url,
			password,
			currentState,
			previewData,
			userBalance,
		});
	}

	function clearResult() {
		clearPreviewState();
		currentState = "idle";
		previewData = null;
		userBalance = null;
		errorMsg = "";
	}

	async function showPasswordPrompt() {
		currentState = "password_prompt";
		errorMsg = "";
		await tick();
		if (passInput) passInput.focus();
	}
</script>

<svelte:head>
	<title>FastBaidu | Teleport Files at 80MB/s</title>
</svelte:head>

<div
	class="min-h-[85vh] flex flex-col items-center justify-center p-4 relative overflow-hidden"
>
	<!-- Background Elements -->
	<div class="absolute inset-0 bg-surface-950 -z-20"></div>
	<div
		class="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-surface-900 via-surface-950 to-surface-950 -z-10"
	></div>

	<!-- Shared Header (Always visible) -->
	<div
		class="text-center mb-10 max-w-4xl w-full px-4 z-10 transition-all duration-500 {currentState !==
		'idle'
			? 'opacity-0 h-0 overflow-hidden mb-0 scale-95'
			: 'opacity-100 scale-100'}"
	>
		<h1
			class="text-4xl sm:text-5xl font-extrabold text-white tracking-tight mb-4"
		>
			Download Baidu Files <br />
			<span
				class="text-transparent bg-clip-text bg-gradient-to-r from-brand-300 to-brand-500"
				>Without SVIP Limits</span
			>
		</h1>
		<p class="text-surface-400 text-lg sm:text-xl font-medium">
			No queues. No speed limits. Just paste your link and fly.
		</p>
	</div>

	<!-- Main Interaction Area -->
	<div class="w-full max-w-3xl relative z-10">
		{#if errorMsg && currentState !== "password_prompt"}
			<div
				class="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-center font-medium animate-fade-in"
			>
				{errorMsg}
			</div>
		{/if}

		<!-- STATE 1: IDLE -->
		{#if currentState === "idle"}
			<div class="animate-fade-in">
				<form
					on:submit|preventDefault={() => {
						initiateScan();
					}}
					class="relative group"
				>
					<!-- Glow effect behind input -->
					<div
						class="absolute -inset-1 bg-gradient-to-r from-brand-500 to-blue-500 rounded-2xl blur opacity-20 group-focus-within:opacity-40 transition duration-1000 group-hover:duration-200"
					></div>

					<div
						class="relative flex flex-col sm:flex-row bg-surface-900 border border-surface-700/50 rounded-2xl overflow-hidden shadow-2xl transition-all duration-300 {displayUrlError
							? 'border-red-500/50 shadow-red-500/10'
							: ''}"
					>
						<div class="flex-1 relative flex items-center">
							<input
								type="url"
								bind:value={url}
								on:input={handleUrlInput}
								placeholder="Paste Baidu Pan link (share text supported)..."
								class="w-full bg-transparent px-6 py-5 pr-24 text-lg text-white placeholder:text-surface-500 focus:outline-none"
							/>
							{#if url}
								<div
									class="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-3 animate-fade-in"
								>
									<div
										class="w-px h-8 bg-surface-700/80"
									></div>
									<input
										type="text"
										bind:value={password}
										placeholder="PWD"
										maxlength="4"
										class="w-14 bg-surface-950/50 border border-surface-600 text-center rounded-lg px-1 py-1.5 text-sm text-brand-400 font-mono tracking-widest focus:outline-none focus:border-brand-500 transition-colors placeholder:tracking-normal"
									/>
								</div>
							{/if}
						</div>

						<button
							type="submit"
							disabled={!url || displayUrlError}
							class="px-8 py-5 sm:w-auto w-full bg-white text-surface-950 font-black text-lg sm:text-xl tracking-wide hover:bg-surface-200 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2 group/btn"
						>
							<span
								class="text-yellow-500 group-hover/btn:scale-110 transition-transform"
								>⚡</span
							> SCAN
						</button>
					</div>

					{#if displayUrlError}
						<div
							class="absolute -bottom-8 left-2 text-red-500 text-xs sm:text-sm font-semibold animate-fade-in flex items-center gap-1.5"
						>
							<svg
								class="w-4 h-4"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
								/>
							</svg>
							Invalid Baidu link. Please check the format. (Share ID
							length must be 23 characters)
						</div>
					{/if}
				</form>

				<!-- Trust Badges -->
				<div
					class="mt-8 flex flex-col md:flex-row flex-wrap justify-center items-start md:items-center gap-x-6 gap-y-3 text-sm font-medium text-surface-400 mx-auto w-fit"
				>
					<div class="flex items-start gap-2 text-left">
						<span class="text-brand-500 shrink-0">✅</span>
						<span>High-Speed Cloud Transfers</span>
					</div>
					<div class="flex items-start gap-2 text-left">
						<span class="text-brand-500 shrink-0">✅</span>
						<span
							>100% Privacy <span class="text-surface-600"
								>(Auto-delete)</span
							></span
						>
					</div>
					<div class="flex items-start gap-2 text-left">
						<span class="text-brand-500 shrink-0">✅</span>
						<span>No Account Needed for Preview</span>
					</div>
				</div>
			</div>
		{/if}

		<!-- STATE 2: SCANNING & ANIMATION -->
		{#if currentState === "scanning"}
			<div
				class="bg-surface-900 border border-surface-700/50 rounded-2xl p-8 sm:p-12 shadow-2xl relative overflow-hidden animate-fade-in"
			>
				<!-- Radar Beam Overlay -->
				<div class="absolute inset-0 pointer-events-none">
					<div
						class="absolute inset-y-0 w-32 bg-gradient-to-r from-transparent via-brand-500/20 to-transparent animate-[radar_2s_linear_infinite]"
					></div>
				</div>

				<div
					class="flex flex-col items-center justify-center space-y-8 relative z-10 h-32"
				>
					<!-- Spinner / Tech Element -->
					<div class="relative w-16 h-16">
						<div
							class="absolute inset-0 rounded-full border-t-2 border-brand-400 animate-spin"
						></div>
						<div
							class="absolute inset-2 rounded-full border-r-2 border-blue-400 animate-[spin_1.5s_linear_infinite_reverse]"
						></div>
						<div
							class="absolute inset-4 rounded-full border-b-2 border-emerald-400 animate-spin"
						></div>
					</div>

					<!-- Text Sequence -->
					<div
						class="font-mono text-emerald-400 text-lg text-center h-6 overflow-hidden"
					>
						{#key currentRadarText}
							<div
								class="animate-[slide-up_0.3s_ease-out_forwards]"
							>
								{currentRadarText}
							</div>
						{/key}
					</div>
				</div>
			</div>
		{/if}

		<!-- STATE 3: RESULT PANEL -->
		{#if currentState === "result" && previewData}
			<div
				class="bg-surface-900 border border-surface-700/50 rounded-2xl shadow-2xl overflow-hidden animate-fade-in flex flex-col"
			>
				<!-- Panel Header -->
				<div
					class="bg-surface-950/50 px-6 py-5 border-b border-surface-800 flex items-center gap-4"
				>
					<div
						class="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center"
					>
						<div
							class="w-3 h-3 rounded-full bg-emerald-500 animate-pulse"
						></div>
					</div>
					<div class="flex-1">
						<h2 class="text-emerald-400 font-bold tracking-wide">
							SCAN COMPLETE
						</h2>
						<p class="text-surface-300 text-sm">
							File is online and ready to teleport.
						</p>
					</div>
					<button
						on:click={clearResult}
						class="w-10 h-10 rounded-xl flex items-center justify-center text-surface-300 bg-surface-800 hover:text-white hover:bg-red-500/20 hover:border-red-500/30 border border-surface-700 transition-all text-lg font-bold"
						title="New scan">✕</button
					>
				</div>

				<div class="p-6 sm:p-8 space-y-8">
					<!-- Section A: File Structure -->
					<div
						class="border border-surface-700/50 rounded-xl bg-surface-950/30 font-mono text-sm p-4 overflow-hidden relative"
					>
						<div
							class="absolute top-0 right-0 px-3 py-1 bg-surface-800 text-surface-400 rounded-bl-xl text-xs"
						>
							Preview
						</div>

						{#if previewData.files.length > 0}
							{@const firstFile = previewData.files[0]}
							{@const isSingleFile =
								previewData.files.length === 1 &&
								!firstFile.is_dir}

							{#if isSingleFile}
								<div
									class="flex items-center gap-2 text-surface-200"
								>
									<span>{fileIcon(firstFile)}</span>
									<span class="truncate"
										>{firstFile.name}</span
									>
									<span class="text-surface-500"
										>{formatBytes(firstFile.size, 0)}</span
									>
								</div>
							{:else}
								<!-- Tree View Simulation -->
								<div
									class="text-surface-200 flex items-center gap-2 mb-2"
								>
									<span>📁</span>
									<span
										class="font-bold border-b border-surface-700/50 pb-0.5"
										>Scanned_Content_Root</span
									>
								</div>
								<div
									class="pl-4 border-l border-surface-700/50 ml-2 space-y-2 text-surface-400"
								>
									{#each previewData.files.slice(0, 4) as file, i}
										<div class="flex items-center gap-2">
											<span class="text-surface-600"
												>{i ===
													previewData.files.slice(
														0,
														4,
													).length -
														1 &&
												previewData.files.length <= 4
													? "└──"
													: "├──"}</span
											>
											<span>{fileIcon(file)}</span>
											<span
												class="truncate max-w-[200px] sm:max-w-xs text-surface-300"
												>{file.name}</span
											>
											{#if !file.is_dir}
												<span class="text-surface-500"
													>({formatBytes(
														file.size,
														0,
													)})</span
												>
											{/if}
										</div>
									{/each}
									{#if previewData.files.length > 4}
										<div
											class="flex items-center gap-2 text-surface-500 italic"
										>
											<span class="text-surface-600"
												>└──</span
											>
											... and {previewData.files.length -
												4} more files/folders.
										</div>
									{/if}
								</div>
							{/if}
						{:else}
							<div class="text-surface-500 italic">
								Empty folder.
							</div>
						{/if}
					</div>

					<!-- Section B: The Analysis (The Math) -->
					<div
						class="grid grid-cols-2 bg-surface-800/40 rounded-xl p-1 relative overflow-hidden"
					>
						<!-- Progress bar background effect -->
						<div
							class="absolute inset-y-0 left-0 bg-brand-500/5 w-full"
						></div>

						<div
							class="p-4 relative z-10 flex flex-col items-center border-r border-surface-700/50"
						>
							<span
								class="text-surface-400 text-xs font-bold uppercase tracking-wider mb-1 flex items-center gap-1.5"
							>
								<span>📦</span> TOTAL SIZE
							</span>
							<span
								class="text-2xl sm:text-3xl font-black text-white"
								>{previewData.total_size_gb.toFixed(2)} GB</span
							>
						</div>
						<div
							class="p-4 relative z-10 flex flex-col items-center"
						>
							<span
								class="text-surface-400 text-xs font-bold uppercase tracking-wider mb-1 flex items-center gap-1.5"
							>
								<span>⏱️</span> EST. TIME
								<span class="normal-case opacity-60"
									>(80MB/s)</span
								>
							</span>
							<span
								class="text-2xl sm:text-3xl font-black text-brand-400"
								>~ {formatTime(estimatedSeconds)}</span
							>
						</div>
					</div>

					<!-- Section C: FINAL ACTION AREA -->
					<div class="mt-8">
						<!-- ====================== ACTION AREA ====================== -->
						<!-- Account Status Bar -->
						{#if $userStore && userBalance}
							<div
								class="mt-5 flex items-center justify-between px-4 py-2.5 rounded-xl bg-surface-800/60 border border-surface-700/50 text-sm"
							>
								<span class="text-surface-400">
									Your Balance: <strong class="text-brand-400"
										>{userBalance.balance_gb.toFixed(2)} GB</strong
									>
									<span class="mx-2 text-surface-700">|</span>
									Status:
									<span
										class="{userBalance.balance_gb >= 1
											? 'text-emerald-400'
											: 'text-surface-400'} font-semibold"
										>{userBalance.balance_gb >= 1
											? "Premium Member"
											: "Free Account"}</span
									>
								</span>
								<button
									on:click={() => goto("/dashboard")}
									class="px-3 py-1 rounded-lg bg-brand-500/20 hover:bg-brand-500/30 text-brand-400 font-semibold text-xs transition-colors"
									>💳 RECHARGE</button
								>
							</div>
						{/if}

						{#if $userStore}
							{#if userBalance === null}
								<div
									class="mt-4 h-14 rounded-xl bg-surface-800/50 animate-pulse"
								></div>
							{:else if hasSufficientBalance}
								<!-- CASE 1: Balance >= File Size -->
								<div
									class="mt-5 rounded-xl border border-surface-700/60 bg-surface-800/40 overflow-hidden"
								>
									<div
										class="px-4 py-2.5 bg-surface-800/80 border-b border-surface-700/50"
									>
										<h3
											class="text-xs font-bold text-surface-400 tracking-widest uppercase"
										>
											⚡ Transfer Summary
										</h3>
									</div>
									<div class="p-5">
										<div
											class="grid grid-cols-3 gap-3 mb-5 text-center"
										>
											<div
												class="rounded-lg bg-surface-900/60 p-3"
											>
												<p
													class="text-xs text-surface-500 mb-1"
												>
													Current Balance
												</p>
												<p
													class="text-base font-bold text-white"
												>
													{userBalance.balance_gb.toFixed(
														2,
													)} GB
												</p>
											</div>
											<div
												class="rounded-lg bg-red-500/10 p-3"
											>
												<p
													class="text-xs text-surface-500 mb-1"
												>
													Transfer Cost
												</p>
												<p
													class="text-base font-bold text-red-400"
												>
													−{fileSize.toFixed(2)} GB
												</p>
											</div>
											<div
												class="rounded-lg bg-emerald-500/10 p-3"
											>
												<p
													class="text-xs text-surface-500 mb-1"
												>
													Remaining
												</p>
												<p
													class="text-base font-bold text-emerald-400"
												>
													{remainingBalance.toFixed(
														2,
													)} GB
												</p>
											</div>
										</div>
										<div class="flex gap-3">
										<button
											on:click={clearResult}
											class="px-5 py-3.5 rounded-xl bg-surface-800 hover:bg-red-500/20 text-surface-300 hover:text-white font-semibold transition-all border border-surface-700 hover:border-red-500/30"
										>Cancel</button>
										<button
											on:click={() =>
												requestTeleportTask("balance")}
											disabled={submitLoading}
											class="relative flex-1 py-3.5 rounded-xl bg-brand-500 hover:bg-brand-400 text-white font-black transition-all hover:scale-[1.01] active:scale-[0.99] shadow-lg shadow-brand-500/30 overflow-hidden group"
										>
											<span
												class="absolute inset-0 w-1/4 h-full bg-white/20 skew-x-12 -ml-[100%] group-hover:animate-[shine_0.7s_ease-out_forwards]"
											></span>
											{submitLoading
												? "⏳ Starting..."
												: "🚀 START TELEPORT NOW"}
										</button>
										</div>
									</div>
								</div>
							{:else if hasPartialBalance}
								<!-- CASE 2: Partial Balance -->
								<div
									class="mt-5 rounded-xl border border-amber-500/30 bg-surface-800/40 overflow-hidden"
								>
									<div
										class="px-4 py-2.5 bg-amber-500/10 border-b border-amber-500/20 flex items-center gap-2"
									>
										<span>⚠️</span>
										<h3
											class="text-xs font-bold text-amber-300 tracking-widest uppercase"
										>
											Insufficient Balance
										</h3>
									</div>
									<div class="p-5">
										<p
											class="text-sm text-surface-400 mb-4"
										>
											You need <strong class="text-white"
												>{fileSize.toFixed(2)} GB</strong
											>
											but only have
											<strong class="text-amber-400"
												>{userBalance.balance_gb.toFixed(
													2,
												)} GB</strong
											>.
										</p>
										<div
											class="flex rounded-lg overflow-hidden border border-surface-700 mb-5"
										>
											<button
												on:click={() =>
													(balanceTab = "packages")}
												class="flex-1 py-2 text-sm font-semibold transition-colors {balanceTab ===
												'packages'
													? 'bg-brand-500 text-white'
													: 'text-surface-400 hover:text-white'}"
												>Recharge Packages</button
											>
											<button
												on:click={() =>
													(balanceTab = "onetime")}
												class="flex-1 py-2 text-sm font-semibold transition-colors {balanceTab ===
												'onetime'
													? 'bg-brand-500 text-white'
													: 'text-surface-400 hover:text-white'}"
												>One-time Transfer</button
											>
										</div>
										{#if balanceTab === "packages"}
											<div class="space-y-2 mb-5">
												{#each dynamicPackages as pkg}
													<div
														class="flex items-center justify-between p-3 rounded-lg border {pkg ===
														recommendedPkg
															? 'border-amber-400/60 bg-amber-400/10'
															: 'border-surface-700 bg-surface-900/40'}"
													>
														<div>
															<span
																class="font-bold text-white text-sm"
																>${pkg.price}
																→ {pkg.size_gb}
																GB</span
															>
															<span
																class="text-xs text-surface-500 ml-2"
																>(${(
																	pkg.price /
																	pkg.size_gb
																).toFixed(
																	2,
																)}/GB)</span
															>
															{#if pkg === recommendedPkg}<span
																	class="ml-2 text-xs px-1.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-semibold"
																	>Recommended</span
																>{/if}
														</div>
														<button
															on:click={() =>
																goto(
																	"/dashboard",
																)}
															class="px-3 py-1 text-xs rounded-lg font-semibold {pkg ===
															recommendedPkg
																? 'bg-amber-500 text-black'
																: 'bg-surface-700 text-white'} transition-colors"
															>Buy</button
														>
													</div>
												{/each}
											</div>
										{:else}
											<div
												class="p-4 rounded-xl bg-surface-900/60 border border-surface-700 mb-5 text-center"
											>
												<p
													class="text-3xl font-black text-white"
												>
													${oneTimePrice.toFixed(2)}
												</p>
												<p
													class="text-sm text-surface-500"
												>
													One-time transfer for this
													file
												</p>
											</div>
										{/if}
										<button
											on:click={() => goto("/dashboard")}
											class="w-full py-3.5 rounded-xl bg-brand-500 hover:bg-brand-400 text-white font-black transition-all hover:scale-[1.01] shadow-lg shadow-brand-500/30"
											>💳 TOP UP & START</button
										>
									</div>
								</div>
							{:else if hasNoBalance}
								<!-- CASE 3: Zero balance -->
								<div class="mt-5">
									<h3
										class="text-center text-xs font-bold text-surface-400 uppercase tracking-widest mb-4"
									>
										Choose Your Plan
									</h3>
									<div class="grid sm:grid-cols-2 gap-4">
										<div
											class="flex flex-col h-full rounded-xl border-2 border-brand-500/60 bg-brand-500/10 p-5"
										>
											<h4
												class="text-xs font-bold uppercase text-brand-300 tracking-wider mb-3"
											>
												🚀 Member Packages
											</h4>
											<div class="space-y-1.5 mb-4">
												{#each dynamicPackages as pkg}
													<div
														class="flex justify-between text-sm"
													>
														<span
															class="text-surface-300"
															>${pkg.price}
															→ {pkg.size_gb} GB</span
														>
														<span
															class="text-surface-500 text-xs"
															>${(
																pkg.price /
																pkg.size_gb
															).toFixed(
																2,
															)}/GB</span
														>
													</div>
												{/each}
											</div>
											<button
												on:click={() => goto("/topup")}
												class="w-full mt-auto py-3 rounded-xl bg-brand-500 hover:bg-brand-400 text-white font-black transition-all hover:scale-[1.01] shadow-lg shadow-brand-500/30"
												>🚀 RECHARGE NOW</button
											>
										</div>
										<div
											class="flex flex-col h-full rounded-xl border border-surface-700/60 bg-surface-800/30 p-5"
										>
											<h4
												class="text-xs font-bold uppercase text-surface-400 tracking-wider mb-3"
											>
												💳 One-time Transfer
											</h4>
											<p
												class="text-3xl font-black text-white mb-1"
											>
												${oneTimePrice.toFixed(2)}
											</p>
											<p class="text-xs text-surface-500">
												Price for this file
											</p>
											<div
												class="mt-2 mb-4 p-2 rounded-lg bg-surface-900/50 border border-surface-700/30 text-[11px] text-surface-400 font-mono tracking-tight flex flex-col gap-1"
											>
												<div
													class="flex justify-between"
												>
													<span>Base Fee:</span>
													<span
														>${pricingSettings.base.toFixed(
															2,
														)}</span
													>
												</div>
												<div
													class="flex justify-between"
												>
													<span
														>Data Cost (${pricingSettings.per_gb.toFixed(
															2,
														)}/GB):</span
													>
													<span
														>+ ${(
															pricingSettings.per_gb *
															fileSize
														).toFixed(2)}</span
													>
												</div>
												<div
													class="border-t border-surface-700/50 mt-1 pt-1 flex justify-between text-surface-300 font-bold"
												>
													<span>Total:</span>
													<span
														>${oneTimePrice.toFixed(
															2,
														)}</span
													>
												</div>
											</div>
											<button
												on:click={() =>
													requestTeleportTask("onetime")}
												disabled={submitLoading}
												class="w-full mt-auto py-3 rounded-xl border border-surface-600 bg-surface-800 hover:bg-surface-700 text-white font-bold transition-all"
												>PAY FOR THIS FILE</button
											>
										</div>
									</div>
								</div>
							{/if}
						{:else}
							<!-- NOT LOGGED IN / GUEST CHECKOUT -->
							<div class="mt-5 max-w-2xl mx-auto space-y-4">
								<div class="grid sm:grid-cols-2 gap-4">
									<!-- Guest Checkout Quick Action -->
									<button
										on:click={() =>
											requestTeleportTask("onetime")}
										disabled={submitLoading}
										class="w-full py-3.5 rounded-xl border border-surface-600 bg-surface-800 hover:bg-surface-700 hover:border-surface-500 text-white font-bold transition-all flex flex-col items-center justify-center gap-1"
									>
										<span class="text-base"
											>⚡ PAY ${guestPrice.toFixed(
												2,
											)}</span
										>
										<span
											class="text-xs text-surface-400 font-normal"
											>One-time guest transfer</span
										>
									</button>

									<!-- Login & Save Main Action -->
									<button
										on:click={() => ($authModalOpen = true)}
										disabled={submitLoading}
										class="relative w-full py-3.5 rounded-xl bg-brand-500 hover:bg-brand-400 text-white font-black transition-all hover:scale-[1.01] shadow-lg shadow-brand-500/30 overflow-hidden group flex flex-col items-center justify-center gap-1"
									>
										<span
											class="absolute inset-0 w-1/4 h-full bg-white/20 skew-x-12 -ml-[100%] group-hover:animate-[shine_0.7s_ease-out_forwards]"
										></span>
										<span class="text-base z-10 relative"
											>🚀 LOGIN & GET FREE CREDITS</span
										>
										<span
											class="text-[11px] text-blue-50 font-medium z-10 relative bg-black/20 px-2.5 py-0.5 rounded-full backdrop-blur-sm border border-white/10 mt-0.5 tracking-wide"
										>
											Sign up to buy packages & save
										</span>
									</button>
								</div>
								<button
									on:click={() => ($authModalOpen = true)}
									class="w-full py-2.5 text-sm rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20 hover:text-emerald-300 transition-colors flex items-center justify-center gap-2 font-semibold"
								>
									🎁 Link Telegram for +1GB Free Quota
								</button>
							</div>
						{/if}
						<!-- ===================== END ACTION AREA ===================== -->
					</div>
				</div>
			</div>
		{/if}
	</div>
</div>

<!-- EDGE CASE: PASSWORD REQUIRED MODAL -->
{#if currentState === "password_prompt"}
	<div
		class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-surface-950/80 backdrop-blur-sm animate-fade-in"
	>
		<div
			class="bg-surface-900 border border-surface-700/50 rounded-2xl w-full max-w-sm shadow-2xl relative overflow-hidden"
			role="button"
			tabindex="0"
			on:click|stopPropagation={() => {}}
			on:keydown|stopPropagation={(e) => {
				if (e.key === 'Enter' || e.key === ' ') {
					e.preventDefault();
				}
			}}
		>
			<div
				class="h-2 w-full bg-gradient-to-r from-amber-500 to-orange-500"
			></div>

			<div class="p-6">
				<div
					class="w-12 h-12 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-500 text-2xl mb-4"
				>
					🔒
				</div>
				<h3 class="text-xl font-bold text-white mb-2">
					Protected Link
				</h3>
				<p class="text-surface-400 mb-6 text-sm">
					This Baidu link requires an access code.
					{#if errorMsg}<br /><span class="text-red-400 mt-1 block"
							>{errorMsg}</span
						>{/if}
				</p>

				<form
					on:submit|preventDefault={() => {
						initiateScan();
					}}
				>
					<input
						bind:this={passInput}
						type="text"
						bind:value={password}
						placeholder="Enter 4-digit code"
						maxlength="4"
						class="w-full bg-surface-950 border border-surface-700 rounded-xl px-4 py-3 text-center text-xl tracking-[1em] text-white font-mono placeholder:tracking-normal placeholder:text-sm placeholder:text-surface-600 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors mb-4"
						required
					/>

					<div class="flex gap-3">
						<button
							type="button"
							on:click={() => {
								currentState = "idle";
								password = "";
							}}
							class="flex-1 py-3 rounded-xl border border-surface-700 text-surface-300 font-semibold hover:bg-surface-800 transition-colors"
						>
							CANCEL
						</button>
						<button
							type="submit"
							class="flex-1 py-3 rounded-xl bg-amber-500 text-surface-950 font-bold hover:bg-amber-400 transition-colors"
						>
							UNLOCK
						</button>
					</div>
				</form>
			</div>
		</div>
	</div>
{/if}

<ConfirmModal
	bind:open={teleportModalOpen}
	title="Confirm Teleport"
	message={previewData ? `Are you sure you want to spend ${previewData.total_size_gb.toFixed(2)} GB to teleport this file? This action cannot be canceled.` : "Are you sure you want to proceed?"}
	confirmText="Start Teleport"
	cancelText="Go Back"
	icon="🚀"
	confirmClass="bg-brand-500 text-white hover:bg-brand-400 border border-brand-500/30 shadow-brand-500/20"
	onConfirm={confirmTeleportTask}
/>

<style>
	@keyframes radar {
		0% {
			transform: translateX(-100%) skewX(-15deg);
		}
		100% {
			transform: translateX(400%) skewX(-15deg);
		}
	}
	@keyframes slide-up {
		0% {
			transform: translateY(100%);
			opacity: 0;
		}
		100% {
			transform: translateY(0);
			opacity: 1;
		}
	}
	@keyframes shine {
		100% {
			margin-left: 200%;
		}
	}
</style>
