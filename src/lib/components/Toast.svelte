<script>
    import { fade } from "svelte/transition";
    import SuccessIcon from "./icons/SuccessIcon.svelte";
    import ErrorIcon from "./icons/ErrorIcon.svelte";
    import InfoIcon from "./icons/InfoIcon.svelte";
    import CloseIcon from "./icons/CloseIcon.svelte";

    let { children, dismiss, type, dismissible } = $props();

</script>

<article class={type} role="alert" transition:fade>
    {#if type === "success"}
        <SuccessIcon width="30px" />
    {:else if type === "error"}
        <ErrorIcon width="30px" />
    {:else if type === "warning" || 'type' === "warn" }
        <ErrorIcon width="30px" />
    {:else}
        <InfoIcon width="30px" />
    {/if}

    <div class="text">
         <p style="text-align: left; margin: 0; line-height: 1.5; font-size: 0.9rem;">
            {@render children()}
         </p>
    </div>

    {#if dismissible}
        <button class="close" onclick={() => {dismiss()}}>
            <CloseIcon width="0.8em" color="#fff" />
        </button>
    {/if}
</article>

<style lang="postcss">
    article {
        color: white;
        padding: 0.75rem 1.5rem;
        border-radius: 0.2rem;
        display: flex;
        align-items: center;
        margin: 0 auto 0.5rem auto;
        width: 20rem;
    }
    .error {
        background: IndianRed;
    }
    .warning {
        background: lightsalmon;
    }
    .success {
        background: MediumSeaGreen;
    }
    .info {
        background: SkyBlue;
    }
    .text {
        margin-left: 1rem;
        text-align: left;
    }
    button {
        color: white;
        background: transparent;
        border: 0 none;
        padding: 0;
        margin: 0 0 0 auto;
        line-height: 1;
        font-size: 1rem;
    }
    .close:hover {
        cursor: pointer;
    }
</style>
