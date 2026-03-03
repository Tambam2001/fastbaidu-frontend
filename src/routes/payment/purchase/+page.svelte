<script lang="ts">
    import { page } from "$app/stores";
    import { onMount } from "svelte";
    import { goto } from "$app/navigation";
    import { ordersApi } from "$lib/api/client";
    import { fetchPackages } from "$lib/api";

    let packages: any[] = [];
    let selectedPackage: any = null;
    let loading = true;
    let submitting = false;
    let error = "";

    $: tierParam = $page.url.searchParams.get("tier");
    
    $: if (packages.length > 0 && tierParam !== null) {
        const idx = parseInt(tierParam, 10);
        if (idx >= 0 && idx < packages.length) {
            selectedPackage = packages[idx];
        } else {
            selectedPackage = null;
        }
    }

    onMount(async () => {
        try {
            const pkgData = await fetchPackages();
            packages = pkgData.tiers || [];
        } catch (e: any) {
            error = e.message || "Failed to load packages";
        } finally {
            loading = false;
        }
    });

    async function handlePayment(method: "paypal" | "nowpayments") {
        if (!selectedPackage) return;
        submitting = true;
        error = "";
        try {
            const res = await ordersApi.create(selectedPackage.name, method);
            if (res.payment_url) {
                window.location.href = res.payment_url;
            } else {
                error = "No payment URL returned from server.";
                submitting = false;
            }
        } catch (e: any) {
            error = e.message || "Failed to initialize payment";
            submitting = false;
        }
    }
</script>

<svelte:head>
    <title>Checkout — FastBaidu</title>
</svelte:head>

<div class="max-w-2xl mx-auto px-4 py-12">
    <div class="text-center mb-8">
        <h1 class="text-3xl font-bold text-white mb-2">Select Payment Method</h1>
        <p class="text-surface-400">Complete your secure checkout for the selected package.</p>
    </div>

    {#if loading}
        <div class="h-64 bg-surface-800/50 rounded-2xl animate-pulse"></div>
    {:else if error}
        <div class="text-center py-12 bg-red-500/10 border border-red-500/20 rounded-2xl">
            <div class="text-4xl mb-4">⚠️</div>
            <p class="text-red-400 font-medium">{error}</p>
            <button
                on:click={() => goto('/topup')}
                class="mt-4 px-6 py-2 rounded-lg bg-surface-700 hover:bg-surface-600 text-white transition-colors"
            >
                Back to Packages
            </button>
        </div>
    {:else if !selectedPackage}
        <div class="text-center py-12 bg-surface-800/30 rounded-2xl border border-surface-700/50">
            <p class="text-surface-400 mb-4">No package selected or invalid tier.</p>
            <button
                on:click={() => goto('/topup')}
                class="px-6 py-2 rounded-lg bg-brand-500 hover:bg-brand-400 text-white font-bold transition-colors"
            >
                View Packages
            </button>
        </div>
    {:else}
        <!-- Selected Package Summary -->
        <div class="glass rounded-2xl p-6 mb-8 border border-surface-700/50">
            <div class="flex justify-between items-center mb-4">
                <span class="text-surface-400 text-sm font-semibold uppercase tracking-wider">Order Summary</span>
                <span class="px-2.5 py-1 text-xs font-bold rounded-lg bg-emerald-500/20 text-emerald-300">FastBaidu Top-Up</span>
            </div>
            
            <div class="flex items-end justify-between border-b border-surface-700/50 pb-6 mb-6">
                <div>
                    <h2 class="text-2xl font-bold text-white leading-tight">{selectedPackage.name} Package</h2>
                    <p class="text-brand-400 font-medium mt-1">+{selectedPackage.size_gb} GB Quota</p>
                </div>
                <div class="text-right">
                    <span class="text-3xl font-black text-white">${selectedPackage.price.toFixed(2)}</span>
                    <span class="block text-surface-500 text-xs">USD One-time</span>
                </div>
            </div>

            <!-- Payment Methods -->
            <div class="space-y-4">
                <h3 class="text-sm font-medium text-surface-300 mb-3">Pay securely with:</h3>
                
                <button
                    on:click={() => handlePayment('paypal')}
                    disabled={submitting}
                    class="w-full relative group overflow-hidden bg-[#003087] hover:bg-[#00205e] disabled:opacity-50 disabled:cursor-not-allowed text-white p-4 rounded-xl flex items-center justify-between transition-all hover:scale-[1.01] shadow-lg"
                >
                    <span class="absolute inset-0 w-1/4 h-full bg-white/10 skew-x-12 -ml-[100%] group-hover:animate-[shine_0.7s_ease-out_forwards]"></span>
                    <div class="flex items-center gap-4 relative z-10">
                        <div class="w-12 h-12 rounded-lg bg-white p-2.5 flex items-center justify-center">
                            <span class="text-xl font-bold text-[#003087] italic">PayPal</span>
                        </div>
                        <div class="text-left">
                            <div class="font-bold text-lg">PayPal / Credit Card</div>
                            <div class="text-blue-200 text-sm">Instant activation</div>
                        </div>
                    </div>
                    <span class="relative z-10 text-2xl">→</span>
                </button>

                <button
                    on:click={() => handlePayment('nowpayments')}
                    disabled={submitting}
                    class="w-full relative group overflow-hidden bg-surface-800 hover:bg-surface-700 border border-surface-600 hover:border-brand-500 disabled:opacity-50 disabled:cursor-not-allowed text-white p-4 rounded-xl flex items-center justify-between transition-all hover:scale-[1.01] shadow-lg"
                >
                    <span class="absolute inset-0 w-1/4 h-full bg-white/5 skew-x-12 -ml-[100%] group-hover:animate-[shine_0.7s_ease-out_forwards]"></span>
                    <div class="flex items-center gap-4 relative z-10">
                        <div class="w-12 h-12 rounded-lg bg-surface-900 border border-surface-700 flex items-center justify-center text-xl">
                            🪙
                        </div>
                        <div class="text-left">
                            <div class="font-bold text-lg text-white">Cryptocurrency</div>
                            <div class="text-surface-400 text-sm">USDT, BTC, ETH, etc. (Powered by NOWPayments)</div>
                        </div>
                    </div>
                    <span class="relative z-10 text-2xl text-surface-500 group-hover:text-brand-400 transition-colors">→</span>
                </button>
            </div>
            
            {#if submitting}
                <div class="mt-6 flex flex-col items-center justify-center text-surface-400">
                    <div class="w-6 h-6 border-2 border-brand-500 border-t-transparent rounded-full animate-spin mb-2"></div>
                    <span class="text-sm font-medium">Redirecting to payment gateway...</span>
                </div>
            {/if}
        </div>
        
        <p class="text-center text-xs text-surface-500 flex items-center justify-center gap-1">
            🔒 Payments are processed securely on the gateway's website.
        </p>
    {/if}
</div>

<style>
    @keyframes shine {
        100% {
            margin-left: 200%;
        }
    }
</style>
