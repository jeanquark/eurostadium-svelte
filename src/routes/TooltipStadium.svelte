<script>
    import { base } from "$app/paths";

    export let data;
    export let countrySlug;
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
    const formatNumber = (number) => {
        return number
            .toString()
            .replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
    };
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

<!-- <div class="tooltip" style="top: 50%; transform: translateY(50%); left: 0px;">
    {data[0]?.venue?.name}, {data[0]?.venue?.city}
    <div class="row align-center">
        <div class="col-12 text-center relative">
            <h2>
                <span class="text-primary"><b>{data[0]['venue']['name']}</b></span>, <span class="text-muted">{data[0]['venue']['city']}</span>
            </h2>
            <h3 class="">
                ${formatNumber(data[0]['venue']['capacity'])}
            </h3>
            <img src="{base}/images/icons/close.svg" width="20" class="text-right" id="closeTooltipBtn" alt="close button" style="position: absolute; top: 0; right: 0;" />
        </div>
    </div>
    <div class="row">
        <div class="col-12 text-center">
            <img src="{base}/images/stadiums/{countrySlug}/{data[0]['venue']['api_football_id']}.jpg" width="100%" alt="Stadium" />
        </div>
    </div>
</div> -->

<div class="text-center tooltip">
    <div class="row align-center">
        <div class="col-12 text-center relative">
            <h2>
                <span class="text-primary"
                    ><b>{data[0]["venue"]["name"]}</b></span
                >, <span class="text-muted">{data[0]["venue"]["city"]}</span>
            </h2>
            <h3 class="">
                {formatNumber(data[0]["venue"]["capacity"])}
            </h3>
            <img
                src="{base}/images/icons/close.svg"
                width="20"
                class="text-right"
                id="closeTooltipBtn"
                alt="close button"
                style="position: absolute; top: 0; right: 0;"
            />
        </div>
    </div>
    <div class="row">
        <div class="col-12 text-center">
            <img
                src="{base}/images/stadiums/{countrySlug}/{data[0]['venue'][
                    'api_football_id'
                ]}.jpg"
                width="100%"
                alt="Stadium"
            />
        </div>
    </div>
    <div class="row align-center">
        <div class="col-4 text-center border-1" style="">
            <h3 class="text-center">{data[0].team?.name}</h3>
            <img
                src="{base}/images/teams/{countrySlug}/{data[0]['team'][
                    'api_football_id'
                ]}.png"
                width="40%"
                alt="Team logo"
            />
        </div>
        {#if data[1]}
            <div class="col-4 text-center border-1" style="">
                <h3 class="text-center">{data[1].team?.name}</h3>
                <img
                    src="{base}/images/teams/{countrySlug}/{data[1]['team'][
                        'api_football_id'
                    ]}.png"
                    width="50%"
                    alt="Team logo"
                />
            </div>
        {/if}
        <div class="col-4 text-center border-1" style="">
            <a href={base / data[0]["venue"]["url"]} target="_blank">
                Wiki
                <img
                    src="{base}/images/icons/external-link.svg"
                    width="10"
                    alt="Wikipedia icon"
                />
            </a>
        </div>
    </div>
</div>

<style>
    .tooltip {
        width: 400px;
        /* height: 100px; */
        border: 2px solid green;
        border-radius: 6px;
        background: white;
        padding: 10px;
        position: absolute;
        left: 0px;
        top: 50%;
        /* top: 400px; */
        transform: translateY(-50%);
    }
</style>
