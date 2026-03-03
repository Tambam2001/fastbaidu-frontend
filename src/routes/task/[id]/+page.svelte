<script lang="ts">
	import { onMount, onDestroy } from "svelte";
	import { goto } from "$app/navigation";
	import { getTask, ApiError } from "$lib/api";
	import {
		formatBytes,
		formatSpeed,
		formatETA,
		formatDate,
		formatGB,
		formatUSD,
	} from "$lib/utils/format";
	import type { Task, ProgressEvent, TaskStatus } from "$lib/types";
	import { subscribeJob } from "$lib/api/sse";
	type ProgressSubscription = { unsubscribe: () => void } | (() => void);

	export let data: any;
	$: taskId = data.taskId;

	let task: Task | null = null;
	let progress: ProgressEvent | null = null;
	let error = "";
	let loading = true;
	let sub: ProgressSubscription | null = null;
	let copied = false;

	const statusSteps: { key: string; label: string; icon: string }[] = [
		{ key: "pending", label: "Queued", icon: "⏳" },
		{ key: "transferring", label: "Transferring", icon: "⚡" },
		{ key: "completed", label: "Completed", icon: "✅" },
	];

	$: visualStatus = (() => {
		if (!task) return "";
		// Map all active backend stages to 'transferring' for progress bar
		const activeStages = ['processing', 'parsing', 'transferring', 'downloading', 'uploading', 'running'];
		if (activeStages.includes(task.status)) return "transferring";
		if (task.status === 'complete') return 'completed';
		return task.status;
	})();

	$: overallPercent = (() => {
		if (!task) return 0;
		return progress?.percent ?? 0;
	})();

	$: gdriveId = (() => {
		if (!task?.gdrive_link) return null;
		// Handle: https://drive.usercontent.google.com/download?id=XXX&...
		const matchId = task.gdrive_link.match(/[?&]id=([a-zA-Z0-9_-]+)/);
		if (matchId) return matchId[1];
		// Handle: https://drive.google.com/file/d/XXX/view
		const matchD = task.gdrive_link.match(/\/d\/([a-zA-Z0-9_-]+)/);
		if (matchD) return matchD[1];
		// If it's any HTTP URL, treat as direct link (no GDrive ID needed)
		if (task.gdrive_link.startsWith('http')) return 'direct';
		return null;
	})();

	function getStepIndex(status: string): number {
		if (status === "failed" || status === "pending_payment") return -1;
		return statusSteps.findIndex((s) => s.key === status);
	}

	function isStepActive(stepIndex: number, currentStatus: string): boolean {
		const current = getStepIndex(currentStatus);
		return current >= stepIndex;
	}

	function isStepCurrent(stepIndex: number, currentStatus: string): boolean {
		return getStepIndex(currentStatus) === stepIndex;
	}

	let pollInterval: ReturnType<typeof setInterval> | null = null;

	// Map backend job status to frontend task status
	function mapStatus(s: string): string {
		switch (s) {
			case 'done': return 'completed';
			case 'running': return 'processing';
			default: return s; // pending, failed, cancelled
		}
	}

	let sseActive = false;

	async function loadTask() {
		try {
			const job: any = await getTask(taskId);
			// Parse payload and result (they come as JSON strings or objects)
			const payload = typeof job.payload === 'string' ? JSON.parse(job.payload) : (job.payload || {});
			const result = typeof job.result === 'string' ? JSON.parse(job.result) : (job.result || {});
			
			// Don't overwrite task status while SSE is actively sending progress
			const currentStatus = sseActive && task ? task.status : mapStatus(job.status) as TaskStatus;
			
			// Map job fields to task UI fields
			task = {
				...job,
				status: currentStatus,
				url: payload.share_url || '',
				gdrive_link: result.cloud_path || '',
				total_size: result.total_bytes || 0,
				size_gb: (result.total_bytes || 0) / (1024 * 1024 * 1024),
				total_files: result.total_files || 0,
				error_msg: job.error_msg || '',
				created: job.created_at || '',
			};
			
			// Stop polling if task is done
			if (task && ['completed', 'failed', 'cancelled'].includes(mapStatus(job.status))) {
				task.status = mapStatus(job.status) as TaskStatus;
				if (pollInterval) { clearInterval(pollInterval); pollInterval = null; }
				sseActive = false;
			}
			
			if (task && task.status === "pending_payment") {
				goto(`/payment/${taskId}`);
				return;
			}
		} catch (err) {
			error =
				err instanceof ApiError ? err.message : "Failed to load task";
		} finally {
			loading = false;
		}
	}

	function startSSE() {
		sseActive = true;
		const stopFnc = subscribeJob(taskId, {
			onProgress: (event) => {
				progress = event;
				// Update local task status based on SSE stage
				if (task && event.stage) {
					task.status = event.stage as TaskStatus;
				}
				// Auto-refresh task when completed/failed
				if (event.stage === "completed" || event.stage === "failed") {
					sseActive = false;
					loadTask();
					if (sub) {
						typeof sub === 'function' ? sub() : sub.unsubscribe();
					}
					if (pollInterval) { clearInterval(pollInterval); pollInterval = null; }
				}
			},
			onDone: () => {
				// The backend closed the connection normally. We can trigger a reload.
				sseActive = false;
				loadTask();
			},
			onError: (err) => {
				console.warn("SSE error:", err);
				sseActive = false;
				// Reload task on SSE disconnect
				loadTask();
			}
		});
		sub = stopFnc;
	}

	async function copyLink() {
		if (task?.gdrive_link) {
			await navigator.clipboard.writeText(task.gdrive_link);
			copied = true;
			setTimeout(() => (copied = false), 2000);
		}
	}

	async function retryTask() {
		if (task) {
			goto(`/?url=${encodeURIComponent(task.url)}`);
		}
	}

	onMount(async () => {
		await loadTask();
		if (task && !["completed", "failed", "cancelled"].includes(task.status)) {
			startSSE();
			// Light polling as fallback — only 30s, won't overwrite status while SSE active
			pollInterval = setInterval(loadTask, 30000);
		}
	});

	onDestroy(() => {
		if (sub) {
			typeof sub === 'function' ? sub() : sub.unsubscribe();
		}
		if (pollInterval) clearInterval(pollInterval);
	});
</script>

<svelte:head>
	<title>Task {taskId} — FastBaidu</title>
</svelte:head>

<div class="max-w-3xl mx-auto px-4 py-12">
	{#if loading}
		<!-- Loading skeleton -->
		<div class="space-y-6 animate-pulse">
			<div class="h-8 w-1/3 bg-surface-800 rounded-lg"></div>
			<div class="h-24 bg-surface-800 rounded-2xl"></div>
			<div class="h-48 bg-surface-800 rounded-2xl"></div>
		</div>
	{:else if error}
		<div class="text-center py-20">
			<div class="text-6xl mb-4">😵</div>
			<h2 class="text-2xl font-bold text-white mb-2">Task Not Found</h2>
			<p class="text-surface-400 mb-6">{error}</p>
			<a
				href="/"
				class="px-6 py-3 rounded-xl gradient-brand text-white font-semibold"
			>
				Go Home
			</a>
		</div>
	{:else if task}
		<!-- Task Header -->
		<div class="mb-8">
			<div class="flex items-center gap-3 mb-2">
				<h1 class="text-2xl font-bold text-white">Transfer Status</h1>
				<span
					class="px-3 py-1 rounded-full text-xs font-semibold
					{visualStatus === 'completed'
						? 'bg-emerald-500/20 text-emerald-300'
						: visualStatus === 'failed'
							? 'bg-red-500/20 text-red-300'
							: visualStatus === 'transferring'
								? 'bg-brand-500/20 text-brand-300 px-4 pulse-glow'
								: 'bg-amber-500/20 text-amber-300'}"
				>
					{visualStatus === "transferring"
						? "Transferring..."
						: task.status}
				</span>
			</div>
			<p class="text-surface-500 text-sm font-mono">ID: {task.id}</p>
		</div>

		<!-- Progress Steps -->
		{#if task.status !== "failed"}
			<div class="mb-8 glass rounded-2xl p-6">
				<div class="flex items-center justify-between">
					{#each statusSteps as step, i}
						<div class="flex flex-col items-center flex-1">
							<div class="relative">
								<div
									class="w-12 h-12 rounded-full flex items-center justify-center text-xl transition-all duration-500
									{isStepActive(i, visualStatus)
										? isStepCurrent(i, visualStatus)
											? 'gradient-brand shadow-lg shadow-brand-500/30 pulse-glow'
											: 'bg-emerald-500/20'
										: 'bg-surface-800'}"
								>
									{step.icon}
								</div>
								{#if isStepCurrent(i, visualStatus) && !["completed", "failed"].includes(visualStatus)}
									<div
										class="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-brand-500 animate-ping"
									></div>
								{/if}
							</div>
							<span
								class="mt-2 text-xs font-medium
								{isStepActive(i, visualStatus) ? 'text-white' : 'text-surface-600'}"
							>
								{step.label}
							</span>
						</div>
						{#if i < statusSteps.length - 1}
							<div
								class="flex-1 h-0.5 mx-2 mt-[-22px] rounded-full transition-all duration-500
								{isStepActive(i + 1, visualStatus) ? 'bg-emerald-500/50' : 'bg-surface-800'}"
							></div>
						{/if}
					{/each}
				</div>
			</div>
		{/if}

		<!-- Transferring Progress Bar -->
		{#if visualStatus === "transferring"}
			<div class="space-y-4 mb-8">
				<div class="glass rounded-2xl p-6">
					<div class="flex items-center justify-between mb-3">
						<span class="text-sm font-medium text-surface-300"
							>⚡ {progress?.message || 'Processing...'}</span
						>
						<span class="text-sm font-bold text-brand-400">
							{overallPercent.toFixed(1)}%
						</span>
					</div>
					<div
						class="w-full h-3 bg-surface-800 rounded-full overflow-hidden"
					>
						<div
							class="h-full rounded-full gradient-brand progress-striped transition-all duration-500"
							style="width: {overallPercent}%"
						></div>
					</div>
					<div
						class="flex justify-between mt-3 text-xs text-surface-500 font-mono"
					>
						<span
							>{formatBytes(progress?.processed_bytes || 0)} / {formatBytes(
								progress?.total_bytes || task.total_size || 0,
							)}</span
						>
						<span>{formatSpeed(progress?.speed_bps || 0)}</span>
						<span>ETA: {progress?.speed_bps ? formatETA(progress?.eta_seconds ?? 0) : '—'}</span
						>
					</div>
				</div>
			</div>
		{/if}

		<!-- Completed: Result Banner -->
		{#if visualStatus === "completed"}
			<div
				class="glass rounded-2xl p-6 border-emerald-500/20 text-center mb-8 flex flex-col sm:flex-row items-center justify-center gap-4"
			>
				<div class="text-4xl">🎉</div>
				<div class="text-center sm:text-left">
					<h2 class="text-xl font-bold text-emerald-400">
						Transfer Complete!
					</h2>
					<p class="text-sm text-surface-400 mt-1">
						Your files are securely stored on Google Drive.
					</p>
				</div>
			</div>
		{/if}

		<!-- Failed: Error Card -->
		{#if task.status === "failed"}
			<div class="glass rounded-2xl p-8 border-red-500/20">
				<div class="text-center mb-6">
					<div class="text-6xl mb-4">❌</div>
					<h2 class="text-2xl font-bold text-white mb-2">
						Transfer Failed
					</h2>
				</div>

				{#if task.message}
					<div
						class="p-4 rounded-xl bg-red-500/10 border border-red-500/20 mb-6"
					>
						<p class="text-sm text-red-300 font-mono">
							{task.message}
						</p>
					</div>
				{/if}

				<div class="flex gap-3 justify-center">
					<button
						on:click={retryTask}
						class="px-6 py-3 rounded-xl gradient-brand text-white font-semibold text-sm hover:opacity-90 transition-opacity"
					>
						🔄 Retry
					</button>
					<a
						href="/"
						class="px-6 py-3 rounded-xl bg-surface-800 text-surface-300 hover:bg-surface-700 font-semibold text-sm"
					>
						← Go Home
					</a>
				</div>
			</div>
		{/if}

		<!-- Task Details -->
		<div class="mt-8 glass rounded-2xl p-6">
			<h3
				class="text-sm font-semibold text-surface-400 mb-6 uppercase tracking-wider"
			>
				Storage & Links
			</h3>

		{#if visualStatus === "completed" && gdriveId}
			<div class="glass rounded-2xl p-6 mb-8">
				<div class="flex items-center gap-3 mb-4">
					<span class="text-3xl">⬇️</span>
					<div>
						<h3 class="text-base font-bold text-white">Download Ready</h3>
						<p class="text-xs text-surface-400">Your file has been transferred to Google Drive</p>
					</div>
				</div>
				<div class="flex gap-3">
					<a
						href={gdriveId === 'direct'
							? task.gdrive_link
							: `https://drive.usercontent.google.com/download?id=${gdriveId}&export=download&authuser=0`}
						target="_blank"
						rel="noopener noreferrer"
						class="flex-1 text-center py-3 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 text-sm font-bold transition-colors border border-emerald-500/20"
					>
						⬇️ Download File
					</a>
					<button
						on:click={copyLink}
						class="px-5 py-3 rounded-xl bg-surface-700 hover:bg-surface-600 text-sm font-semibold text-white transition-colors
						{copied ? '!bg-emerald-500/20 !text-emerald-300' : ''}"
					>
						{copied ? '✅ Copied!' : '📋 Copy Link'}
					</button>
				</div>
			</div>
		{/if}

			<div class="grid grid-cols-2 gap-y-6 gap-x-4 text-sm mt-4">
				<div class="col-span-2">
					<span
						class="text-xs font-semibold text-surface-500 uppercase"
						>Source Link</span
					>
					<p class="text-surface-300 truncate font-mono text-sm mt-1">
						{task.url}
					</p>
				</div>
				<div>
					<span
						class="text-xs font-semibold text-surface-500 uppercase"
						>Total Size</span
					>
					<p class="text-white font-medium mt-1">
						{task.total_size ? formatBytes(task.total_size) : formatGB(task.size_gb)}
					</p>
				</div>
				<div>
					<span
						class="text-xs font-semibold text-surface-500 uppercase"
						>Created Date</span
					>
					<p class="text-white font-medium mt-1">
						{task.created ? formatDate(task.created) : "--"}
					</p>
				</div>
			</div>
		</div>
	{/if}
</div>
