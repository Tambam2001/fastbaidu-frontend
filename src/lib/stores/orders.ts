// lib/stores/orders.ts — order history store
import { writable } from 'svelte/store';
import { ordersApi } from '$lib/api/client';
import type { Order } from '$lib/types';

function createOrdersStore() {
    const { subscribe, set, update } = writable<Order[]>([]);

    return {
        subscribe,
        load: async () => set(await ordersApi.list()),
        add: (order: Order) => update((list) => [order, ...list])
    };
}

export const ordersStore = createOrdersStore();
