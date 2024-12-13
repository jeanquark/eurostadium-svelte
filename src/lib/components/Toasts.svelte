<script>
    import Toast from "./Toast.svelte";

    import { dismissToast, toasts } from "@store/toast";
    // import { toastStore } from "@store/toast";
</script>

<!-- toastStore.toasts.length: {toastStore.toasts?.length}<br /> -->
<!-- $toasts.length: {$toasts?.length}<br /> -->
<!-- {#if toastStore.toasts} -->
{#if $toasts}
    <section>
        <!-- <div style="top: 20px; right: 20px;"> -->
        {#each $toasts as toast (toast.id)}
            <Toast
                type={toast.type}
                dismissible={toast.dismissible}
                dismiss={() => dismissToast(toast.id)}>{toast.message}</Toast
            >
        {/each}
        <!-- </div> -->
    </section>
{/if}
