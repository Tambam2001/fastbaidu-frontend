import { c as create_ssr_component, a as subscribe } from './ssr-BR1xp53Z.js';
import { p as page } from './stores-DrWq8Gay.js';
import './ssr2-e2juEaAg.js';
import './state.svelte-DJ0OkQ2O.js';

const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $page, $$unsubscribe_page;
  $$unsubscribe_page = subscribe(page, (value) => $page = value);
  $page.params.id;
  $$unsubscribe_page();
  return `<div class="flex items-center justify-center min-h-[50vh] text-surface-400" data-svelte-h="svelte-15u08ct"><div class="flex flex-col items-center gap-4"><div class="w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin"></div> <p>Redirecting to Top-Up...</p></div></div>`;
});

export { Page as default };
//# sourceMappingURL=_page.svelte-CFeTugYU.js.map
