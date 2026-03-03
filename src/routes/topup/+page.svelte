<script lang="ts">
    import { onMount } from "svelte";
    import { goto } from "$app/navigation";
    import {
        fetchBalance,
        isLoggedIn,
        fetchPackages,
    } from "$lib/api";
    import type { PackageTier } from "$lib/api";
    import { authModalOpen } from "$lib/stores";
    import type { UserBalance } from "$lib/types";
    import ConfirmModal from "$lib/components/ConfirmModal.svelte";

    let tiers: PackageTier[] = [];
    let defaultPricing: {
        base: number;
        per_gb: number;
    } | null = null;
    let balance: UserBalance | null = null;
    let loading = true;
    let error = "";

    let buyModalOpen = false;
    let selectedTierIndex = -1;

    onMount(async () => {
        try {
            const pkg = await fetchPackages();
            tiers = pkg.tiers || [];
            defaultPricing = pkg.default || null;
            if (isLoggedIn()) {
                balance = await fetchBalance();
            }
        } catch (e: any) {
            error = e.message || "Failed to load packages";
        } finally {
            loading = false;
        }
    });

    function handleBuy(tierIndex: number) {
        if (!isLoggedIn()) {
            $authModalOpen = true;
            return;
        }
        selectedTierIndex = tierIndex;
        buyModalOpen = true;
    }

    function confirmBuy() {
        if (selectedTierIndex >= 0) {
            goto(`/payment/purchase?tier=${selectedTierIndex}`);
            buyModalOpen = false;
        }
    }
</script>

<svelte:head>
    <title>Top Up Credits — FastBaidu</title>
</svelte:head>

<div class="max-w-5xl mx-auto px-4 py-12">
    <div class="text-center mb-12">
        <h1 class="text-3xl font-bold text-white mb-3">Top Up Credits</h1>
        <p class="text-surface-400 text-lg">
            Choose a package to start teleporting your files.
        </p>
        {#if balance}
            <div
                class="mt-4 inline-flex items-center gap-2 px-5 py-2 rounded-full bg-brand-500/10 border border-brand-500/20"
            >
                <span class="text-surface-400 text-sm">Current Balance:</span>
                <span class="text-brand-400 font-bold text-lg"
                    >{balance.balance_gb.toFixed(2)} GB</span
                >
            </div>
        {/if}
    </div>

    {#if loading}
        <div class="grid md:grid-cols-3 gap-6">
            {#each Array(3) as _}
                <div
                    class="h-64 bg-surface-800/50 rounded-2xl animate-pulse"
                ></div>
            {/each}
        </div>
    {:else if error}
        <div class="text-center py-12">
            <div class="text-5xl mb-4">⚠️</div>
            <p class="text-red-400">{error}</p>
        </div>
    {:else}
        <div class="grid md:grid-cols-3 gap-6">
            {#each tiers as tier, i}
                <div
                    class="relative glass rounded-2xl p-8 border transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl
					{tier.popular
                        ? 'border-brand-500/50 shadow-lg shadow-brand-500/10'
                        : 'border-surface-700/50 hover:border-brand-500/30'}"
                >
                    {#if tier.popular}
                        <div
                            class="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full gradient-brand text-white text-xs font-bold uppercase tracking-wider"
                        >
                            Most Popular
                        </div>
                    {/if}

                    <div class="text-center mb-6">
                        <h3 class="text-xl font-bold text-white mb-2">
                            {tier.name}
                        </h3>
                        <div class="flex items-baseline justify-center gap-1">
                            <span class="text-4xl font-extrabold text-white"
                                >${tier.price}</span
                            >
                        </div>
                        <p class="text-surface-400 mt-2 text-sm">
                            {tier.size_gb} GB • ${(
                                tier.price / tier.size_gb
                            ).toFixed(2)}/GB
                        </p>
                    </div>

                    <ul class="space-y-3 mb-8 text-sm text-surface-300">
                        <li class="flex items-center gap-2">
                            <span class="text-emerald-400">✓</span>
                            <span>{tier.size_gb} GB transfer credits</span>
                        </li>
                        <li class="flex items-center gap-2">
                            <span class="text-emerald-400">✓</span>
                            <span>Up to 80 MB/s speed</span>
                        </li>
                        <li class="flex items-center gap-2">
                            <span class="text-emerald-400">✓</span>
                            <span>Google Drive delivery</span>
                        </li>
                    </ul>

                    <button
                        on:click={() => handleBuy(i)}
                        class="w-full py-3 rounded-xl font-semibold text-sm transition-all
						{tier.popular
                            ? 'gradient-brand text-white hover:opacity-90'
                            : 'bg-surface-800 text-surface-300 hover:bg-surface-700 hover:text-white border border-surface-700'}"
                    >
                        Buy {tier.name}
                    </button>
                </div>
            {/each}
        </div>

        {#if defaultPricing}
            <div class="mt-12 glass rounded-2xl p-8 text-center">
                <h3 class="text-lg font-bold text-white mb-2">Pay-Per-File</h3>
                <p class="text-surface-400 text-sm mb-4">
                    Don't need a package? Pay only for what you transfer.
                </p>
                <div class="inline-flex items-baseline gap-1">
                    <span class="text-2xl font-bold text-white"
                        >${defaultPricing.base.toFixed(2)}</span
                    >
                    <span class="text-surface-500 text-sm">base</span>
                    <span class="text-surface-500 text-sm mx-1">+</span>
                    <span class="text-2xl font-bold text-white"
                        >${defaultPricing.per_gb.toFixed(2)}</span
                    >
                    <span class="text-surface-500 text-sm">/GB</span>
                </div>
            </div>
        {/if}
    {/if}

    <div class="text-center mt-8">
        <a
            href="/"
            class="text-surface-500 hover:text-brand-400 text-sm transition-colors"
            >← Back to Home</a
        >
    </div>
</div>

<ConfirmModal
	bind:open={buyModalOpen}
	title="Confirm Purchase"
	message={selectedTierIndex >= 0 ? `Are you sure you want to purchase the ${tiers[selectedTierIndex].name} package for $${tiers[selectedTierIndex].price}?` : ""}
	confirmText="Proceed to Checkout"
	cancelText="Cancel"
	icon="🛍️"
	confirmClass="bg-brand-500 text-white hover:bg-brand-400 border border-brand-500/30 shadow-brand-500/20"
	onConfirm={confirmBuy}
/>
