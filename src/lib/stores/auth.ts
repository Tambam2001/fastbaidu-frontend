// lib/stores/auth.ts
import { writable, derived } from 'svelte/store';
import type { User } from '$lib/api/client';

interface AuthState { token: string | null; user: User | null; }

function createAuthStore() {
	const stored = typeof localStorage !== 'undefined' ? localStorage.getItem('auth') : null;
	const initial: AuthState = stored ? JSON.parse(stored) : { token: null, user: null };
	const { subscribe, set } = writable<AuthState>(initial);

	return {
		subscribe,
		login(token: string, user: User) {
			const state = { token, user };
			set(state);
			localStorage.setItem('auth', JSON.stringify(state));
			localStorage.setItem('auth_token', token); // cho SSE
		},
		logout() {
			set({ token: null, user: null });
			localStorage.removeItem('auth');
			localStorage.removeItem('auth_token');
		}
	};
}

export const authStore = createAuthStore();
export const isLoggedIn = derived(authStore, ($a) => !!$a.token);
export const currentUser = derived(authStore, ($a) => $a.user);
