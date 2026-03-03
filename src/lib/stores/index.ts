import { derived } from "svelte/store";
export * from "./auth";
export * from "./jobs";
export * from "./orders";
export * from "./quota";

import { authStore, currentUser } from "./auth";

// Legacy UI stores needed by the Scanner template
export { authStore };

// authModalOpen tracks whether the login modal is visible
import { writable } from "svelte/store";
export const authModalOpen = writable(false);

// userStore is derived from authStore so the layout always reflects the current user
export const userStore = currentUser;

export function initAuthStore() {
    // authStore already initializes from localStorage in auth.ts
    // This function exists for layout compatibility
}
