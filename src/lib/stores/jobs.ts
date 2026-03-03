// lib/stores/jobs.ts — generic job store, không phụ thuộc domain
import { writable, derived } from 'svelte/store';
import { jobsApi, type Job } from '$lib/api/client';

function createJobsStore() {
	const { subscribe, set, update } = writable<Job[]>([]);

	return {
		subscribe,

		load: async () => set(await jobsApi.list()),

		add: (job: Job) => update((list) => [job, ...list]),

		updateOne: (id: string, patch: Partial<Job>) =>
			update((list) => list.map((j) => (j.id === id ? { ...j, ...patch } : j))),

		cancel: async (id: string) => {
			await jobsApi.cancel(id);
			update((list) => list.map((j) => (j.id === id ? { ...j, status: 'cancelled' as const } : j)));
		}
	};
}

export const jobsStore = createJobsStore();

export const activeJobs = derived(jobsStore, ($j) =>
	$j.filter((j) => j.status === 'pending' || j.status === 'running')
);
export const finishedJobs = derived(jobsStore, ($j) =>
	$j.filter((j) => j.status === 'done' || j.status === 'failed' || j.status === 'cancelled')
);
