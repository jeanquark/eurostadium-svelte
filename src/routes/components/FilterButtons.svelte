<script>
    import { onMount } from "svelte";
    import { stadiumStore } from "../../store/stadium";
    export let country;

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
            $stadiumStore.stadiums[country?.slug]?.map(
                (team) => team.venue.api_football_id,
            ),
        ),
    ].length;
    $: stadiumsTopLeague = [
        ...new Set(
            $stadiumStore.stadiums[country?.slug]
                ?.filter(
                    (team) =>
                        team.league.api_football_id ==
                        country.leagues[0]["api_football_id"],
                )
                .map((team) => team.venue.api_football_id),
        ),
    ].length;
    $: stadiumsSecondLeague = [
        ...new Set(
            $stadiumStore.stadiums[country?.slug]
                ?.filter(
                    (team) =>
                        team.league.api_football_id ==
                        country.leagues[1]["api_football_id"],
                )
                .map((team) => team.venue.api_football_id),
        ),
    ].length;
    $: stadiumsSm = [
        ...new Set(
            $stadiumStore.stadiums[country?.slug]
                ?.filter((team) => team.venue.capacity < 20000)
                .map((team) => team.venue.api_football_id),
        ),
    ].length;
    $: stadiumsMd = [
        ...new Set(
            $stadiumStore.stadiums[country?.slug]
                ?.filter(
                    (team) =>
                        team.venue.capacity >= 20000 &&
                        team.venue.capacity < 40000,
                )
                .map((team) => team.venue.api_football_id),
        ),
    ].length;
    $: stadiumsLg = [
        ...new Set(
            $stadiumStore.stadiums[country?.slug]
                ?.filter(
                    (team) =>
                        team.venue.capacity >= 40000 &&
                        team.venue.capacity < 60000,
                )
                .map((team) => team.venue.api_football_id),
        ),
    ].length;
    $: stadiumsXl = [
        ...new Set(
            $stadiumStore.stadiums[country?.slug]
                ?.filter((team) => team.venue.capacity >= 60000)
                .map((team) => team.venue.api_football_id),
        ),
    ].length;

    const filterStadiums = (filter) => {
        console.log("filterStadiums: ", filter);
        console.log("country.leagues: ", country.leagues);
        // filterValue = filter;
        switch (filter) {
            case "all":
                filterValue = "all";
                stadiums = $stadiumStore.stadiums[country?.slug];
                break;
            case "top_league":
                filterValue = "top_league";
                stadiums = $stadiumStore.stadiums[country?.slug].filter(
                    (team) =>
                        team.league.api_football_id ==
                        country.leagues[0]["api_football_id"],
                );
                // console.log('stadiums: ', stadiums)
                break;
            // return abc1.length;
            case "second_league":
                filterValue = "second_league";
                stadiums = $stadiumStore.stadiums[country?.slug].filter(
                    (team) =>
                        team.league.api_football_id ==
                        country.leagues[1]["api_football_id"],
                );
                break;
            case "stadium_sm":
                filterValue = "stadium_sm";
                //stadiums = []
                stadiums = [
                    ...new Set(
                        $stadiumStore.stadiums[country?.slug].filter(
                            (team) => team.venue.capacity < 20000,
                        ),
                    ),
                ];
                break;
            case "stadium_md":
                filterValue = "stadium_md";
                stadiums = [
                    ...new Set(
                        $stadiumStore.stadiums[country?.slug].filter(
                            (team) =>
                                team.venue.capacity >= 20000 &&
                                team.venue.capacity < 40000,
                        ),
                    ),
                ];
                break;
            case "stadium_lg":
                filterValue = "stadium_lg";
                stadiums = [
                    ...new Set(
                        $stadiumStore.stadiums[country?.slug].filter(
                            (team) =>
                                team.venue.capacity >= 40000 &&
                                team.venue.capacity < 60000,
                        ),
                    ),
                ];
                break;
            case "stadium_xl":
                filterValue = "stadium_xl";
                stadiums = [
                    ...new Set(
                        $stadiumStore.stadiums[country?.slug].filter(
                            (team) => team.venue.capacity >= 60000,
                        ),
                    ),
                ];
                break;
        }
    };
</script>

<div class="box">
    country.slug: {country?.slug}<br /><br />
    <!-- stadiums.length: {stadiums.length}<br /> -->
    <!-- $stadiumStore.stadiums[country]: {$stadiumStore.stadiums[country]}<br /> -->
    <button
        class="btn btn-filter {filterValue == 'all' &&
            'active'} grass-background"
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
                'active'} grass-background-blue"
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
                'active'} grass-background-grey"
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
                'active'} grass-background-grey"
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
                'active'} grass-background-grey"
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
                'active'} grass-background-grey"
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
                'active'} grass-background-grey"
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
        background: #325bad;
        border: none;
        color: #ffffff;
        margin: 0.3em;
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