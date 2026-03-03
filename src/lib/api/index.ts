export * from "./client";
export * from "./sse";

// ─── Pricing types (matches GET /api/plans response) ──────────────────────────
export interface PackageTier {
    name: string;
    price: number;
    size_gb: number;
    popular: boolean;
}

export interface PackagesResponse {
    tiers: PackageTier[];
    default: {
        base: number;
        per_gb: number;
    };
}

// Fetch pricing plans from the real backend API
export async function fetchPackages(): Promise<PackagesResponse> {
    const BASE = import.meta.env.DEV 
        ? 'http://localhost:8090' 
        : (import.meta.env.VITE_API_URL || 'http://localhost:8090');
    const res = await fetch(
        BASE + '/api/plans'
    );
    if (!res.ok) throw new Error('Failed to load pricing plans');
    return res.json();
}
