<script>
    import { base } from '$app/paths'
    import { browser } from '$app/environment'
    import SvelteCarousel from 'svelte-carousel'

    let { data, showModal = $bindable(), header, countrySlug } = $props()
    let dialog = $state()
    let carousel = $state(null)
    let loaded = $state([0, 1])

    $effect(() => {
        if (showModal) dialog.showModal()
    })

    const formatNumber = (number) => {
        if (number) {
            return number.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ',')
        }
        return
    }
    const getImageSource = (imageId) => {
        console.log('getImageSource imageId: ', imageId)
    }
    const onPageChange = (event) => {
        console.log('onPageChange event: ', event)
        if (!loaded.includes(event.detail + 1)) {
            loaded.push(event.detail + 1)
        }
    }
</script>

<!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_noninteractive_element_interactions -->
<dialog
    bind:this={dialog}
    onclose={() => (showModal = false)}
    onclick={(e) => {
        if (e.target === dialog) dialog.close()
    }}
>
    <div class="row">
        {@render header?.()}
        <hr />
        <div class="col-12 text-center">
            <h2>
                <span class="text-primary"><b>{data?.stadium?.name}</b></span>,
                <span class="text-muted">{data?.stadium?.city}</span>
            </h2>
            <h3>
                {formatNumber(data?.stadium?.capacity)}
            </h3>
        </div>
        <div class="col-12">
            {#if browser}
			<!-- {#if data} -->
                <SvelteCarousel autoplay autoplayDuration={500} pauseOnFocus={true} bind:this={carousel} on:pageChange={onPageChange}>
                    {#each data?.images as image, imageIndex}
                        <div class="img-container" style="height: 300px; background: #FFF;">
                            {#if loaded.includes(imageIndex)}
                                {image.name}<br />
                                <img src={image.url} alt="stadium" height="100%" style="" />
                            {/if}
                        </div>
                    {/each}
                </SvelteCarousel>
				{/if}
            <!-- {/if} -->
        </div>
        <div class="col-12 text-center">
            
        </div>
    </div>
	<div class="row" style="border: 1px solid orange;">
		<div class="row justify-center my-2">
			<div>
				<a href={data?.stadium?.wiki} target="_blank">
					Wiki
					<img src="{base}/images/icons/external-link.svg" width="10" alt="Wikipedia icon" />
				</a>
				<button onclick={() => getImageSource(1)}>Source</button>
			</div>
		</div>
		<div class="row justify-center align-center">
			{#each data?.teams as team, i}
				<div class="col-4 text-center" style="border: 2px solid purple;">
					<h3 class="text-center">{team.name}</h3>
					<img src="{base}/images/teams/{countrySlug}/{team.api_football_id}.png" width="40%" alt="Team logo" />
				</div>
			{/each}
		</div>
	</div>
	<div class="row justify-center">
		<!-- svelte-ignore a11y_autofocus -->
		<button autofocus onclick={() => dialog.close()}>close modal</button>
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
    /* dialog[open] {
		animation: zoom 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
	} */
    @keyframes zoom {
        from {
            transform: scale(0.95);
        }
        to {
            transform: scale(1);
        }
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
    }
</style>
