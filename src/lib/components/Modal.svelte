<script>
    import { base } from "$app/paths";
    import { browser } from "$app/environment";
    import SvelteCarousel from "svelte-carousel";
    import CloseIcon from "@components/icons/CloseIcon.svelte";

    let { data, showModal = $bindable(), header, countrySlug } = $props();
    let dialog = $state();
    let carousel = $state(null);
    let loaded = $state([0, 1]);
    let currentImageIndex = $state(0);

    $effect(() => {
        if (showModal) dialog.showModal();
    });

    const formatNumber = (number) => {
        if (number) {
            return number
                .toString()
                .replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
        }
        return;
    };
    const onPageChange = (event) => {
        console.log("onPageChange event: ", event);
        if (event.detail) {
            currentImageIndex = event.detail;
        }
        if (!loaded.includes(event.detail + 1)) {
            loaded.push(event.detail + 1);
        }
    };
</script>

<!-- svelte-ignore a11y_click_events_have_key_events,
a11y_no_noninteractive_element_interactions -->
<dialog
    bind:this={dialog}
    onclick={(e) => {
        if (e.target === dialog) dialog.close();
    }}
    onclose={() => (showModal = false)}
>
    <div class="row">
        {@render header?.()}
        <hr />
        <div class="col-12 text-center relative">
            <h2>
                <span class="text-primary"><b>{data?.stadium?.name}</b></span>,
                <span class="text-muted">{data?.stadium?.city}</span>
                <!-- <button
                    type="button"
                    class="close-btn"
                    onclick={() => dialog.close()}
                    ><CloseIcon width="1.5em" color="#B2B2B2" /></button
                > -->
            </h2>
            <h3>
                {formatNumber(data?.stadium?.capacity)}
            </h3>
        </div>
        <div class="col-12">
            {#if browser}
                <SvelteCarousel
                    autoplay={false}
                    autoplayDuration={500}
                    pauseOnFocus={true}
                    bind:this={carousel}
                    on:pageChange={onPageChange}
                >
                    {#each data?.images as image, imageIndex}
                        <div
                            class="img-container"
                            style="max-height: 300px; background: #FFF;"
                        >
                            {#if loaded.includes(imageIndex)}
                                <!-- {image.name}<br /> -->
                                <img
                                    src={image.url}
                                    alt="stadium"
                                    style="position: relative; top: 50%; transform: translateY(-50%); max-height: 100%; max-width: 100%;"
                                />
                            {/if}
                        </div>
                    {/each}
                </SvelteCarousel>
            {/if}
        </div>
        <div class="col-12 text-center"></div>
    </div>
    <div class="row align-center mt-0 pt-0" style="padding-top: 0;">
        <div class="col-4 px-5 border-0" style="">
            <a href={data?.stadium?.wiki} target="_blank">
                Wiki
                <img
                    src="{base}/images/icons/external-link.svg"
                    width="10"
                    alt="External link icon"
                />
            </a><br />
            <a href={data?.images[currentImageIndex]?.src} target="_blank">
                Img src
                <img
                    src="{base}/images/icons/external-link.svg"
                    width="10"
                    alt="External link icon"
                />
            </a>
        </div>
        <div class="col-4 border-0" style="">
            {#each data?.teams as team, i}
                <div class="text-center" style="">
                    <a href={team.wiki} target="_blank">
                        <h3>{team.name}</h3>
                        <img
                            src="{base}/images/teams/{countrySlug}/{team.api_football_id}.png"
                            width="50%"
                            alt="Team logo"
                        />
                    </a>
                </div>
            {/each}
        </div>
        <div class="col-4 border-0" style=""></div>
    </div>
    <div class="row justify-center my-0" style="padding: .5em;">
        <!-- svelte-ignore a11y_autofocus -->
        <button
            type="button"
            autofocus
            class="text-muted"
            onclick={() => dialog.close()}
            ><CloseIcon width="1.5em" color="#B2B2B2" /></button
        >
    </div>
</dialog>

<style>
    dialog {
        /* max-width: 32em; */
        border-radius: 0.2em;
        border: none;
        padding: 0;
        width: 100%;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
    }
    dialog::backdrop {
        background: rgba(0, 0, 0, 0.3);
    }
    dialog > div {
        padding: 1em;
    }
    dialog[open]::backdrop {
        animation: fade 0.2s ease-out;
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
        background: transparent;
        border: none;
    }
    .close-btn {
        position: absolute;
        top: 0;
        right: 0;
        background: none;
        border: none;
    }
    .close-btn:hover {
        cursor: pointer;
    }
</style>
