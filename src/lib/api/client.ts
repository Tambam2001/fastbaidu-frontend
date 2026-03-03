// lib/api/client.ts — typed API client for FastBaidu

import { authStore } from '$lib/stores/auth';
import { get } from 'svelte/store';
import type {
	User, Job, TransferPayload, TransferFile,
	SharePreview, Plan, Order, CreateOrderResult, QuotaInfo, Transaction
} from '$lib/types';

// ─── API Error ────────────────────────────────────────────────────────────────

export class ApiError extends Error {
	constructor(public status: number, message: string) {
		super(message);
		this.name = 'ApiError';
	}
}

// ─── Fetch wrapper ────────────────────────────────────────────────────────────

// Support environment variable for production API URL
const BASE = import.meta.env.DEV 
	? 'http://localhost:8090'
	: (import.meta.env.VITE_API_URL || 'http://localhost:8090');

async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
	const token = get(authStore).token;
	const res = await fetch(`${BASE}${path}`, {
		...init,
		headers: {
			'Content-Type': 'application/json',
			...(token ? { Authorization: `Bearer ${token}` } : {}),
			...init?.headers
		}
	});
	if (!res.ok) {
		const body = await res.json().catch(() => ({ message: res.statusText }));
		throw new ApiError(res.status, body.message ?? 'Unknown error');
	}
	if (res.status === 204) return undefined as T;
	return res.json();
}

// ─── Auth ─────────────────────────────────────────────────────────────────────

export const authApi = {
	telegram: (data: Record<string, string>) =>
		apiFetch<{ token: string; user: User }>('/api/auth/telegram', {
			method: 'POST',
			body: JSON.stringify(data)
		}),
	login: (email: string, password: string) =>
		apiFetch<{ token: string; user: User }>('/api/auth/login', {
			method: 'POST',
			body: JSON.stringify({ email, password })
		}),
	register: (email: string, password: string, name: string) =>
		apiFetch<{ token: string; user: User }>('/api/auth/register', {
			method: 'POST',
			body: JSON.stringify({ email, password, name })
		}),
	forgotPassword: (email: string) =>
		apiFetch<{ message: string }>('/api/auth/forgot-password', {
			method: 'POST',
			body: JSON.stringify({ email })
		}),
	resetPassword: (token: string, newPassword: string, confirmPassword: string) =>
		apiFetch<{ message: string }>('/api/auth/reset-password', {
			method: 'POST',
			body: JSON.stringify({ token, new_password: newPassword, confirm_password: confirmPassword })
		}),
	verifyEmail: (token: string) =>
		apiFetch<{ message: string }>('/api/auth/verify-email', {
			method: 'POST',
			body: JSON.stringify({ token })
		}),
	resendVerification: (email: string) =>
		apiFetch<{ message: string }>('/api/auth/resend-verification', {
			method: 'POST',
			body: JSON.stringify({ email })
		})
};

// ─── Jobs ─────────────────────────────────────────────────────────────────────

export const jobsApi = {
	list: () =>
		apiFetch<Job[]>('/api/jobs'),

	create: <TPayload = unknown>(type: string, payload: TPayload) =>
		apiFetch<Job<TPayload>>('/api/jobs', {
			method: 'POST',
			body: JSON.stringify({ type, payload })
		}),

	get: (id: string) =>
		apiFetch<Job>(`/api/jobs/${id}`),

	cancel: (id: string) =>
		apiFetch<void>(`/api/jobs/${id}`, { method: 'DELETE' })
};

// ─── Share Preview ────────────────────────────────────────────────────────────

export const shareApi = {
	preview: (shareUrl: string, accessCode?: string) =>
		apiFetch<SharePreview>('/api/share/preview', {
			method: 'POST',
			body: JSON.stringify({ share_url: shareUrl, access_code: accessCode })
		})
};

// ─── Transfer ─────────────────────────────────────────────────────────────────

export const transferApi = {
	create: (payload: TransferPayload) =>
		jobsApi.create<TransferPayload>('transfer', payload),

	files: (jobId: string) =>
		apiFetch<TransferFile[]>(`/api/transfers/${jobId}/files`),

	downloadLink: (jobId: string, fileId: string) =>
		apiFetch<{ download_url: string; expires_at: string; filename: string; size_bytes: number }>(
			`/api/transfers/${jobId}/files/${fileId}/download`
		)
};

// ─── Orders & Plans ───────────────────────────────────────────────────────────

export const plansApi = {
	list: () => apiFetch<Plan[]>('/api/plans')
};

export const ordersApi = {
	list: () =>
		apiFetch<Order[]>('/api/orders'),

	create: (plan: string, paymentMethod: 'paypal' | 'nowpayments') =>
		apiFetch<CreateOrderResult>('/api/orders', {
			method: 'POST',
			body: JSON.stringify({ plan, payment_method: paymentMethod })
		}),

	capturePaypal: (token: string) =>
		apiFetch<{ status: string }>('/api/orders/capture-paypal', {
			method: 'POST',
			body: JSON.stringify({ token })
		})
};

// ─── Quota ────────────────────────────────────────────────────────────────────

export const quotaApi = {
	get: () => apiFetch<QuotaInfo>('/api/me/quota')
};

// Re-export types for convenience
export type { User, Job, TransferPayload, SharePreview, Plan, Order, QuotaInfo, Transaction };
export type { ProgressEvent } from '$lib/types';


// ─── Legacy UI Compat Mocks ───────────────────────────────────────────────────

export function logout() {
	authStore.logout();
	if (typeof window !== 'undefined') {
		window.location.href = '/';
	}
}

export function isLoggedIn() {
	return !!get(authStore).token;
}

export function getUser() {
	return get(authStore).user;
}

export async function fetchBalance() {
	const data = await apiFetch<QuotaInfo>('/api/me/quota');
	return {
		balance_gb: data.quota_gb,
		total_spent_usd: 0, // Mocked for now since DB tracks total_purchased_bytes
		is_telegram_user: !!getUser()?.telegram_id
	};
}

export async function telegramAuth(user: Record<string, string>) {
	const res = await authApi.telegram(user);
	authStore.login(res.token, res.user);
	return res;
}

export async function listTasks(statusFilter?: string) {
	return jobsApi.list() as any;
}

export async function deleteTask(id: string) {
	return jobsApi.cancel(id);
}

export async function getTask(id: string) {
	return jobsApi.get(id) as any;
}

export async function preview(params: { url: string, password?: string }) {
	const res = await shareApi.preview(params.url, params.password);
	return {
		files: res.files,
		total_size_gb: res.total_size_gb
	};
}

export async function createTask(params: { url: string, password?: string, size_gb: number }) {
	const job = await transferApi.create({ share_url: params.url, access_code: params.password, cloud_dest: 'gdrive' });
	return { task: { id: job.id } as any, payment_required: false };
}
