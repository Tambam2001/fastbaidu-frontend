import { w as writable, d as derived } from './index-CIl4lw56.js';

function createAuthStore() {
  const stored = typeof localStorage !== "undefined" ? localStorage.getItem("auth") : null;
  const initial = stored ? JSON.parse(stored) : { token: null, user: null };
  const { subscribe, set } = writable(initial);
  return {
    subscribe,
    login(token, user) {
      const state = { token, user };
      set(state);
      localStorage.setItem("auth", JSON.stringify(state));
      localStorage.setItem("auth_token", token);
    },
    logout() {
      set({ token: null, user: null });
      localStorage.removeItem("auth");
      localStorage.removeItem("auth_token");
    }
  };
}
const authStore = createAuthStore();
derived(authStore, ($a) => !!$a.token);
const currentUser = derived(authStore, ($a) => $a.user);

export { authStore as a, currentUser as c };
//# sourceMappingURL=auth-Bmt3nnv7.js.map
