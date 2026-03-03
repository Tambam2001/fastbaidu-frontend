<script lang="ts">
	import "./app.css";
	import { onMount, tick } from "svelte";
	import { logout, fetchBalance } from "$lib/api";
	import type { UserBalance } from "$lib/types";
	import { userStore, initAuthStore, authModalOpen } from "$lib/stores";
	import AuthModal from "$lib/components/AuthModal.svelte";
	import ConfirmModal from "$lib/components/ConfirmModal.svelte";
	import logoIcon from "$lib/assets/logo.svg";

	let profileMenuOpen = false;
	let userBalance: UserBalance | null = null;
	let authInitialized = false;
	
	let logoutModalOpen = false;

	onMount(() => {
		initAuthStore();
		authInitialized = true;
	});

	$: if ($userStore && userBalance === null) {
		fetchBalance()
			.then((b) => (userBalance = b))
			.catch(() => (userBalance = null));
	} else if (!$userStore) {
		userBalance = null;
	}

	// Refresh balance dynamically when dropdown is opened
	$: if (profileMenuOpen && $userStore) {
		fetchBalance()
			.then((b) => (userBalance = b))
			.catch(() => {});
	}

	function handleLogout() {
		logoutModalOpen = true;
		profileMenuOpen = false;
	}

	function confirmLogout() {
		logout();
		logoutModalOpen = false;
	}
</script>

<svelte:head>
	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link
		rel="preconnect"
		href="https://fonts.gstatic.com"
		crossorigin="anonymous"
	/>
	<link
		href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap"
		rel="stylesheet"
	/>
</svelte:head>

<div class="min-h-screen flex flex-col bg-surface-950 text-surface-50">
	<!-- Navbar (Minimalist, Flat) -->
	<nav class="sticky top-0 z-50 bg-surface-950/90 backdrop-blur-md">
		<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
			<div class="flex items-center h-16">
				<!-- Logo -->
				<a href="/" class="flex items-center gap-3 group mr-auto">
					<img
						src={logoIcon}
						alt="FastBaidu Logo"
						class="w-9 h-9 drop-shadow-md group-hover:drop-shadow-lg transition-all group-hover:scale-105"
					/>
					<span
						class="text-xl font-bold bg-gradient-to-r from-brand-400 to-brand-200 bg-clip-text text-transparent"
					>
						FastBaidu
					</span>
				</a>

				<!-- Auth UI Desktop -->
				<div class="flex items-center gap-3 relative">
					{#if !authInitialized}
						<!-- Skeleton to prevent login button flash during SSR/hydration -->
						<div
							class="w-8 h-8 rounded-full bg-surface-800/50 animate-pulse"
						></div>
					{:else if $userStore}
						<button
							class="flex items-center gap-2 hover:bg-surface-800/50 p-1.5 pr-3 rounded-full transition-colors"
							on:click={() => (profileMenuOpen = !profileMenuOpen)}
						>
							{#if $userStore.avatarUrl}
								<img
									src={$userStore.avatarUrl}
									alt="Avatar"
									class="w-8 h-8 rounded-full shadow-sm object-cover"
								/>
							{:else}
								<div
									class="w-8 h-8 rounded-full bg-brand-500/20 text-brand-400 flex items-center justify-center font-bold shadow-sm"
								>
									{($userStore.name || $userStore.email || "U")[0]}
								</div>
							{/if}
							<span
								class="text-sm font-medium hidden lg:block text-surface-200"
								>{$userStore.name || $userStore.email}</span
							>
							<svg
								class="w-4 h-4 text-surface-400 transition-transform {profileMenuOpen
									? 'rotate-180'
									: ''}"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M19 9l-7 7-7-7"
								/>
							</svg>
						</button>

						<!-- Premium Dropdown Menu -->
						{#if profileMenuOpen}
							<div
								class="absolute right-0 top-14 w-72 bg-surface-900 border border-surface-700/80 rounded-2xl shadow-2xl shadow-black/80 overflow-hidden z-50 transform origin-top-right transition-all animate-fade-in"
							>
								<!-- User Info Header -->
								<div
									class="px-5 py-4 bg-surface-800/30 flex items-center gap-3"
								>
									{#if $userStore.avatarUrl}
										<img
											src={$userStore.avatarUrl}
											alt="Avatar"
											class="w-10 h-10 rounded-full shadow-md object-cover ring-2 ring-brand-500/20"
										/>
									{:else}
										<div
											class="w-10 h-10 rounded-full bg-brand-500/20 text-brand-400 flex items-center justify-center font-bold shadow-md ring-2 ring-brand-500/20"
										>
											{($userStore.name || $userStore.email || "U")[0]}
										</div>
									{/if}
									<div class="flex-1 min-w-0">
										<p
											class="text-sm font-bold text-white truncate"
										>
											{$userStore.name || $userStore.email}
										</p>
										{#if $userStore.username}
											<p
												class="text-xs text-brand-400/80 truncate font-mono"
											>
												@{$userStore.username}
											</p>
										{/if}
									</div>
								</div>

								<!-- Wallet Balance Card -->
								<div class="px-3 py-3">
									<div
										class="bg-surface-800/80 rounded-xl p-4 border border-surface-700/50 relative overflow-hidden group"
									>
										<!-- Subtle glow background -->
										<div
											class="absolute inset-0 bg-gradient-to-br from-brand-500/10 to-transparent opacity-50"
										></div>

										<p
											class="text-[11px] font-bold text-surface-400 tracking-wider uppercase mb-1 relative z-10 flex items-center gap-1.5"
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

										<div
											class="flex items-baseline gap-1.5 relative z-10"
										>
											{#if userBalance !== null}
												<span
													class="text-2xl font-black text-white tracking-tight"
												>
													{userBalance.balance_gb.toFixed(
														2,
													)}
												</span>
												<span
													class="text-sm font-semibold text-brand-400"
													>GB</span
												>
											{:else}
												<!-- Loading shimmer for balance -->
												<div
													class="h-8 w-24 bg-surface-700/50 rounded animate-pulse mt-1"
												></div>
											{/if}
										</div>

										<a
											href="/topup"
											on:click={() =>
												(profileMenuOpen = false)}
											class="relative z-10 mt-3 w-full block text-center py-2 rounded-lg bg-surface-700/50 hover:bg-brand-500/20 border border-surface-600/30 hover:border-brand-500/30 text-xs font-bold text-surface-200 hover:text-brand-300 transition-all pointer-events-auto"
										>
											TOP UP CREDITS
										</a>
									</div>
								</div>

								<div class="h-px bg-surface-800/50"></div>

								<!-- Menu Actions -->
								<div class="p-2 space-y-1">
									<a
										href="/dashboard"
										class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-surface-300 hover:text-white hover:bg-surface-800 transition-colors"
										on:click={() =>
											(profileMenuOpen = false)}
									>
										<svg
											class="w-4 h-4 text-surface-400"
											fill="none"
											viewBox="0 0 24 24"
											stroke="currentColor"
										>
											<path
												stroke-linecap="round"
												stroke-linejoin="round"
												stroke-width="2"
												d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
											/>
										</svg>
										Dashboard
									</a>
									<button
										on:click={handleLogout}
										class="w-full flex items-center gap-3 text-left px-3 py-2.5 rounded-lg text-sm font-medium text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors"
									>
										<svg
											class="w-4 h-4 text-red-400/70"
											fill="none"
											viewBox="0 0 24 24"
											stroke="currentColor"
										>
											<path
												stroke-linecap="round"
												stroke-linejoin="round"
												stroke-width="2"
												d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
											/>
										</svg>
										Logout
									</button>
								</div>
							</div>

							<!-- Invisible backdrop to close dropdown when clicking outside -->
							{#if profileMenuOpen}
								<button
									aria-label="Close user menu"
									class="fixed inset-0 w-full h-full cursor-default z-40"
									on:click={() => (profileMenuOpen = false)}
								></button>
							{/if}
						{/if}
					{:else}
						<button
							on:click={() => ($authModalOpen = true)}
							class="px-2 py-1.5 text-sm font-medium text-surface-400 hover:text-white transition-colors"
						>
							Sign in
						</button>
					{/if}
				</div>
			</div>
		</div>
	</nav>

	<!-- Main Content -->
	<main class="flex-1">
		<slot />
	</main>

	<!-- Footer -->
	<footer class="border-t border-surface-800/50 bg-surface-950/80">
		<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
			<div
				class="flex flex-col md:flex-row justify-between items-center gap-4"
			>
				<div class="flex items-center gap-2 text-surface-500 text-sm">
					<img
						src={logoIcon}
						alt="FastBaidu Logo"
						class="w-6 h-6 grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all"
					/>
					<span>FastBaidu &mdash; Download without limits.</span>
				</div>
				<div
					class="flex flex-wrap justify-center gap-6 text-sm text-surface-500 font-medium"
				>
					<a
						href="/blog"
						class="hover:text-surface-300 transition-colors">Blog</a
					>
					<a
						href="/faq"
						class="hover:text-surface-300 transition-colors">FAQ</a
					>
					<a
						href="/about"
						class="hover:text-surface-300 transition-colors"
						>About</a
					>
					<a
						href="/privacy"
						class="hover:text-surface-300 transition-colors"
						>Privacy</a
					>
					<a
						href="/terms"
						class="hover:text-surface-300 transition-colors"
						>Terms</a
					>
					<a
						href="/contact"
						class="hover:text-surface-300 transition-colors"
						>Contact</a
					>
					<a
						href="https://t.me/fastbaidu"
						class="hover:text-surface-300 transition-colors"
						target="_blank"
						rel="noopener">Telegram</a
					>
				</div>
			</div>
		</div>
	</footer>

	<AuthModal bind:open={$authModalOpen} />

	<ConfirmModal
		bind:open={logoutModalOpen}
		title="Sign Out"
		message="Are you sure you want to sign out of your account?"
		confirmText="Sign Out"
		cancelText="Cancel"
		icon="🚪"
		onConfirm={confirmLogout}
	/>
</div>
