
// this file is generated — do not edit it


declare module "svelte/elements" {
	export interface HTMLAttributes<T> {
		'data-sveltekit-keepfocus'?: true | '' | 'off' | undefined | null;
		'data-sveltekit-noscroll'?: true | '' | 'off' | undefined | null;
		'data-sveltekit-preload-code'?:
			| true
			| ''
			| 'eager'
			| 'viewport'
			| 'hover'
			| 'tap'
			| 'off'
			| undefined
			| null;
		'data-sveltekit-preload-data'?: true | '' | 'hover' | 'tap' | 'off' | undefined | null;
		'data-sveltekit-reload'?: true | '' | 'off' | undefined | null;
		'data-sveltekit-replacestate'?: true | '' | 'off' | undefined | null;
	}
}

export {};


declare module "$app/types" {
	export interface AppTypes {
		RouteId(): "/" | "/dashboard" | "/payment" | "/payment/purchase" | "/payment/[id]" | "/task" | "/task/[id]" | "/topup";
		RouteParams(): {
			"/payment/[id]": { id: string };
			"/task/[id]": { id: string }
		};
		LayoutParams(): {
			"/": { id?: string };
			"/dashboard": Record<string, never>;
			"/payment": { id?: string };
			"/payment/purchase": Record<string, never>;
			"/payment/[id]": { id: string };
			"/task": { id?: string };
			"/task/[id]": { id: string };
			"/topup": Record<string, never>
		};
		Pathname(): "/" | "/dashboard" | "/payment/purchase" | `/payment/${string}` & {} | `/task/${string}` & {} | "/topup";
		ResolvedPathname(): `${"" | `/${string}`}${ReturnType<AppTypes['Pathname']>}`;
		Asset(): "/favicon.svg" | string & {};
	}
}