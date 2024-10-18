<script>
    import { onMount } from "svelte";
    import { base } from "$app/paths";
    import Carousel from "./Carousel.svelte";

    export let showModal; // boolean
    export let stadiums
    
    let dialog; // HTMLDialogElement
    let current = 0;
    let show = 1;
    let countrySlug = 'germany'
    let items = [
        {
            name: '20732.jpg'
        },
        {
            name: '20732.jpg'
        }
    ]

    $: if (dialog && showModal) dialog.showModal();

    const formatNumber = (number) => {
        return number
            .toString()
            .replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
    };

    onMount(() => {
        try {
            console.log('[Modal] onMount')
        } catch (error) {
            console.log('error: ', error);
        }
    })
</script>

<!-- svelte-ignore a11y-click-events-have-key-events a11y-no-noninteractive-element-interactions -->
<dialog
    bind:this={dialog}
    on:close={() => (showModal = false)}
    on:click|self={() => dialog.close()}
>
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <div class="text-center" on:click|stopPropagation>
        <slot name="header" />
        <slot />
        <!-- svelte-ignore a11y-autofocus -->

        {#if (stadiums[0] && stadiums[0]['images'])}
        <div class="text-center">
            showModal: {showModal}<br />
            <!-- stadiums.length: {stadiums.length}<br /> -->
            <!-- stadiums[0][images][0][name]: {stadiums[0]['images'][0]['name']}<br /> -->

            <div style="width:100%; height: 250px; border: 1px solid red;">
                <Carousel items={stadiums[0]['images']} let:item bind:current bind:show>
                    <div class="item" style="background-image: url({base}/images/stadiums/{countrySlug}/{item.name}); background-size: contain; background-repeat: no-repeat; background-position: center c">
                        {item.name}
                    </div>
                </Carousel>
            </div>
            {#each stadiums[0]['images'] as item, i}
                <span
                role="button"
                    tabindex="0"
                    on:keydown={() => {}}
                    class="carousel-navigation-item"
                    on:click={() => (current = i)}
                    >
                    <svg viewBox="0 0 512 512" width="12" version="1.1" id="ring">
                        <ellipse
                        style="fill:#325bad;"
                        id="outerRing"
                        cx="256"
                        cy="256"
                        rx="256"
                        ry="256"
                        />
                        <ellipse
                        style="fill:#fff;"
                        class={current == i && 'active-item'}
                        id="innerRing"
                        cx="256"
                        cy="256"
                        rx="202"
                        ry="202"
                        />
                    </svg>
                </span>
                {/each}
                
                <button class="" style="margin: 0 auto;" on:click={() => dialog.close()}
                    >close modal</button
                    >
                </div>
                {/if}
    </div>
</dialog>

<style>
    dialog {
        border-radius: 0.4em;
        border: 2px solid red;
        width: 100%;
        padding: 0;
        /* position: absolute; */
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
    }
    dialog::backdrop {
        background: rgba(0, 0, 0, 0.4);
    }
    dialog > div {
        padding: 1em;
    }
    /* dialog[open] {
        animation: zoom 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
    }
    dialog[open]::backdrop {
        animation: fade 0.2s ease-out;
    } */
    @keyframes zoom {
        from {
            transform: scale(0.95);
        }
        to {
            transform: scale(1);
        }
    }
    @keyframes fade {
        from {
            opacity: 0;
        }
        to {
            opacity: 1;
        }
    }
    button {
        display: block;
    }
    .carousel-navigation-item {
        display: inline;
        margin: 0 2px;
    }
    .carousel-navigation-item:hover {
        cursor: pointer;
    }
    .active-item {
        fill: #325bad !important;
    }
</style>
