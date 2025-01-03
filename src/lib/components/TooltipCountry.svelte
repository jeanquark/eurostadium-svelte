<script>
    import { base } from "$app/paths";

    export let data;
    export let left;
    export let tooltipWidth;
</script>

<div
    class="text-center tooltip"
    style="left: {left}px;"
    bind:clientWidth={tooltipWidth}
>
    <!-- data.leagues.length: {data?.leagues?.length}<br /> -->
    <!-- leagueStore.leagues.length: {leagueStore.leagues?.length}<br /> -->
    <div class="row align-center">
        <div class="col-4" style="">
            <div style="">
                <img
                    src="{base}/images/flags/{data.slug}.png"
                    width="60"
                    alt="Country flag"
                    class="my-2"
                />
                <h3 class="text-center mb-3">{data.name}</h3>
                <h5 class="text-center text-muted">Pop: {data.population}</h5>
            </div>
        </div>
        <div class="col-8">
            <img
                src="{base}/images/countries/{data.slug}.jpg"
                width="100%"
                alt="Country panorama"
            />
        </div>
    </div>
    <div
        class="row mt-4"
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
        <div class="col-6">
            <div class="row align-center">
                <div class="col-6 text-center" style="">
                    <h4 class="text-black">{data.leagues[0]?.name}</h4>
                </div>
                {#if data.leagues[1]}
                    <div class="col-6 text-center" style="">
                        <h4 class="text-black">{data.leagues[1]?.name}</h4>
                    </div>
                {/if}
            </div>
            <div class="row align-center">
                <div class="col-6 text-center">
                    <img
                        src="{base}/images/leagues/{data.slug}/{data.leagues[0]
                            ?.api_football_id}.png"
                        width="60"
                        class=""
                        alt="Top league"
                    />
                </div>
                <div class="col-6 text-center">
                    {#if data.leagues[1]}
                        <img
                            src="{base}/images/leagues/{data.slug}/{data
                                .leagues[1]?.api_football_id}.png"
                            width="60"
                            class=""
                            alt="Second league"
                        />
                    {/if}
                </div>
            </div>
        </div>
    </div>
</div>

<style>
    .tooltip {
        width: 400px;
        padding: 10px;
        border: 2px solid #325bad;
        border-radius: 6px;
        background: white;
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        z-index: 1000;
    }
</style>
