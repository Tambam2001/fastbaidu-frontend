

export const index = 6;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/task/_id_/_page.svelte.js')).default;
export const universal = {
  "ssr": false,
  "load": null
};
export const universal_id = "src/routes/task/[id]/+page.ts";
export const imports = ["_app/immutable/nodes/6.C51pgKQB.js","_app/immutable/chunks/UhH-2GMu.js","_app/immutable/chunks/D6YF6ztN.js","_app/immutable/chunks/CELniAmD.js","_app/immutable/chunks/Z-QoULFV.js","_app/immutable/chunks/DotA6MXx.js","_app/immutable/chunks/B-UrQ5_i.js","_app/immutable/chunks/RVXhQOml.js","_app/immutable/chunks/DWITx2Ic.js"];
export const stylesheets = [];
export const fonts = [];
