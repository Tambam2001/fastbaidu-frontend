// lib/api/sse.ts — generic SSE subscription với auto-reconnect

import type { ProgressEvent } from './client';
import { writable } from 'svelte/store';
import { onDestroy } from 'svelte';

const BASE = import.meta.env.DEV 
	? 'http://localhost:8090'
	: (import.meta.env.VITE_API_URL || 'http://localhost:8090');

// ─── Raw subscription ─────────────────────────────────────────────────────────

export function subscribeJob(
	jobId: string,
	callbacks: {
		onProgress: (e: ProgressEvent) => void;
		onDone: () => void;
		onError?: (msg: string) => void;
	}
): () => void {
	let es: EventSource | null = null;
	let stopped = false;
	let retries = 0;
	const MAX_RETRIES = 5;

	function connect() {
		if (stopped) return;
		const token = localStorage.getItem('auth_token') ?? '';
		// Token qua query param vì EventSource không support custom headers
		es = new EventSource(`${BASE}/api/jobs/${jobId}/stream?token=${encodeURIComponent(token)}`);

		es.addEventListener('connected', () => { retries = 0; });

		es.addEventListener('progress', (e: MessageEvent) => {
			try {
				const data = JSON.parse(e.data);
				if (data.data && typeof data.data === 'object') {
					Object.assign(data, data.data);
				} else if (data.data && typeof data.data === 'string') {
					try { Object.assign(data, JSON.parse(data.data)); } catch { }
				}
				callbacks.onProgress(data);
			} catch { /* ignore */ }
		});

		es.addEventListener('done', () => {
			callbacks.onDone();
			es?.close();
		});

		es.onerror = () => {
			es?.close();
			if (stopped) return;
			retries++;
			if (retries > MAX_RETRIES) {
				callbacks.onError?.('Connection lost after max retries');
				return;
			}
			// Exponential backoff: 1s → 2s → 4s → 8s → 16s
			setTimeout(connect, Math.min(1000 * 2 ** (retries - 1), 16_000));
		};
	}

	connect();
	return () => { stopped = true; es?.close(); };
}

// ─── Svelte hook ──────────────────────────────────────────────────────────────
// Dùng trong component: const { progress, isDone, error } = useJobProgress(jobId)

export function useJobProgress(jobId: string) {
	const progress = writable<ProgressEvent | null>(null);
	const isDone = writable(false);
	const error = writable<string | null>(null);

	const stop = subscribeJob(jobId, {
		onProgress: (e) => progress.set(e),
		onDone: () => isDone.set(true),
		onError: (msg) => error.set(msg)
	});

	onDestroy(stop);

	return { progress, isDone, error };
}
