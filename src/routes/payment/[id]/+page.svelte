<script lang="ts">
    import { page } from "$app/stores";
    import { goto } from "$app/navigation";
    import { onMount } from "svelte";

    $: taskId = $page.params.id;

    onMount(() => {
        // Since FastBaidu uses a Balance (GB) system, one-time task checkout
        // is handled by topping up the account balance. We redirect the user
        // to the Top-Up page with a message.
        // Replace current history state so 'back' works properly.
        goto('/topup?reason=insufficient_balance', { replaceState: true });
    });
</script>

<div class="flex items-center justify-center min-h-[50vh] text-surface-400">
    <div class="flex flex-col items-center gap-4">
        <div class="w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin"></div>
        <p>Redirecting to Top-Up...</p>
    </div>
</div>
