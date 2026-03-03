import { d as derived, w as writable } from "./index.js";
import { a as authStore, c as currentUser } from "./auth.js";
import { f as get_store_value, c as create_ssr_component, h as createEventDispatcher, e as escape } from "./ssr.js";
class ApiError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
    this.name = "ApiError";
  }
}
const BASE = "https://api.fastbaidu.app";
async function apiFetch(path, init) {
  const token = get_store_value(authStore).token;
  const res = await fetch(`${BASE}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...token ? { Authorization: `Bearer ${token}` } : {},
      ...init?.headers
    }
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({ message: res.statusText }));
    throw new ApiError(res.status, body.message ?? "Unknown error");
  }
  if (res.status === 204) return void 0;
  return res.json();
}
const jobsApi = {
  list: () => apiFetch("/api/jobs"),
  create: (type, payload) => apiFetch("/api/jobs", {
    method: "POST",
    body: JSON.stringify({ type, payload })
  }),
  get: (id) => apiFetch(`/api/jobs/${id}`),
  cancel: (id) => apiFetch(`/api/jobs/${id}`, { method: "DELETE" })
};
const ordersApi = {
  list: () => apiFetch("/api/orders"),
  create: (plan, paymentMethod) => apiFetch("/api/orders", {
    method: "POST",
    body: JSON.stringify({ plan, payment_method: paymentMethod })
  }),
  capturePaypal: (token) => apiFetch("/api/orders/capture-paypal", {
    method: "POST",
    body: JSON.stringify({ token })
  })
};
const quotaApi = {
  get: () => apiFetch("/api/me/quota")
};
function logout() {
  authStore.logout();
  if (typeof window !== "undefined") {
    window.location.href = "/";
  }
}
function getUser() {
  return get_store_value(authStore).user;
}
async function fetchBalance() {
  const data = await apiFetch("/api/me/quota");
  return {
    balance_gb: data.quota_gb,
    total_spent_usd: 0,
    // Mocked for now since DB tracks total_purchased_bytes
    is_telegram_user: !!getUser()?.telegram_id
  };
}
function createJobsStore() {
  const { subscribe, set, update } = writable([]);
  return {
    subscribe,
    load: async () => set(await jobsApi.list()),
    add: (job) => update((list) => [job, ...list]),
    updateOne: (id, patch) => update((list) => list.map((j) => j.id === id ? { ...j, ...patch } : j)),
    cancel: async (id) => {
      await jobsApi.cancel(id);
      update((list) => list.map((j) => j.id === id ? { ...j, status: "cancelled" } : j));
    }
  };
}
const jobsStore = createJobsStore();
derived(
  jobsStore,
  ($j) => $j.filter((j) => j.status === "pending" || j.status === "running")
);
derived(
  jobsStore,
  ($j) => $j.filter((j) => j.status === "done" || j.status === "failed" || j.status === "cancelled")
);
function createOrdersStore() {
  const { subscribe, set, update } = writable([]);
  return {
    subscribe,
    load: async () => set(await ordersApi.list()),
    add: (order) => update((list) => [order, ...list])
  };
}
createOrdersStore();
function createQuotaStore() {
  const { subscribe, set } = writable(null);
  return {
    subscribe,
    load: async () => {
      try {
        set(await quotaApi.get());
      } catch {
      }
    },
    refresh: async () => {
      set(await quotaApi.get());
    },
    clear: () => set(null)
  };
}
createQuotaStore();
const authModalOpen = writable(false);
const userStore = currentUser;
const ConfirmModal = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { open = false } = $$props;
  let { title = "Confirm Action" } = $$props;
  let { message = "Are you sure you want to proceed?" } = $$props;
  let { confirmText = "Confirm" } = $$props;
  let { cancelText = "Cancel" } = $$props;
  let { icon = "⚠️" } = $$props;
  let { confirmClass = "bg-red-500/20 text-red-400 hover:bg-red-500 hover:text-white border border-red-500/30 shadow-red-500/20" } = $$props;
  let { onConfirm = () => {
  } } = $$props;
  createEventDispatcher();
  if ($$props.open === void 0 && $$bindings.open && open !== void 0) $$bindings.open(open);
  if ($$props.title === void 0 && $$bindings.title && title !== void 0) $$bindings.title(title);
  if ($$props.message === void 0 && $$bindings.message && message !== void 0) $$bindings.message(message);
  if ($$props.confirmText === void 0 && $$bindings.confirmText && confirmText !== void 0) $$bindings.confirmText(confirmText);
  if ($$props.cancelText === void 0 && $$bindings.cancelText && cancelText !== void 0) $$bindings.cancelText(cancelText);
  if ($$props.icon === void 0 && $$bindings.icon && icon !== void 0) $$bindings.icon(icon);
  if ($$props.confirmClass === void 0 && $$bindings.confirmClass && confirmClass !== void 0) $$bindings.confirmClass(confirmClass);
  if ($$props.onConfirm === void 0 && $$bindings.onConfirm && onConfirm !== void 0) $$bindings.onConfirm(onConfirm);
  return `${open ? `<div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-surface-950/80 backdrop-blur-sm transition-opacity" role="dialog" aria-modal="true"> <div class="bg-surface-900 border border-surface-700/50 rounded-2xl w-full max-w-sm shadow-2xl p-6 text-center animate-fade-in relative z-10"><div class="text-4xl mb-4">${escape(icon)}</div> <h3 class="text-lg font-bold text-white mb-2">${escape(title)}</h3> <p class="text-sm text-surface-400 mb-6 font-medium">${escape(message)}</p> ${``} <div class="flex gap-3"><button ${""} class="flex-1 py-2.5 rounded-xl text-sm font-semibold bg-surface-800 text-surface-300 hover:bg-surface-700 hover:text-white border border-surface-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed">${escape(cancelText)}</button> <button ${""} class="${"flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-lg relative overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed " + escape(confirmClass, true)}">${`<span class="relative z-10">${escape(confirmText)}</span>`}</button></div></div></div>` : ``}`;
});
export {
  ConfirmModal as C,
  authModalOpen as a,
  fetchBalance as f,
  logout as l,
  userStore as u
};
