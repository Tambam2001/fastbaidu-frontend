<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	export let open = false;
	export let title = "Confirm Action";
	export let message = "Are you sure you want to proceed?";
	export let confirmText = "Confirm";
	export let cancelText = "Cancel";
	export let icon = "⚠️";
	// Default to a destructive (red) style, but can be overridden
	export let confirmClass = "bg-red-500/20 text-red-400 hover:bg-red-500 hover:text-white border border-red-500/30 shadow-red-500/20";
	
	export let onConfirm: () => Promise<void> | void = () => {};

	const dispatch = createEventDispatcher();

	let loading = false;
	let error = "";

	async function handleConfirm() {
		error = "";
		loading = true;
		try {
			await onConfirm();
			open = false;
			dispatch('success');
		} catch (err: any) {
			console.error("Confirmation error:", err);
			error = err?.message || "An error occurred during the action.";
		} finally {
			loading = false;
		}
	}

	function handleCancel() {
		open = false;
		error = "";
		dispatch('cancel');
	}
</script>

{#if open}
	<div
		class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-surface-950/80 backdrop-blur-sm transition-opacity"
		role="dialog"
		aria-modal="true"
	>
		<!-- Invisible backdrop to catch outside clicks (optional, disabled for safety during actions) -->
		
		<div
			class="bg-surface-900 border border-surface-700/50 rounded-2xl w-full max-w-sm shadow-2xl p-6 text-center animate-fade-in relative z-10"
		>
			<div class="text-4xl mb-4">{icon}</div>
			<h3 class="text-lg font-bold text-white mb-2">{title}</h3>
			<p class="text-sm text-surface-400 mb-6 font-medium">
				{message}
			</p>

			{#if error}
				<div
					class="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-300 text-sm text-left animate-fade-in"
				>
					{error}
				</div>
			{/if}

			<div class="flex gap-3">
				<button
					on:click={handleCancel}
					disabled={loading}
					class="flex-1 py-2.5 rounded-xl text-sm font-semibold bg-surface-800 text-surface-300 hover:bg-surface-700 hover:text-white border border-surface-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
				>
					{cancelText}
				</button>
				<button
					on:click={handleConfirm}
					disabled={loading}
					class="flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-lg relative overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed {confirmClass}"
				>
					{#if loading}
						<div class="absolute inset-0 bg-white/10 animate-pulse"></div>
						<span class="relative z-10 opacity-90">Processing...</span>
					{:else}
						<span class="relative z-10">{confirmText}</span>
					{/if}
				</button>
			</div>
		</div>
	</div>
{/if}
