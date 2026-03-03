import { c as create_ssr_component, a as subscribe, v as validate_component } from './ssr-BR1xp53Z.js';
import './ssr2-e2juEaAg.js';
import './state.svelte-DJ0OkQ2O.js';
import './auth-Bmt3nnv7.js';
import { C as ConfirmModal, a as authModalOpen, u as userStore } from './ConfirmModal-Bg7AyFwW.js';
import './index-CIl4lw56.js';

const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$unsubscribe_authModalOpen;
  let $$unsubscribe_userStore;
  $$unsubscribe_authModalOpen = subscribe(authModalOpen, (value) => value);
  $$unsubscribe_userStore = subscribe(userStore, (value) => value);
  let deleteModalOpen = false;
  async function confirmDelete() {
    return;
  }
  let $$settled;
  let $$rendered;
  let previous_head = $$result.head;
  do {
    $$settled = true;
    $$result.head = previous_head;
    $$rendered = `${$$result.head += `<!-- HEAD_svelte-dxceq8_START -->${$$result.title = `<title>My Account — FastBaidu</title>`, ""}<!-- HEAD_svelte-dxceq8_END -->`, ""} <div class="max-w-6xl mx-auto px-4 py-10">${`<div class="flex justify-center py-20" data-svelte-h="svelte-u7all4"><div class="w-12 h-12 border-4 border-surface-700/50 border-t-brand-500 rounded-full animate-spin"></div></div>`}</div>  ${validate_component(ConfirmModal, "ConfirmModal").$$render(
      $$result,
      {
        title: "Delete this task?",
        message: "This action cannot be undone. The task record will be permanently removed.",
        confirmText: "Delete",
        cancelText: "Cancel",
        icon: "🗑️",
        onConfirm: confirmDelete,
        open: deleteModalOpen
      },
      {
        open: ($$value) => {
          deleteModalOpen = $$value;
          $$settled = false;
        }
      },
      {}
    )}`;
  } while (!$$settled);
  $$unsubscribe_authModalOpen();
  $$unsubscribe_userStore();
  return $$rendered;
});

export { Page as default };
//# sourceMappingURL=_page.svelte-va4DGTtr.js.map
