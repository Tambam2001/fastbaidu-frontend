

export const index = 6;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/task/_id_/_page.svelte.js')).default;
export const universal = {
  "ssr": false,
  "load": null
};
export const universal_id = "src/routes/task/[id]/+page.ts";
export const imports = ["_app/immutable/nodes/6.ZMTn5U2b.js","_app/immutable/chunks/UhH-2GMu.js","_app/immutable/chunks/D6YF6ztN.js","_app/immutable/chunks/CELniAmD.js","_app/immutable/chunks/CFLUeUjp.js","_app/immutable/chunks/Bt72apNl.js","_app/immutable/chunks/B-UrQ5_i.js","_app/immutable/chunks/BWlGPjfV.js","_app/immutable/chunks/DWITx2Ic.js"];
export const stylesheets = [];
export const fonts = [];
