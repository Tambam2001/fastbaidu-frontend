<script lang="ts">
	import { page } from "$app/stores";
	import logoIcon from "$lib/assets/logo.svg";

	$: status = $page.status;
	$: message = $page.error?.message || "Something went wrong";

	$: title =
		status === 404
			? "Page Not Found"
			: status === 500
				? "Server Error"
				: status === 403
					? "Access Denied"
					: "Oops!";

	$: emoji =
		status === 404
			? "🌌"
			: status === 500
				? "🔥"
				: status === 403
					? "🔒"
					: "⚠️";

	$: subtitle =
		status === 404
			? "This page has been teleported to another dimension."
			: status === 500
				? "Our servers hit turbulence. We're on it."
				: status === 403
					? "You don't have permission to access this page."
					: "Something unexpected happened.";
</script>

<svelte:head>
	<title>{status} {title} — FastBaidu</title>
</svelte:head>

<div
	class="min-h-[85vh] flex flex-col items-center justify-center p-4 relative overflow-hidden"
>
	<!-- Background -->
	<div class="absolute inset-0 bg-surface-950 -z-20"></div>
	<div
		class="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-surface-900 via-surface-950 to-surface-950 -z-10"
	></div>

	<!-- Floating particles effect -->
	<div class="absolute inset-0 overflow-hidden pointer-events-none -z-5">
		<div
			class="absolute w-64 h-64 rounded-full bg-brand-500/5 blur-3xl top-1/4 -left-20 animate-pulse"
		></div>
		<div
			class="absolute w-96 h-96 rounded-full bg-blue-500/5 blur-3xl bottom-1/4 -right-20 animate-[pulse_3s_ease-in-out_infinite]"
		></div>
	</div>

	<!-- Content -->
	<div class="relative z-10 text-center max-w-lg mx-auto">
		<!-- Status code with glitch effect -->
		<div class="relative mb-6">
			<span
				class="text-[8rem] sm:text-[10rem] font-black text-transparent bg-clip-text bg-gradient-to-b from-surface-600/80 to-surface-800/40 leading-none select-none"
			>
				{status}
			</span>
			<span
				class="absolute inset-0 flex items-center justify-center text-6xl sm:text-7xl animate-bounce"
				style="animation-duration: 3s;"
			>
				{emoji}
			</span>
		</div>

		<!-- Title -->
		<h1
			class="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-3"
		>
			{title}
		</h1>

		<!-- Subtitle -->
		<p class="text-surface-400 text-base sm:text-lg mb-2">
			{subtitle}
		</p>

		<!-- Error message (only if non-standard) -->
		{#if message && message !== title && message !== "Not Found"}
			<p
				class="text-surface-500 text-sm font-mono bg-surface-900/60 border border-surface-700/50 rounded-lg px-4 py-2 inline-block mb-6"
			>
				{message}
			</p>
		{/if}

		<!-- Actions -->
		<div class="flex flex-col sm:flex-row gap-3 justify-center mt-8">
			<a
				href="/"
				class="relative px-8 py-3.5 rounded-xl bg-brand-500 hover:bg-brand-400 text-white font-black transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-brand-500/30 overflow-hidden group flex items-center justify-center gap-2"
			>
				<span
					class="absolute inset-0 w-1/4 h-full bg-white/20 skew-x-12 -ml-[100%] group-hover:animate-[shine_0.7s_ease-out_forwards]"
				></span>
				<span class="relative z-10">🏠 Back to Home</span>
			</a>

			<button
				on:click={() => history.back()}
				class="px-8 py-3.5 rounded-xl border border-surface-600 bg-surface-800 hover:bg-surface-700 hover:border-surface-500 text-surface-300 hover:text-white font-semibold transition-all flex items-center justify-center gap-2"
			>
				← Go Back
			</button>
		</div>

		<!-- Branding -->
		<div class="mt-12 flex items-center justify-center gap-2 opacity-40">
			<img src={logoIcon} class="w-5 h-5" alt="FastBaidu" />
			<span class="text-surface-500 text-xs font-semibold tracking-wider"
				>FASTBAIDU</span
			>
		</div>
	</div>
</div>

<style>
	@keyframes shine {
		100% {
			margin-left: 200%;
		}
	}
</style>
