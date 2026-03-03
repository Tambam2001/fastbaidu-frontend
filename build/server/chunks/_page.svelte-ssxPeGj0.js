import { c as create_ssr_component, a as subscribe, d as each, v as validate_component } from './ssr-BR1xp53Z.js';
import './ssr2-e2juEaAg.js';
import './state.svelte-DJ0OkQ2O.js';
import './auth-Bmt3nnv7.js';
import { C as ConfirmModal, a as authModalOpen } from './ConfirmModal-Bg7AyFwW.js';
import './index-CIl4lw56.js';

const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$unsubscribe_authModalOpen;
  $$unsubscribe_authModalOpen = subscribe(authModalOpen, (value) => value);
  let buyModalOpen = false;
  function confirmBuy() {
  }
  let $$settled;
  let $$rendered;
  let previous_head = $$result.head;
  do {
    $$settled = true;
    $$result.head = previous_head;
    $$rendered = `${$$result.head += `<!-- HEAD_svelte-17swdhw_START -->${$$result.title = `<title>Top Up Credits — FastBaidu</title>`, ""}<!-- HEAD_svelte-17swdhw_END -->`, ""} <div class="max-w-5xl mx-auto px-4 py-12"><div class="text-center mb-12"><h1 class="text-3xl font-bold text-white mb-3" data-svelte-h="svelte-v2pwxl">Top Up Credits</h1> <p class="text-surface-400 text-lg" data-svelte-h="svelte-1f5m1he">Choose a package to start teleporting your files.</p> ${``}</div> ${`<div class="grid md:grid-cols-3 gap-6">${each(Array(3), (_) => {
      return `<div class="h-64 bg-surface-800/50 rounded-2xl animate-pulse"></div>`;
    })}</div>`} <div class="text-center mt-8" data-svelte-h="svelte-c2fyv3"><a href="/" class="text-surface-500 hover:text-brand-400 text-sm transition-colors">← Back to Home</a></div></div> ${validate_component(ConfirmModal, "ConfirmModal").$$render(
      $$result,
      {
        title: "Confirm Purchase",
        message: "",
        confirmText: "Proceed to Checkout",
        cancelText: "Cancel",
        icon: "🛍️",
        confirmClass: "bg-brand-500 text-white hover:bg-brand-400 border border-brand-500/30 shadow-brand-500/20",
        onConfirm: confirmBuy,
        open: buyModalOpen
      },
      {
        open: ($$value) => {
          buyModalOpen = $$value;
          $$settled = false;
        }
      },
      {}
    )}`;
  } while (!$$settled);
  $$unsubscribe_authModalOpen();
  return $$rendered;
});

export { Page as default };
//# sourceMappingURL=_page.svelte-ssxPeGj0.js.map
