import { c as create_ssr_component, a as subscribe, b as add_attribute, v as validate_component, e as escape } from './ssr-BR1xp53Z.js';
import { C as ConfirmModal, l as logout, u as userStore, a as authModalOpen, f as fetchBalance } from './ConfirmModal-Bg7AyFwW.js';
import './auth-Bmt3nnv7.js';
import { l as logoIcon } from './logo-ClC1Vfiu.js';
import './index-CIl4lw56.js';

const AuthModal = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { open = false } = $$props;
  let email = "";
  let password = "";
  if ($$props.open === void 0 && $$bindings.open && open !== void 0) $$bindings.open(open);
  return ` ${open ? `<div class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-surface-950/80 backdrop-blur-sm" role="dialog" aria-modal="true">  <div class="absolute inset-0 cursor-default" role="button" tabindex="0"></div> <div class="relative w-full max-w-md bg-surface-900 border border-surface-700/80 rounded-3xl shadow-2xl overflow-hidden animate-[slide-up_0.3s_ease-out]"> <button class="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-surface-800 text-surface-400 hover:text-white hover:bg-surface-700 transition-colors focus:outline-none" aria-label="Close" data-svelte-h="svelte-1gpuzt6"><svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg></button>  <div class="pt-8 pb-4 text-center"><div class="w-14 h-14 mx-auto mb-4 opacity-90 drop-shadow-lg"><img${add_attribute("src", logoIcon, 0)} alt="FastBaidu" class="w-full h-full object-contain"> <div style="display:none" class="w-full h-full text-4xl" data-svelte-h="svelte-1cnvm17">⚡</div></div> <h2 class="text-xl font-bold text-white tracking-tight" data-svelte-h="svelte-irhnj9">Welcome to FastBaidu</h2></div>  <div class="flex mx-6 mb-4 bg-surface-800 rounded-xl p-1"><button class="${"flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all " + escape(
    "bg-brand-500 text-white shadow-lg",
    true
  )}">✉️ Email</button> <button class="${"flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all " + escape(
    "text-surface-400 hover:text-white",
    true
  )}">📱 Telegram</button></div>  <div class="px-6 pb-6">${``} ${``} ${` <p class="text-surface-500 text-xs text-center mb-4" data-svelte-h="svelte-1shbm5w"><span class="text-blue-400">Tip:</span> Link your Telegram later in the dashboard to get +1.00 GB free quota!</p> ${` <form class="space-y-3"><input type="email" placeholder="Email address" class="w-full bg-surface-800 border border-surface-700 rounded-xl px-4 py-3 text-white placeholder:text-surface-500 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-colors text-sm" required${add_attribute("value", email, 0)}> <input type="password" placeholder="Password" class="w-full bg-surface-800 border border-surface-700 rounded-xl px-4 py-3 text-white placeholder:text-surface-500 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-colors text-sm" required${add_attribute("value", password, 0)}> <button type="submit" ${""} class="w-full py-3 rounded-xl bg-brand-500 text-white font-bold hover:bg-brand-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm">${escape("Sign In")}</button></form> <div class="mt-4 flex justify-between text-xs"><button class="text-brand-400 hover:underline" data-svelte-h="svelte-14x9ef2">Create account</button> <button class="text-surface-400 hover:text-white" data-svelte-h="svelte-8xuewb">Forgot password?</button></div>`}`}</div>  <div class="px-6 pb-6" data-svelte-h="svelte-nxq99i"><p class="text-xs text-surface-500 text-center max-w-[280px] mx-auto">By signing in, you agree to our <a href="/terms" class="text-brand-400 hover:underline">Terms</a> and <a href="/privacy" class="text-brand-400 hover:underline">Privacy Policy</a></p></div></div></div>` : ``}`;
});
const Layout = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $userStore, $$unsubscribe_userStore;
  let $authModalOpen, $$unsubscribe_authModalOpen;
  $$unsubscribe_userStore = subscribe(userStore, (value) => $userStore = value);
  $$unsubscribe_authModalOpen = subscribe(authModalOpen, (value) => $authModalOpen = value);
  let userBalance = null;
  let logoutModalOpen = false;
  function confirmLogout() {
    logout();
    logoutModalOpen = false;
  }
  let $$settled;
  let $$rendered;
  let previous_head = $$result.head;
  do {
    $$settled = true;
    $$result.head = previous_head;
    {
      if ($userStore && userBalance === null) {
        fetchBalance().then((b) => userBalance = b).catch(() => userBalance = null);
      } else if (!$userStore) {
        userBalance = null;
      }
    }
    $$rendered = `${$$result.head += `<!-- HEAD_svelte-1u1hvv4_START --><link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous"><link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&amp;family=JetBrains+Mono:wght@400;500&amp;display=swap" rel="stylesheet"><!-- HEAD_svelte-1u1hvv4_END -->`, ""} <div class="min-h-screen flex flex-col bg-surface-950 text-surface-50"> <nav class="sticky top-0 z-50 bg-surface-950/90 backdrop-blur-md"><div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"><div class="flex items-center h-16"> <a href="/" class="flex items-center gap-3 group mr-auto" data-svelte-h="svelte-7x2dkf"><img${add_attribute("src", logoIcon, 0)} alt="FastBaidu Logo" class="w-9 h-9 drop-shadow-md group-hover:drop-shadow-lg transition-all group-hover:scale-105"> <span class="text-xl font-bold bg-gradient-to-r from-brand-400 to-brand-200 bg-clip-text text-transparent">FastBaidu</span></a>  <div class="flex items-center gap-3 relative">${` <div class="w-8 h-8 rounded-full bg-surface-800/50 animate-pulse"></div>`}</div></div></div></nav>  <main class="flex-1">${slots.default ? slots.default({}) : ``}</main>  <footer class="border-t border-surface-800/50 bg-surface-950/80" data-svelte-h="svelte-1snbkkx"><div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"><div class="flex flex-col md:flex-row justify-between items-center gap-4"><div class="flex items-center gap-2 text-surface-500 text-sm"><img${add_attribute("src", logoIcon, 0)} alt="FastBaidu Logo" class="w-6 h-6 grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all"> <span>FastBaidu — Download without limits.</span></div> <div class="flex flex-wrap justify-center gap-6 text-sm text-surface-500 font-medium"><a href="/blog" class="hover:text-surface-300 transition-colors">Blog</a> <a href="/faq" class="hover:text-surface-300 transition-colors">FAQ</a> <a href="/about" class="hover:text-surface-300 transition-colors">About</a> <a href="/privacy" class="hover:text-surface-300 transition-colors">Privacy</a> <a href="/terms" class="hover:text-surface-300 transition-colors">Terms</a> <a href="/contact" class="hover:text-surface-300 transition-colors">Contact</a> <a href="https://t.me/fastbaidu" class="hover:text-surface-300 transition-colors" target="_blank" rel="noopener">Telegram</a></div></div></div></footer> ${validate_component(AuthModal, "AuthModal").$$render(
      $$result,
      { open: $authModalOpen },
      {
        open: ($$value) => {
          $authModalOpen = $$value;
          $$settled = false;
        }
      },
      {}
    )} ${validate_component(ConfirmModal, "ConfirmModal").$$render(
      $$result,
      {
        title: "Sign Out",
        message: "Are you sure you want to sign out of your account?",
        confirmText: "Sign Out",
        cancelText: "Cancel",
        icon: "🚪",
        onConfirm: confirmLogout,
        open: logoutModalOpen
      },
      {
        open: ($$value) => {
          logoutModalOpen = $$value;
          $$settled = false;
        }
      },
      {}
    )}</div>`;
  } while (!$$settled);
  $$unsubscribe_userStore();
  $$unsubscribe_authModalOpen();
  return $$rendered;
});

export { Layout as default };
//# sourceMappingURL=_layout.svelte-bvobAqFU.js.map
