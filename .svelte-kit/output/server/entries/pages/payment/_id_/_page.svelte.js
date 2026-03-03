import { c as create_ssr_component, b as subscribe } from "../../../../chunks/ssr.js";
import { p as page } from "../../../../chunks/stores.js";
import "@sveltejs/kit/internal";
import "../../../../chunks/exports.js";
import "../../../../chunks/utils.js";
import "@sveltejs/kit/internal/server";
import "../../../../chunks/state.svelte.js";
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $page, $$unsubscribe_page;
  $$unsubscribe_page = subscribe(page, (value) => $page = value);
  $page.params.id;
  $$unsubscribe_page();
  return `<div class="flex items-center justify-center min-h-[50vh] text-surface-400" data-svelte-h="svelte-15u08ct"><div class="flex flex-col items-center gap-4"><div class="w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin"></div> <p>Redirecting to Top-Up...</p></div></div>`;
});
export {
  Page as default
};
