const manifest = (() => {
function __memo(fn) {
	let value;
	return () => value ??= (value = fn());
}

return {
	appDir: "_app",
	appPath: "_app",
	assets: new Set(["favicon.svg"]),
	mimeTypes: {".svg":"image/svg+xml"},
	_: {
		client: {start:"_app/immutable/entry/start.CSjrsCx8.js",app:"_app/immutable/entry/app.BW3faLRN.js",imports:["_app/immutable/entry/start.CSjrsCx8.js","_app/immutable/chunks/CFLUeUjp.js","_app/immutable/chunks/UhH-2GMu.js","_app/immutable/chunks/Bt72apNl.js","_app/immutable/chunks/B-UrQ5_i.js","_app/immutable/entry/app.BW3faLRN.js","_app/immutable/chunks/UhH-2GMu.js","_app/immutable/chunks/CELniAmD.js"],stylesheets:[],fonts:[],uses_env_dynamic_public:false},
		nodes: [
			__memo(() => import('./chunks/0-Dho7pnMR.js')),
			__memo(() => import('./chunks/1-_SwjSuEf.js')),
			__memo(() => import('./chunks/2-CYEMDcJk.js')),
			__memo(() => import('./chunks/3-DEuGK19A.js')),
			__memo(() => import('./chunks/4-0VKd7pId.js')),
			__memo(() => import('./chunks/5-Baewcydx.js')),
			__memo(() => import('./chunks/6-RMeBz_OQ.js')),
			__memo(() => import('./chunks/7-3KOII736.js'))
		],
		remotes: {
			
		},
		routes: [
			{
				id: "/",
				pattern: /^\/$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 2 },
				endpoint: null
			},
			{
				id: "/dashboard",
				pattern: /^\/dashboard\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 3 },
				endpoint: null
			},
			{
				id: "/payment/purchase",
				pattern: /^\/payment\/purchase\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 5 },
				endpoint: null
			},
			{
				id: "/payment/[id]",
				pattern: /^\/payment\/([^/]+?)\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,], errors: [1,], leaf: 4 },
				endpoint: null
			},
			{
				id: "/task/[id]",
				pattern: /^\/task\/([^/]+?)\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,], errors: [1,], leaf: 6 },
				endpoint: null
			},
			{
				id: "/topup",
				pattern: /^\/topup\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 7 },
				endpoint: null
			}
		],
		prerendered_routes: new Set([]),
		matchers: async () => {
			
			return {  };
		},
		server_assets: {}
	}
}
})();

const prerendered = new Set([]);

const base = "";

export { base, manifest, prerendered };
//# sourceMappingURL=manifest.js.map
