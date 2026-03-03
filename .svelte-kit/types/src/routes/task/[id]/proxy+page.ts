// @ts-nocheck
import type { PageLoad } from './$types';

export const ssr = false;

export const load = async ({ params }: Parameters<PageLoad>[0]) => {
    return { taskId: params.id };
};
