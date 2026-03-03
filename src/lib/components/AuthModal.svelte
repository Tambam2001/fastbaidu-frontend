<script lang="ts">
	import { authStore } from "$lib/stores";
	import { authApi } from "$lib/api/client";
	import logoIcon from "$lib/assets/logo.svg";

	export let open = false;

	const BOT_NAME = import.meta.env.VITE_TELEGRAM_BOT_NAME || "Fastbaidu_bot";

	// ─── State ──────────────────────────────────────────────────────
	type AuthTab = "telegram" | "email";
	type EmailView = "login" | "register" | "forgot";

	let activeTab: AuthTab = "email";
	let emailView: EmailView = "login";

	let email = "";
	let password = "";
	let confirmPassword = "";
	let name = "";
	let loading = false;
	let errorMsg = "";
	let successMsg = "";

	// ─── Actions ────────────────────────────────────────────────────

	function closeModal() {
		open = false;
		resetForm();
	}

	function resetForm() {
		email = "";
		password = "";
		confirmPassword = "";
		name = "";
		errorMsg = "";
		successMsg = "";
		loading = false;
	}

	function switchView(view: EmailView) {
		emailView = view;
		errorMsg = "";
		successMsg = "";
	}

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === "Escape") closeModal();
	}

	async function handleLogin() {
		if (!email || !password) { errorMsg = "Please fill in all fields"; return; }
		loading = true;
		errorMsg = "";
		try {
			const res = await authApi.login(email, password);
			authStore.login(res.token, res.user);
			closeModal();
		} catch (e: any) {
			errorMsg = e.message || "Login failed";
		} finally {
			loading = false;
		}
	}

	async function handleRegister() {
		if (!email || !password || !name) { errorMsg = "Please fill in all fields"; return; }
		if (password.length < 8) { errorMsg = "Password must be at least 8 characters"; return; }
		if (password !== confirmPassword) { errorMsg = "Passwords do not match"; return; }
		loading = true;
		errorMsg = "";
		try {
			const res = await authApi.register(email, password, name);
			authStore.login(res.token, res.user);
			successMsg = "Account created! Check your email to verify.";
			setTimeout(() => closeModal(), 2000);
		} catch (e: any) {
			errorMsg = e.message || "Registration failed";
		} finally {
			loading = false;
		}
	}

	async function handleForgotPassword() {
		if (!email) { errorMsg = "Please enter your email"; return; }
		loading = true;
		errorMsg = "";
		try {
			await authApi.forgotPassword(email);
			successMsg = "If that email is registered, a reset link has been sent.";
		} catch (e: any) {
			errorMsg = e.message || "Failed to send reset email";
		} finally {
			loading = false;
		}
	}

	// ─── Telegram Widget ────────────────────────────────────────────
	// ─── Telegram Widget ────────────────────────────────────────────
	
	function telegramWidget(node: HTMLElement) {
		// Register global callback for Telegram widget
		(window as any).onTelegramAuth = async (user: any) => {
			loading = true;
			errorMsg = "";
			try {
				const data: Record<string, string> = {};
				for (const [k, v] of Object.entries(user)) {
					data[k] = String(v);
				}
				const res = await authApi.telegram(data);
				authStore.login(res.token, res.user);
				open = false;
				resetForm();
				window.location.reload();
			} catch (err: any) {
				errorMsg = err?.message || "Telegram login failed";
			} finally {
				loading = false;
			}
		};

		const script = document.createElement("script");
		script.src = "https://telegram.org/js/telegram-widget.js?22";
		script.setAttribute("data-telegram-login", BOT_NAME);
		script.setAttribute("data-size", "large");
		script.setAttribute("data-radius", "8");
		script.setAttribute("data-request-access", "write");
		script.setAttribute("data-userpic", "false");
		script.setAttribute("data-onauth", "onTelegramAuth(user)");
		script.async = true;
		node.appendChild(script);

		return {
			destroy() {
				// Nothing special since node is destroyed by Svelte
			}
		};
	}

	function handleImageError(e: Event) {
		const target = e.currentTarget as HTMLElement;
		target.style.display = 'none';
		if (target.nextElementSibling) {
			(target.nextElementSibling as HTMLElement).style.display = 'block';
		}
	}
</script>

<svelte:window on:keydown={handleKeydown} />

{#if open}
	<div
		class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-surface-950/80 backdrop-blur-sm"
		role="dialog"
		aria-modal="true"
	>
		<!-- svelte-ignore a11y_click_events_have_key_events -->
		<!-- svelte-ignore a11y_no_static_element_interactions -->
		<div
			class="absolute inset-0 cursor-default"
			role="button"
			tabindex="0"
			on:click={closeModal}
			on:keydown={(e) => e.key === 'Escape' && closeModal()}
		></div>

		<div
			class="relative w-full max-w-md bg-surface-900 border border-surface-700/80 rounded-3xl shadow-2xl overflow-hidden animate-[slide-up_0.3s_ease-out]"
		>
			<!-- Close button -->
			<button
				on:click={closeModal}
				class="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-surface-800 text-surface-400 hover:text-white hover:bg-surface-700 transition-colors focus:outline-none"
				aria-label="Close"
			>
				<svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
				</svg>
			</button>

			<!-- Header -->
			<div class="pt-8 pb-4 text-center">
				<div class="w-14 h-14 mx-auto mb-4 opacity-90 drop-shadow-lg">
					<img src={logoIcon} alt="FastBaidu" class="w-full h-full object-contain" on:error={handleImageError} />
					<div style="display:none" class="w-full h-full text-4xl">⚡</div>
				</div>
				<h2 class="text-xl font-bold text-white tracking-tight">Welcome to FastBaidu</h2>
			</div>

			<!-- Tabs -->
			<div class="flex mx-6 mb-4 bg-surface-800 rounded-xl p-1">
				<button
					on:click={() => { activeTab = "email"; resetForm(); }}
					class="flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all {activeTab === 'email' ? 'bg-brand-500 text-white shadow-lg' : 'text-surface-400 hover:text-white'}"
				>
					✉️ Email
				</button>
				<button
					on:click={() => { activeTab = "telegram"; resetForm(); }}
					class="flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all {activeTab === 'telegram' ? 'bg-blue-500 text-white shadow-lg' : 'text-surface-400 hover:text-white'}"
				>
					📱 Telegram
				</button>
			</div>

			<!-- Content -->
			<div class="px-6 pb-6">

				{#if errorMsg}
					<div class="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
						{errorMsg}
					</div>
				{/if}

				{#if successMsg}
					<div class="mb-4 p-3 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400 text-sm">
						{successMsg}
					</div>
				{/if}

				{#if activeTab === "telegram"}
					<!-- Telegram Tab -->
					<p class="text-surface-400 text-sm mb-4 text-center leading-relaxed">
						Sign in with Telegram to instantly get your <br/>
						<span class="text-brand-400 font-bold bg-brand-500/10 px-2 py-0.5 rounded-md">+1.00 GB Wallet Quota</span>.
					</p>
					<div
						use:telegramWidget
						class="min-h-[48px] flex items-center justify-center w-full"
					></div>

				{:else}
					<!-- Email Tab -->
					
					<p class="text-surface-500 text-xs text-center mb-4">
						<span class="text-blue-400">Tip:</span> Link your Telegram later in the dashboard to get +1.00 GB free quota!
					</p>

					{#if emailView === "login"}
						<!-- Login Form -->
						<form on:submit|preventDefault={handleLogin} class="space-y-3">
							<input
								type="email"
								bind:value={email}
								placeholder="Email address"
								class="w-full bg-surface-800 border border-surface-700 rounded-xl px-4 py-3 text-white placeholder:text-surface-500 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-colors text-sm"
								required
							/>
							<input
								type="password"
								bind:value={password}
								placeholder="Password"
								class="w-full bg-surface-800 border border-surface-700 rounded-xl px-4 py-3 text-white placeholder:text-surface-500 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-colors text-sm"
								required
							/>
							<button
								type="submit"
								disabled={loading}
								class="w-full py-3 rounded-xl bg-brand-500 text-white font-bold hover:bg-brand-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm"
							>
								{loading ? "Signing in..." : "Sign In"}
							</button>
						</form>
						<div class="mt-4 flex justify-between text-xs">
							<button on:click={() => switchView("register")} class="text-brand-400 hover:underline">
								Create account
							</button>
							<button on:click={() => switchView("forgot")} class="text-surface-400 hover:text-white">
								Forgot password?
							</button>
						</div>

					{:else if emailView === "register"}
						<!-- Register Form -->
						<form on:submit|preventDefault={handleRegister} class="space-y-3">
							<input
								type="text"
								bind:value={name}
								placeholder="Full name"
								class="w-full bg-surface-800 border border-surface-700 rounded-xl px-4 py-3 text-white placeholder:text-surface-500 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-colors text-sm"
								required
							/>
							<input
								type="email"
								bind:value={email}
								placeholder="Email address"
								class="w-full bg-surface-800 border border-surface-700 rounded-xl px-4 py-3 text-white placeholder:text-surface-500 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-colors text-sm"
								required
							/>
							<input
								type="password"
								bind:value={password}
								placeholder="Password (min 8 chars)"
								minlength="8"
								class="w-full bg-surface-800 border border-surface-700 rounded-xl px-4 py-3 text-white placeholder:text-surface-500 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-colors text-sm"
								required
							/>
							<input
								type="password"
								bind:value={confirmPassword}
								placeholder="Confirm password"
								class="w-full bg-surface-800 border border-surface-700 rounded-xl px-4 py-3 text-white placeholder:text-surface-500 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-colors text-sm"
								required
							/>
							<button
								type="submit"
								disabled={loading}
								class="w-full py-3 rounded-xl bg-brand-500 text-white font-bold hover:bg-brand-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm"
							>
								{loading ? "Creating account..." : "Create Account"}
							</button>
						</form>
						<div class="mt-4 text-center">
							<button on:click={() => switchView("login")} class="text-xs text-brand-400 hover:underline">
								Already have an account? Sign in
							</button>
						</div>

					{:else if emailView === "forgot"}
						<!-- Forgot Password Form -->
						<p class="text-surface-400 text-sm mb-4">
							Enter your email and we'll send you a password reset link.
						</p>
						<form on:submit|preventDefault={handleForgotPassword} class="space-y-3">
							<input
								type="email"
								bind:value={email}
								placeholder="Email address"
								class="w-full bg-surface-800 border border-surface-700 rounded-xl px-4 py-3 text-white placeholder:text-surface-500 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-colors text-sm"
								required
							/>
							<button
								type="submit"
								disabled={loading}
								class="w-full py-3 rounded-xl bg-brand-500 text-white font-bold hover:bg-brand-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm"
							>
								{loading ? "Sending..." : "Send Reset Link"}
							</button>
						</form>
						<div class="mt-4 text-center">
							<button on:click={() => switchView("login")} class="text-xs text-brand-400 hover:underline">
								← Back to sign in
							</button>
						</div>
					{/if}
				{/if}
			</div>

			<!-- Footer -->
			<div class="px-6 pb-6">
				<p class="text-xs text-surface-500 text-center max-w-[280px] mx-auto">
					By signing in, you agree to our <a href="/terms" class="text-brand-400 hover:underline">Terms</a> and <a href="/privacy" class="text-brand-400 hover:underline">Privacy Policy</a>
				</p>
			</div>
		</div>
	</div>
{/if}
