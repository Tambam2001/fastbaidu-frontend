import { c as create_ssr_component, o as onDestroy, e as escape } from './ssr-BR1xp53Z.js';
import './ssr2-e2juEaAg.js';
import './state.svelte-DJ0OkQ2O.js';
import './auth-Bmt3nnv7.js';
import './index-CIl4lw56.js';

const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let taskId;
  let { data } = $$props;
  onDestroy(() => {
  });
  if ($$props.data === void 0 && $$bindings.data && data !== void 0) $$bindings.data(data);
  taskId = data.taskId;
  return `${$$result.head += `<!-- HEAD_svelte-1sx05pi_START -->${$$result.title = `<title>Task ${escape(taskId)} — FastBaidu</title>`, ""}<!-- HEAD_svelte-1sx05pi_END -->`, ""} <div class="max-w-3xl mx-auto px-4 py-12">${` <div class="space-y-6 animate-pulse" data-svelte-h="svelte-1aim5ph"><div class="h-8 w-1/3 bg-surface-800 rounded-lg"></div> <div class="h-24 bg-surface-800 rounded-2xl"></div> <div class="h-48 bg-surface-800 rounded-2xl"></div></div>`}</div>`;
});

export { Page as default };
//# sourceMappingURL=_page.svelte-BmGfPK_r.js.map
