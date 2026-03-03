<!-- lib/components/ProgressBar.svelte — generic, không biết gì về domain -->
<script lang="ts">
	import { useJobProgress } from '$lib/api/sse';
	import { jobsStore } from '$lib/stores/jobs';

	export let jobId: string;
	export let onDone: (() => void) | undefined = undefined;

	const { progress, isDone, error } = useJobProgress(jobId);

	$: if ($isDone) {
		jobsStore.updateOne(jobId, { status: 'done' });
		onDone?.();
	}
	$: if ($error) {
		jobsStore.updateOne(jobId, { status: 'failed', error_msg: $error });
	}
</script>

<div class="pb-wrap">
	{#if $error}
		<p class="pb-msg pb-error">⚠ {$error}</p>
	{:else if $isDone}
		<p class="pb-msg pb-done">✓ Done</p>
	{:else if $progress}
		<div class="pb-header">
			<span class="pb-stage">{$progress.stage}</span>
			<span class="pb-pct">{$progress.percent.toFixed(0)}%</span>
		</div>
		<div class="pb-track">
			<div class="pb-fill" style="width:{$progress.percent}%" />
		</div>
		{#if $progress.message}
			<p class="pb-label">{$progress.message}</p>
		{/if}
	{:else}
		<p class="pb-msg pb-waiting">Waiting…</p>
	{/if}
</div>

<style>
	.pb-wrap { width: 100%; }
	.pb-header { display: flex; justify-content: space-between; margin-bottom: 4px; font-size: .75rem; }
	.pb-stage  { color: var(--accent, #7c3aed); font-weight: 600; text-transform: uppercase; letter-spacing:.04em; }
	.pb-pct    { color: var(--text, #e2e8f0); font-weight: 700; }
	.pb-track  { height: 6px; background: var(--border, #2a2a4a); border-radius: 9px; overflow: hidden; }
	.pb-fill   { height: 100%; background: var(--accent, #7c3aed); border-radius: 9px; transition: width .3s ease; }
	.pb-label  { font-size: .7rem; color: var(--muted, #94a3b8); margin-top: 4px; }
	.pb-msg    { font-size: .8rem; }
	.pb-done   { color: #22c55e; }
	.pb-error  { color: #ef4444; }
	.pb-waiting { color: var(--muted, #94a3b8); }
</style>
