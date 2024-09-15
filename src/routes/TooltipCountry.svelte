<script>
    import { base } from "$app/paths";

    export let data;
    // export let left
    // export let top
    let isHovered = false;
    let x;
    let y;

    function mouseOver(e) {
        console.log("mouseOver: ", e);
        const path = e.target;
        console.log("path: ", path);
        isHovered = true;
        x = e.pageX + 5;
        y = e.pageY + 5;
    }
    function mouseMove(e) {
        console.log("mouseMove: ", e);
        x = e.pageX + 5;
        y = e.pageY + 5;
    }
    function mouseLeave() {
        console.log("mouseLeave");
        isHovered = false;
    }
    // const clientX = e.clientX
    // const offsetWidth = document.getElementById('svgWrapper').offsetWidth
    // const rect = e.target.getBoundingClientRect()
    // const tooltip = document.getElementById('tooltip')
    // const tooltipRect = tooltip.getBoundingClientRect()

    // tooltip.style.top = '50%'
    // tooltip.style.transform = 'translateY(-50%)'
</script>

<!-- <div on:mouseover={mouseOver} on:mouseleave={mouseLeave} on:mousemove={mouseMove} role="tooltip" on:focus={() => {}}>
    <slot />
</div>

{#if isHovered}
<div style="top: {y}px; left: {x}px;" class="tooltip">
    {title}
</div>
{/if} -->

<!-- <div class="col-12 text-center tooltip" style=""> -->
<div class="text-center tooltip">
    <!-- <h2 class="text-center">{data?.name}</h2>
    <p>
        data.slug: {data?.slug}<br />
        data.population: {data?.population}<br />
        data.leagues.length {data?.leagues?.length}<br />
    </p> -->
    <!-- <div class="row">
        <div
            class="col-2"
            style="display: flex;
        align-items: center;"
        >
            <img
                src="{base}/images/flags/{data.slug}.png"
                width="60"
                alt="Country flag"
            />
        </div>
        <div
            class="col-4"
            style="display: flex; justify-content: center;
        align-items: center;"
        >
            <div style="display: flex-column;">
                <h2 class="text-center">{data.name}</h2>
                <h4 class="text-center">Pop: {data.population}</h4>
            </div>
        </div>
        <div class="col-6">
            <img
                src="{base}/images/countries/{data.slug}.jpg"
                width="100%"
                alt="Country panorama"
            />
        </div>
    </div> -->
    <div class="row">
        <div class="col-2" style="display: flex;
        align-items: center;">
            <img src="{base}/images/flags/{data.slug}.png" width="60" alt="Country flag" />
        </div>
        <div class="col-4" style="display: flex; justify-content: center;
        align-items: center;">
            <div style="display: flex-column;">
                <h2 class="text-center">{data.name}</h2>
                <h5 class="text-center">Pop: {data.population}</h5>
            </div>
        </div>
        <div class="col-6">
            <img src="{base}/images/countries/{data.slug}.jpg" width="100%" alt="Country panorama" />
        </div>
    </div>
    <div
        class="row mt-4 border-0"
        style="display: flex-row;
                justify-content: center;
                align-items: center;"
    >
        <div class="col-6">
            <img
                src="{base}/images/countries/{data.slug}_stadium.jpg"
                width="100%"
                alt="Stadium"
            />
        </div>
        <div class="col-6 border-0">
            <div class="row align-center">
                <div class="col-6 text-center border-0" style="">
                    <h4 class="border-0">{data.leagues[0]?.name}</h4>
                </div>
                {#if data.leagues[1]}
                    <div class="col-6 text-center border-0" style="">
                        <h4 class="border-0">{data.leagues[1]?.name}</h4>
                    </div>
                {/if}
            </div>
            <div class="row align-center">
                <div class="col-6 text-center border-0">
                    <img
                        src="{base}/images/leagues/{data.slug}/{data
                            .leagues[0]?.api_football_id}.png"
                        width="60"
                        class="border-0"
                        alt="Top league"
                    />
                </div>
                <div class="col-6 text-center border-0">
                    <img
                        src="{base}/images/leagues/{data.slug}/{data
                            .leagues[1]?.api_football_id}.png"
                        width="60"
                        class="border-0"
                        alt="Second league"
                    />
                </div>
            </div>
        </div>
    </div>
</div>

<style>
    .tooltip {
        width: 400px;
        padding: 10px;
        /* height: 100px; */
        border: 2px solid green;
        border-radius: 6px;
        background: white;
        position: absolute;
        /* top: 0px; */
        left: 0px;
        top: 50%;
        /* top: 400px; */
        transform: translateY(-50%);
    }
</style>
