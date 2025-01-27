<script>
    import { onMount } from "svelte";
    import TooltipCountry from "@lib/components/TooltipCountry.svelte";
    import TooltipStadium from "@lib/components/TooltipStadium.svelte";
    import { page } from "$app/stores";
    import Europe from "@components/svg/Europe.svelte";
    import FilterButtons from "@components/FilterButtons.svelte";
    import Modal from "@components/Modal.svelte";
    import Statistics from "@components/Statistics.svelte";
    import camelize from "@utils/convertToCamelCase";
    import { leagueStore } from "@store/league";
    import { stadiumStore } from "@store/stadium";

    let countryLeagues = $state([]);
    let country = $state({
        slug: "",
        name: "",
        population: 0,
        leagues: [],
    });
    let stadiums = $state([]);
    let selectedStadium = $state(null);
    let left = $state(0);
    let top = $state(0);
    let showCountryTooltip = $state(false);
    let showStadiumTooltip = $state(false);
    let showFilterButtons = $state(false);
    let showComponent = $state(false);
    let filterValue = $state("all");
    let svgMap;
    let showModal = $state(false);
    let tooltipCountryWidth = $state(0);
    let tooltipStadiumWidth = $state(0);
    let mouseOverTooltip = $state(false);
    let isMobileDevice = $state(false);
    let CurrentComponent = $state(Europe);

    let {
        title = "eurostadium.net",
        description = "Football stadiums across Europe",
        image = "https://eurostadium.net/images/logo.png",
    } = $props();

    onMount(async () => {
        if (hasTouchSupport() && hasSmallScreen()) {
            console.log("Mobile device detected");
        } else {
            console.log("Desktop device detected");
        }
        if ($leagueStore.leagues.length < 2) {
            await leagueStore.fetchLeagues();
        }
        if (hasSmallScreen()) {
            isMobileDevice = true;
        }
        showComponent = true;
    });

    const loadComponent = async (map) => {
        console.log("loadComponent map: ", map);
        const module = await import(`@components/svg/${map}.svelte`);
        CurrentComponent = module.default;
        showStadiumTooltip = false;
    };

    const displayMap = async (map) => {
        console.log("displayMap: ", map);
        if (map?.toLowerCase() == "europe") {
            showFilterButtons = false;
            console.log("reset zoom to 1");
            // resetZoom3();
        }
        loadComponent(map);
    };

    const countryHover = (event) => {
        // console.log("countryHover: ", event);
        if (!event.leagueIds) {
            return;
        }
        // return
        if (isMobileDevice) {
            console.log("isMobileDevice");
            // return
        } else {
            showCountryTooltip = true;
        }
        const { leagueIds, clientX, rect } = event;
        const offsetWidth = svgMap.offsetWidth;
        const tooltipRect = svgMap.getBoundingClientRect();
        const distFromLeft = clientX - parseInt(tooltipRect.left);

        if (distFromLeft > offsetWidth / 2) {
            left = parseInt(rect.x) - parseInt(tooltipCountryWidth) - 10;
        } else {
            left = parseInt(rect.x) + parseInt(rect.width);
        }
        if (!leagueIds?.length) {
            alert("leagueIds are not defined");
            return;
        }
        // console.log("leagueIds: ", leagueIds);
        // console.log("leagueStore.leagues: ", $leagueStore.leagues);
        countryLeagues = [];
        for (let i = 0; i < leagueIds.length; i++) {
            const abc = $leagueStore.leagues?.find(
                (league) => league.api_football_id == parseInt(leagueIds[i]),
            );
            if (abc) {
                countryLeagues.push(abc);
            }
        }
        // console.log("countryLeagues: ", countryLeagues);
        country = {
            slug: event.id,
            name: event.countryName,
            population: event.population,
            leagues: countryLeagues,
        };
        // console.log("country: ", country);
    };
    const countryClick = async (event) => {
        // console.log("countryClick event: ", event);
        // return
        let countrySlug = event;

        if (countrySlug == "europe") {
            displayMap("Europe");
            return;
        }
        console.log("countrySlug: ", countrySlug);
        // return
        if (isMobileDevice) {
            console.log("isMobileDevice");
            // displayMap(camelize(country));
            // return
        }
        showCountryTooltip = false;

        // const stadiumsByCountry = $stadiumStore.stadiumsByCountry[countrySlug];

        if (!$stadiumStore.stadiumsByCountry[countrySlug]) {
            await stadiumStore.fetchStadiumsByCountrySlug(countrySlug);
        }

        const abc = $stadiumStore.stadiumsByCountry[countrySlug].filter(
            (el) =>
                el.leagues[0].api_football_id ==
                country.leagues[0]["api_football_id"],
        );
        console.log("abc: ", abc);
        stadiums = abc;

        displayMap(camelize(countrySlug));
        // displayMap(camelize('liechtenstein'))
        filterValue = "top_league";
        showFilterButtons = true;

        switch (event) {
            case "liechtenstein":
                if (!$stadiumStore.stadiumsByCountry["switzerland"]) {
                    await stadiumStore.fetchStadiumsByCountrySlug(
                        "switzerland",
                    );
                }
                stadiums = $stadiumStore.stadiumsByCountry["switzerland"];
                showFilterButtons = false;
                break;
            case "andorra":
                if (!$stadiumStore.stadiumsByCountry["spain"]) {
                    await stadiumStore.fetchStadiumsByCountrySlug("spain");
                }
                stadiums = $stadiumStore.stadiumsByCountry["spain"];
                showFilterButtons = false;
                break;
            case "moncaco":
                if (!$stadiumStore.stadiumsByCountry["france"]) {
                    await stadiumStore.fetchStadiumsByCountrySlug("france");
                }
                stadiums = $stadiumStore.stadiumsByCountry["france"];
                showFilterButtons = false;
                break;
        }
    };
    const countryLeave = () => {
        // console.log("countryLeave");
        showCountryTooltip = false;
    };

    const stadiumHover = (event) => {
        console.clear();
        console.log("stadiumHover: ", event);
        // return

        const { stadiumId, clientX, clientY, rect } = event;
        // const stadiumId = event.detail;
        // stadiums = $stadiumStore.stadiumsByCountry[country.slug]?.filter(
        //     (team) => team.id == stadiumId,
        // );
        // console.log("stadiums: ", stadiums);
        const abc = stadiums.find((el) => el.stadium.id == stadiumId);
        console.log("abc: ", abc);
        selectedStadium = stadiums.find((el) => el.stadium.id == stadiumId);
        // console.log("selectedStadium: ", selectedStadium);
        // teams = $stadiumStore.stadiums[country.slug]?.filter(
        //     (team) => team.venue.api_football_id == stadiumId,
        // );

        const offsetWidth = svgMap.offsetWidth;
        const tooltipRect = svgMap.getBoundingClientRect();
        const distFromLeft = clientX - parseInt(tooltipRect.left);
        console.log("tooltipRect: ", tooltipRect);
        // console.log('rect.width: ', rect.width)
        // console.log('myElement: ', myElement)
        // console.log('clientY: ', clientY);
        // console.log("rect.y: ", rect.y);

        if (distFromLeft > offsetWidth / 2) {
            // console.log('Left tooltip')
            // left = parseInt(rect.x) - parseInt(tooltipRect.width) - 8
            // left = parseInt(rect.x) - 420 - 4
            left = parseInt(rect.x) - parseInt(tooltipStadiumWidth) - 0;
        } else {
            // console.log('Right tooltip')
            left = parseInt(rect.x) + parseInt(rect.width) / 2;
            // left = parseInt(rect.x) + 5
        }
        top = rect.y - tooltipRect.top;

        if (isMobileDevice) {
            console.log("isMobileDevice");
            console.log("showModal1: ", showModal);
            // if (!showModal) {
            showModal = true;
            // }
            console.log("showModal2: ", showModal);
        } else {
            showStadiumTooltip = true;
        }
    };

    const stadiumLeave = () => {
        console.log("onStadiumLeave");
        console.log("mouseOverTooltip: ", mouseOverTooltip);
        // if (!mouseOverTooltip) {
        if (isMobileDevice) {
            return;
        }
        showStadiumTooltip = false;
        // }
    };

    const onTooltipStadiumHover = () => {
        console.log("onTooltipStadiumHover");
        // mouseOverTooltip = true
        // tooltip.style.display = 'block'
        // stadium.classList.add('hover')
    };

    const tooltipLeave = () => {
        console.log("tooltipLeave");
        showStadiumTooltip = false;
        const stadiums = document.getElementsByTagName("circle");
        // console.log('stadiums: ', document.getElementsByTagName('circle'));
        for (let i = 0; i < stadiums.length; i++) {
            // console.log('i: ', i);
            stadiums[i].classList.remove("hover");
        }
        // mouseOverTooltip = false
        // const tooltip = document.getElementById('tooltip')
        // // console.log('stadium2: ', stadium)
        // if (!mouseOverStadium) {
        //     stadium.classList.remove('hover')
        // }
        // tooltip.style.display = 'none'
    };
    const tooltipClose = () => {
        showStadiumTooltip = false;
    };
    const updateStadiums = (value) => {
        // console.log("updateStadiums: ", value);
        // return
        stadiums = value;
    };
    const updateFilter = (value) => {
        console.log("updateFilter: ", value);
        // console.log('filterValue: ', filterValue);
        // return
        filterValue = value;
        // console.log('filterValue2: ', filterValue);
    };

    const hasSmallScreen = () => {
        const minWidth = 1024; // Minimum width for desktop devices
        return window.innerWidth < minWidth || screen.width < minWidth;
    };
    const hasTouchSupport = () => {
        return "ontouchstart" in window || navigator.maxTouchPoints > 0;
    };

    const clickOutsideCountry = () => {
        // console.log("clickOutsideCountry");
        displayMap("Europe");
        // showFilterButtons = false
    };
</script>

<svelte:head>
    <title>{title}</title>
    <meta name="description" content={description} />
    <meta property="og_site_name" content="eurostadium.net" />
    <meta
        property="og:url"
        content="https://www.example.com{$page.url.pathname.toString()}"
    />
    <meta property="og:type" content="website" />
    <meta property="og:title" content={title} />
    <meta property="og:description" content={description} />
    <meta property="og:image" content={image} />

    <meta name="twitter:card" content="summary_large_image" />
    <meta property="twitter:domain" content="“example.com" />
    <meta
        property="twitter:url"
        content="https://www.example.com{$page.url.pathname.toString()}"
    />
    <meta name="twitter:title" content={title} />
    <meta name="twitter:description" content={description} />
    <meta name="twitter:image" content={image} />
    {@html `  <script type="application/ld+json">{
   "@context": "https://schema.org",
   "@type": "Website",
   "name": "${title} | example.com",
   "url": "https//www.example.com${$page.url.pathname}",
   "logo": ${image}  }</script>`}
</svelte:head>

<div class="row justify-center">
    <div class="col-sm-10 col-md-8 col-lg-6 col-xl-6 border-0">
        <Statistics />
    </div>
</div>

<div class="row">
    {#if showModal}
        <Modal bind:showModal data={selectedStadium} countrySlug={country.slug}>
            {#snippet header()}{/snippet}
        </Modal>
    {/if}
</div>

<div class="row justify-content-center mt-2">
    {#if showFilterButtons}
        <p class="my-1"><i>Hover any stadium to display images</i></p>
    {:else}
        <p class="my-1"><i>Click any country to load its map</i></p>
    {/if}
</div>

<div
    class="row my-0 py-0 justify-content-center border-0"
    style="position: relative;"
>
    <div
        class="col-sm-1 col-md-2 col-lg-3 col-xl-3 hidden-sm-and-down border-0"
        style=""
    ></div>
    <div
        class="col-sm-10 col-md-8 col-lg-6 col-xl-6 border-primary border-radius-1"
        style="background: #FFF;"
    >
        {#if showCountryTooltip}
            <TooltipCountry
                data={country}
                {left}
                bind:tooltipWidth={tooltipCountryWidth}
            />
        {/if}
        {#if showStadiumTooltip}
            <TooltipStadium
                data={selectedStadium}
                countrySlug={country.slug}
                {left}
                {top}
                bind:tooltipWidth={tooltipStadiumWidth}
                on:tooltipHover={onTooltipStadiumHover}
                {tooltipLeave}
                {tooltipClose}
            />
        {/if}

        <div id="svgWrapper" bind:this={svgMap} class="border-radius-08">
            <CurrentComponent
                filter={filterValue}
                countryObj={country}
                stadiumsArray={stadiums}
                {countryHover}
                {countryLeave}
                {countryClick}
                {stadiumHover}
                {stadiumLeave}
                {clickOutsideCountry}
            />
        </div>
    </div>
    <div
        class="col-sm-1 col-md-2 col-lg-3 col-xl-3 justify-center align-content d-xs-none hidden-sm-and-down border-0"
    >
        {#if showFilterButtons}
            <FilterButtons
                {country}
                {updateFilter}
                {updateStadiums}
                {displayMap}
            />
        {/if}
    </div>
</div>

<div class="row hidden-md-and-up">
    <div class="col-12 py-2">
        {#if showFilterButtons}
            <FilterButtons
                {country}
                {updateFilter}
                {updateStadiums}
                {displayMap}
            />
        {/if}
    </div>
</div>

<style>
    :global(svg) {
        display: block;
    }
</style>
