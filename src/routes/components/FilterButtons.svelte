<script>
    import { createEventDispatcher, onMount } from "svelte";
    import { stadiumStore } from "../../store/stadium";
    export let country;

    const dispatch = createEventDispatcher();

    onMount(() => {
        console.log('FilterButtons')
    });

    let filterValue = "all";
    let stadiums = [];
    // let country = {
    //     slug: "",
    //     name: "",
    //     population: 0,
    //     leagues: [],
    // };

    $: stadiumsAll = [
        ...new Set(
            $stadiumStore.stadiumsByCountry[country?.slug]?.map(
                (el) => el.stadium.api_football_id,
            ),
        ),
    ].length;
    $: stadiumsTopLeague = [
        ...new Set(
            $stadiumStore.stadiumsByCountry[country?.slug]
                ?.filter(
                    (el) =>
                        el.leagues[0]?.api_football_id ==
                        country.leagues[0]["api_football_id"],
                )
                .map((el) => el.stadium.api_football_id),
        ),
    ].length;
    $: stadiumsSecondLeague = [
        ...new Set(
            $stadiumStore.stadiumsByCountry[country?.slug]
                ?.filter(
                    (el) =>
                        el.leagues[0]?.api_football_id ==
                        country.leagues[1]["api_football_id"],
                )
                .map((el) => el.stadium.api_football_id),
        ),
    ].length;
    $: stadiumsSm = [
        ...new Set(
            $stadiumStore.stadiumsByCountry[country?.slug]
                ?.filter((el) => el.stadium.capacity < 20000)
                .map((el) => el.stadium.api_football_id),
        ),
    ].length;
    $: stadiumsMd = [
        ...new Set(
            $stadiumStore.stadiumsByCountry[country?.slug]
                ?.filter(
                    (el) =>
                        el.stadium.capacity >= 20000 &&
                        el.stadium.capacity < 40000,
                )
                .map((el) => el.stadium.api_football_id),
        ),
    ].length;
    $: stadiumsLg = [
        ...new Set(
            $stadiumStore.stadiumsByCountry[country?.slug]
                ?.filter(
                    (el) =>
                        el.stadium.capacity >= 40000 &&
                        el.stadium.capacity < 60000,
                )
                .map((el) => el.stadium.api_football_id),
        ),
    ].length;
    $: stadiumsXl = [
        ...new Set(
            $stadiumStore.stadiumsByCountry[country?.slug]
                ?.filter((el) => el.stadium.capacity >= 60000)
                .map((el) => el.stadium.api_football_id),
        ),
    ].length;

    const filterStadiums = (filter) => {
        console.log("filterStadiums: ", filter);
        console.log("country.leagues: ", country.leagues);
        // return
        // filterValue = filter;
        switch (filter) {
            case "all":
                filterValue = "all";
                stadiums = $stadiumStore.stadiumsByCountry[country?.slug];
                break;
            case "top_league":
                filterValue = "top_league";
                stadiums = $stadiumStore.stadiumsByCountry[country?.slug].filter(
                    (el) =>
                        el.leagues[0].api_football_id ==
                        country.leagues[0]["api_football_id"],
                );
                // console.log('stadiums: ', stadiums)
                break;
            // return abc1.length;
            case "second_league":
                filterValue = "second_league";
                stadiums = $stadiumStore.stadiumsByCountry[country?.slug].filter(
                    (el) =>
                        el.leagues[0].api_football_id ==
                        country.leagues[1]["api_football_id"],
                );
                break;
            case "stadium_sm":
                filterValue = "stadium_sm";
                //stadiums = []
                stadiums = [
                    ...new Set(
                        $stadiumStore.stadiumsByCountry[country?.slug].filter(
                            (el) => el.stadium.capacity < 20000,
                        ),
                    ),
                ];
                break;
            case "stadium_md":
                filterValue = "stadium_md";
                stadiums = [
                    ...new Set(
                        $stadiumStore.stadiumsByCountry[country?.slug].filter(
                            (el) =>
                                el.stadium.capacity >= 20000 &&
                                el.stadium.capacity < 40000,
                        ),
                    ),
                ];
                break;
            case "stadium_lg":
                filterValue = "stadium_lg";
                stadiums = [
                    ...new Set(
                        $stadiumStore.stadiumsByCountry[country?.slug].filter(
                            (el) =>
                                el.stadium.capacity >= 40000 &&
                                el.stadium.capacity < 60000,
                        ),
                    ),
                ];
                break;
            case "stadium_xl":
                filterValue = "stadium_xl";
                stadiums = [
                    ...new Set(
                        $stadiumStore.stadiumsByCountry[country?.slug].filter(
                            (el) => el.stadium.capacity >= 60000,
                        ),
                    ),
                ];
                break;
        }
        dispatch("updateFilter", filter);
        dispatch("updateStadiums", stadiums);
    };
</script>

<div class="box">
    <!-- country.slug: {country?.slug}<br /><br /> -->
    stadiums.length: {stadiums.length}<br />
    <!-- $stadiumStore.stadiumsByCountry[country.slug]: {$stadiumStore.stadiumsByCountry[country?.slug]}<br /> -->
    filterValue: {filterValue}<br />
    <button
        class="btn btn-filter {filterValue == 'all' &&
            'active'}"
        id="btnAll"
        on:click={() => {
            filterStadiums("all");
        }}
        >
        <span style="vertical-align: middle;">All&nbsp;</span>
        <span class="pill">{stadiumsAll}</span>
    </button>
    <button
            class="btn btn-filter {filterValue == 'top_league' &&
                'active'}"
            id="btnTop" style="color: #FFF;"
            on:click={() => {
                filterStadiums("top_league");
            }}
            >
            <span style="vertical-align: middle;">1<sup>st</sup> League&nbsp;</span>
            <span class="pill">{stadiumsTopLeague}</span>
        </button>
        <button
            class="btn btn-filter {filterValue == 'second_league' &&
                'active'}"
            id="btnSecond"
            on:click={() => {
                filterStadiums("second_league");
            }}
            >
            <span style="vertical-align: middle;">2<sup>nd</sup> League&nbsp;</span>
            <span class="pill">{stadiumsSecondLeague}</span>
        </button>
        <button
            class="btn btn-filter {filterValue == 'stadium_sm' &&
                'active'}"
            id="btnSm"
            on:click={() => {
                filterStadiums("stadium_sm");
            }}
        >
            <span style="vertical-align: middle;">0 - 20k&nbsp;</span>
            <span class="pill" style="">{stadiumsSm}</span>
        </button>
        <button
            class="btn btn-filter {filterValue == 'stadium_md' &&
                'active'}"
            id="btnMd"
            on:click={() => {
                filterStadiums("stadium_md");
            }}
            >
            <span style="vertical-align: middle;">20k - 40k&nbsp;</span>
            <span class="pill">{stadiumsMd}</span>
        </button>
        <button
            class="btn btn-filter {filterValue == 'stadium_lg' &&
                'active'}"
            id="btnLg"
            on:click={() => {
                filterStadiums("stadium_lg");
            }}
            >
            <span style="vertical-align: middle;">40k - 60k&nbsp;</span>
            <span class="pill">{stadiumsLg}</span>
        </button>
        <button
            class="btn btn-filter {filterValue == 'stadium_xl' &&
                'active'}"
            id="btnXl"
            on:click={() => {
                filterStadiums("stadium_xl");
            }}
            >
            <span style="vertical-align: middle;">60k+&nbsp;</span>
            <span class="pill">{stadiumsXl}</span>
        </button>
    <!-- <div class="pill">All</div>
    <div class="pill">1st League</div>
    <div class="pill">2nd League</div>
    <div class="pill">0 - 20k</div>
    <div class="pill">20k - 40k</div>
    <div class="pill">40k - 60k</div>
    <div class="pill">+60k</div> -->
</div>

<style>
    .box {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
    }
    .pill {
        background: var(--color-theme-1);
        color: #fff;
        border-radius: 0.5em;
        margin: 0.4em 0.2em;
        /* padding: 0.3em 0.5em; */
        vertical-align: middle;
        padding: 15px 10px;
        height: 20px;
        line-height: 0px;
    }
    .btn-filter {
        padding: 0.4em;
        border-radius: 0.4em;
        /* background: #325bad; */
        background: url("/images/grass_01_blue2.jpg") no-repeat scroll 0 0 transparent !important;
        border: none;
        color: #ffffff;
        margin: 0.3em;
    }

    .btn-filter.active {
        background: url("/images/grass_01.jpg") no-repeat scroll 0 0 transparent !important;
    }

    .btn-filter > .pill {
        padding: 5px 8px;
        background: #808080;
        border-radius: 8px;
        font-size: 9px;
        line-height: 20px;
        vertical-align: middle;
    }

    .btn-filter.active > .pill {
        background: orangered;
    }

    .btn-filter:hover {
        cursor: pointer;
        background: #003399;
    }

    .btn-filter.active {
        background: #003399;
    }
    .btn-filter:disabled {
        border: 1px solid #999999;
        background-color: #cccccc;
        color: #666666;
        cursor: not-allowed;
    }
    .grass-background {
        background: url("/images/grass_01.jpg") no-repeat scroll 0 0 transparent !important;
    }
    .grass-background-grey {
        background: url("/images/grass_01_grey.jpg") no-repeat scroll 0 0 transparent !important;
    }
    .grass-background-blue {
        background: url("/images/grass_01_blue2.jpg") no-repeat scroll 0 0 transparent !important;
    }
    </style>