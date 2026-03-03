import { c as create_ssr_component, b as subscribe, v as validate_component } from "../../../chunks/ssr.js";
import "@sveltejs/kit/internal";
import "../../../chunks/exports.js";
import "../../../chunks/utils.js";
import "@sveltejs/kit/internal/server";
import "../../../chunks/state.svelte.js";
import "../../../chunks/auth.js";
import { a as authModalOpen, u as userStore, C as ConfirmModal } from "../../../chunks/ConfirmModal.js";
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
export {
  Page as default
};
