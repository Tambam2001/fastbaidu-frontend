// lib/stores/quota.ts — user quota state
import { writable } from 'svelte/store';
import { quotaApi } from '$lib/api/client';
import type { QuotaInfo } from '$lib/types';

function createQuotaStore() {
    const { subscribe, set } = writable<QuotaInfo | null>(null);

    return {
        subscribe,
        load: async () => {
            try {
                set(await quotaApi.get());
            } catch {
                // Not logged in or error — ignore
            }
        },
        refresh: async () => {
            set(await quotaApi.get());
        },
        clear: () => set(null)
    };
}

export const quotaStore = createQuotaStore();
