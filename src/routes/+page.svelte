<script>
    import { onMount } from "svelte";
    import { base } from "$app/paths";
    import Counter from "./Counter.svelte";
    import Tooltip from "./Tooltip.svelte";
    import TooltipCountry from "./TooltipCountry.svelte";
    import TooltipStadium from "./TooltipStadium.svelte";
    import Modal from "./components/Modal.svelte";
    // import Circle from "./Circle.svelte";
    // import Rect from "./Rect.svelte";
    import Europe from "./components/svg/Europe.svelte";
    import welcome from "$lib/images/svelte-welcome.webp";
    import welcome_fallback from "$lib/images/svelte-welcome.png";
    import { db } from "../lib/firebase/firebase";
    import {
        collection,
        query,
        where,
        orderBy,
        limit,
        doc,
        getDoc,
        getDocs,
        addDoc,
        setDoc,
        updateDoc,
        deleteDoc,
    } from "firebase/firestore";
    import { counter } from "../store/count";
    import { leagueStore } from "../store/league";
    import { stadiumStore } from "../store/stadium";
    import camelize from "../utils/convertToCamelCase";
    import Carousel from "./components/Carousel.svelte";

    let map = "europe-with-russia.svg";
    let countryLeagues = [];
    let country = {
        slug: "",
        name: "",
        population: 0,
        leagues: [],
    };
    $: country2 = {};
    let stadiums = [];
    let teams = [];
    let stadiums2 = [];
    // $:stadiums = [];
    let left = 0;
    let top = 0;
    // $: countryLeagues = []
    let showCountryTooltip = false;
    let showStadiumTooltip = false;
    let showFilterButtons = true;
    let filterValue = "all";
    let svgMap;
    let showModal = false;
    let myElement;
    let tooltipCountryWidth = 0;
    let tooltipStadiumWidth = 0;
    let mouseOverTooltip = false;
    let isMobileDevice = false;

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

    onMount(() => {
        if (hasTouchSupport() && hasSmallScreen()) {
            console.log("Mobile device detected");
        } else {
            console.log("Desktop device detected");
        }
        if ($leagueStore.leagues.length < 2) {
            fetchLeagues();
        }
        if (hasSmallScreen() && hasTouchSupport()) {
            isMobileDevice = true;
        }
    });

    function mod(n, m) {
        return ((n % m) + m) % m;
    }

    const toggleMap = () => {
        // console.clear();
        console.log("toggleMap");
        // console.log('component: ', component);
        // component = Circle
        // if (map == "europe-with-russia.svg") {
        // 	map = "germany.svg";
        // } else {
        // 	map = "europe-with-russia.svg";
        // }
        // component == Circle ? component = Rect : component = Circle
        // console.log('currentComponent: ', currentComponent)
        if (componentName == "Circle") {
            componentName = "Rect";
        } else {
            componentName = "Circle";
        }
        // loadComponent();
    };

    const loadComponent = async (map) => {
        console.log("loadComponent map: ", map);
        // let myComponent
        // console.log('myComponent: ', myComponent);
        // const module = await import (`./${componentName}.svelte`);
        const module = await import(`./components/svg/${map}.svelte`);
        // const module = await import ('./Circle.svelte');
        console.log("module: ", module);
        currentComponent = module.default;
        showStadiumTooltip = false;
    };

    const displayMap = async (map) => {
        loadComponent(map);
    };

    function useTooltip() {}
    function abc(e) {
        console.log("abc: ", e);
    }
    let currentComponent = Europe;
    let componentName = "Circle";
    // let component2 = Circle

    const fetchLeagues = async () => {
        await leagueStore.fetchLeagues();
        return;
        const querySnapshot = await getDocs(collection(db, "leagues"));
        // console.log('querySnapshot: ', querySnapshot);
        const array = [];
        querySnapshot.forEach((doc) => {
            // doc.data() is never undefined for query doc snapshots
            // console.log(doc.id, " => ", doc.data());
            array.push(doc.data());
        });
        // console.log('array: ', array)
        $leagueStore.leagues = array;
    };
    const fetchLeagueByApiFootballId = async (leagueId) => {
        console.log("fetchLeagueByApiFootballId");
        console.log("leagues1: ", leagues);
        return;
        leagueHandlers.setLeagues([
            { id: 1, text: "Learn Svelte state management", completed: false },
            {
                id: 2,
                text: "Build a Todo-list with state management",
                completed: false,
            },
        ]);
        console.log("leagues2: ", leagues);
        return;
        const q = query(
            collection(db, "leagues"),
            where("api_football_id", "==", leagueId),
        );
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
            // doc.data() is never undefined for query doc snapshots
            console.log(doc.id, " => ", doc.data());
        });
    };
    const updateLeague = async () => {
        console.log("updateLeague");
        const washingtonRef = doc(db, "leagues", "QXaYrt8zQws8ONic7p6D");

        // Set the "capital" field of the city 'DC'
        await updateDoc(washingtonRef, {
            name: "Challenge League",
        });
    };
    const setLeagues = async () => {
        console.log("setLeagues");

        const response = await fetch("/json/leagues.json");
        const json = await response.json();
        // console.log(json)

        const leaguesRef = doc(collection(db, "leagues2"));

        const abc = json.length;
        // console.log('abc: ', abc);
        // return
        for (let i = 0; i < json.length; i++) {
            await addDoc(collection(db, "leagues"), json[i]);
        }
    };
    const deleteLeague = async () => {
        console.log("deleteLeague");
        await deleteDoc(doc(db, "leagues2", "SF"));
    };

    const onCountryHover = (event) => {
        // return
        // console.clear();
        console.log("onCountryHover: ", event.detail);
        // country = event.detail
        if (isMobileDevice) {
            console.log("isMobileDevice");
            // return
        } else {
            showCountryTooltip = true;
        }
        // const leagueIds = event.detail?.split(",");
        const { leagueIds, clientX, rect } = event.detail;
        // console.log('clientX: ', clientX)
        // console.log('rect: ', rect);
        // console.log("leagueIds: ", leagueIds);
        // const offsetWidth = document.getElementById("svgWrapper").offsetWidth;
        const offsetWidth = svgMap.offsetWidth;
        // console.log("offsetWidth: ", offsetWidth);
        // const tooltip = document.getElementById("tooltip");
        // const tooltipRect = tooltip.getBoundingClientRect();
        // let left = 0
        const tooltipRect = svgMap.getBoundingClientRect();
        // console.log('abc: ', clientX - tooltipRect.left);
        const distFromLeft = clientX - parseInt(tooltipRect.left);

        if (distFromLeft > offsetWidth / 2) {
            // console.log('Left tooltip')
            // tooltip.style.left = `${rect.x - 410 - rect.width}px`
            // tooltip.style.left = `${rect.x - rect.width - parseInt(tooltipRect.width)}px`
            // left = parseInt(rect.x) - parseInt(tooltipRect.width) - 15
            left = parseInt(rect.x) - parseInt(tooltipCountryWidth) - 10;
            // left = parseInt(`${rect.x - 200}px`);
            // tooltip.style.left = offsetLeft + (clientX - parseInt(tooltipRect.width)) - 20 + 'px'
        } else {
            // console.log('Right tooltip')
            left = parseInt(rect.x) + parseInt(rect.width);
        }
        // left = 0
        // console.log("left: ", left);

        // const leagueIds = data.leagueIds
        if (!leagueIds?.length) {
            alert("leagueIds are not defined");
            return;
        }
        countryLeagues = [];
        // console.log("abc: ", abc);
        for (let i = 0; i < leagueIds.length; i++) {
            // console.log('leagueIds[i]: ', leagueIds[i])
            // fetchLeagueByApiFootballId(parseInt(leagues[i]))
            const abc = leagueStore.leagues?.find(
                (league) => league.api_football_id == parseInt(leagueIds[i]),
            );
            if (abc) {
                countryLeagues.push(abc);
            }
        }
        // console.log('countryLeagues: ', countryLeagues);
        // country = {
        // 	firstname: 'John',
        // 	lastname: 'Doe'
        // }
        country = {
            slug: event.detail.id,
            name: event.detail.countryName,
            population: event.detail.population,
            leagues: countryLeagues,
        };
        // console.log('$country2: ', country2);
    };
    const onCountryClick = async (event) => {
        const country = event.detail;
        console.log("onCountryClick country: ", country);
        if (isMobileDevice) {
            console.log("isMobileDevice");
            // displayMap(camelize(country));
            // return
        }
        showCountryTooltip = false;

        const countryStadiums = $stadiumStore.stadiums[country];
        console.log("countryStadiums: ", countryStadiums);
        if (!countryStadiums || countryStadiums.length < 5) {
            // const querySnapshot = await getDocs(collection(db, `countries/${country}/stadiums`));
            await stadiumStore.fetchStadiumsByCountry(country);

            // const stadiumsRef = collection(db, `countries/${country}/stadiums`)
            // const q = query(stadiumsRef, orderBy('venue.capacity', 'asc'))
            // const querySnapshot = await getDocs(q)

            // console.log('[Firebase call] querySnapshot: ', querySnapshot)
            // const array = []
            // querySnapshot.forEach((doc) => {
            //     array.push(doc.data())
            // })
            // console.log('array: ', array)

            // stadiumStore.setStadiums({ [country]: array })
        }
        stadiums = $stadiumStore.stadiums[country];
        const abc = $stadiumStore.stadiums;
        console.log("abc: ", abc);
        const def = camelize(country);
        console.log("def: ", def);
        displayMap(camelize(country));
        filterValue = "all";
        showFilterButtons = true;
    };
    const onCountryLeave = () => {
        console.log("onCountryLeave");
        showCountryTooltip = false;
    };

    const onStadiumHover = (event) => {
        console.log("onStadiumHover: ", event.detail);
        // return

        const { stadiumId, clientX, clientY, rect } = event.detail;
        // const stadiumId = event.detail;
        stadiums = $stadiumStore.stadiums[country.slug]?.filter(
            (team) => team.venue.api_football_id == stadiumId,
        );
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
        console.log("rect.y: ", rect.y);

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
        // const tooltip = document.getElementById("tooltip");
        // if (tooltip) {
        // 	tooltip.style.display = "block";
        // }
        // console.log("stadiums: ", stadiums);
    };

    const onStadiumLeave = (e) => {
        console.log("onStadiumLeave e: ", e);
        console.log("mouseOverTooltip: ", mouseOverTooltip);
        // if (!mouseOverTooltip) {
        if (isMobileDevice) {
            return
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

    const onTooltipLeave = () => {
        console.log("onTooltipLeave");
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
    const onTooltipClose = () => {
        showStadiumTooltip = false;
    };
    const onModalOpen = () => {
        showModal = true;
    };

    // Store
    // $: leagues = [];
    // leagueStore.subscribe((curr) => {
    // 	leagues = curr.data;
    // });
    const increaseCount = () => {
        // $countStore.value += 1;
        // count.update((n) => n + 1);
        counter.increment();
    };
    const decreaseCount = () => {
        // $countStore.value -= 1;
        // count.update((n) => n - 1);
        counter.decrement();
    };
    const fetchCountry = async () => {
        const country = "germany";
        return;
        const response = await fetch(`/json/countries/${country}.json`);
        const json = await response.json();

        const abc = json.length;
        console.log("abc: ", abc);

        for (let i = 0; i < json.length; i++) {
            await addDoc(
                collection(db, `countries/${country}/stadiums`),
                json[i],
            );
        }
    };

    const filterStadiums = (filter) => {
        console.log("filterStadiums: ", filter);
        console.log("country.leagues: ", country.leagues);
        // filterValue = filter;
        switch (filter) {
            case "all":
                filterValue = "all";
                stadiums = $stadiumStore.stadiums[country?.slug];
                break;
                return $stadiumStore.stadiums[country?.slug]?.length;
            case "top_league":
                filterValue = "top_league";
                stadiums = $stadiumStore.stadiums[country?.slug].filter(
                    (team) =>
                        team.league.api_football_id ==
                        country.leagues[0]["api_football_id"],
                );
                // console.log('stadiums: ', stadiums)
                break;
                return $stadiumStore.stadiums[country?.slug].filter(
                    (team) => team.league.api_football_id == 78,
                ).length;
            // return abc1.length;
            case "second_league":
                filterValue = "second_league";
                stadiums = $stadiumStore.stadiums[country?.slug].filter(
                    (team) =>
                        team.league.api_football_id ==
                        country.leagues[1]["api_football_id"],
                );
                break;
                return $stadiumStore.stadiums[country?.slug].filter(
                    (team) => team.league.api_football_id == 79,
                ).length;
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
                const abc = [
                    ...new Set(
                        $stadiumStore.stadiums[country?.slug]
                            .filter((team) => team.venue.capacity < 20000)
                            .map((team) => team.venue.api_football_id),
                    ),
                ];
                return abc.length;
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
                return [
                    ...new Set(
                        $stadiumStore.stadiums[country?.slug]
                            .filter(
                                (team) =>
                                    team.venue.capacity >= 20000 &&
                                    team.venue.capacity < 40000,
                            )
                            .map((team) => team.venue.api_football_id),
                    ),
                ].length;
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

    const hasSmallScreen = () => {
        const minWidth = 1024; // Minimum width for desktop devices
        return window.innerWidth < minWidth || screen.width < minWidth;
    };
    const hasTouchSupport = () => {
        return "ontouchstart" in window || navigator.maxTouchPoints > 0;
    };

    // var el = document.getElementsByClassName("test");
    // for (i in el){
    //     el[i].addEventListener("mouseover", function(){
    //         //do something here

    //         //or call a function
    //         doSomeThing();
    //     });
    // }
    const doSomeThing = () => {
        console.log("doSomeThing");
    };
</script>

<svelte:head>
    <title>Home</title>
    <meta name="description" content="Football stadiums across Europe" />
</svelte:head>

<div class="row">
    <div class="col-1 col-xl-2 border-1" style="overflow: hidden;">col-1</div>
    <div class="col-10 col-xl-8 border-2">col-10</div>
    <div class="col-1 col-xl-2 border-3">col-1</div>
</div>
<div class="row">
    <div
        class="col-xs-12 col-sm-4 col-md-3 col-lg-2 col-xl-1"
        style="background: yellow;"
    >
        col-xs-12 col-sm-4 col-md-3 col-lg-2 col-xl-1
    </div>
    <div
        class="col-xs-12 col-sm-4 col-md-6 col-lg-8 col-xl-10"
        style="background: orange;"
    >
        col-xs-12 col-sm-4 col-md-6 col-lg-8 col-xl-10
    </div>
    <div
        class="col-xs-12 col-sm-4 col-md-3 col-lg-2 col-xl-1"
        style="background: orangered;"
    >
        col-xs-12 col-sm-4 col-md-3 col-lg-2 col-xl-1
    </div>
</div>
<div class="row" style="justify-content: center;">
    <div class="col-12 text-center" style="overflow: auto;">
        <!-- </div> -->
        <br />
        <a href="{base}/about">About page</a>
        <br /><br />
        <button on:click={() => (showModal = true)}>Show modal</button>
        <Modal bind:showModal bind:stadiums bind:country>
            <h2 slot="header">modal</h2>
            This is the modal content<br />
            <div class="row align-center">
                <div class="col-12 text-center relative">
                    <h2>
                        <span class="text-primary"
                            ><b>{stadiums[0]?.venue?.name}</b></span
                        >,
                        <span class="text-muted"
                            >{stadiums[0]?.venue?.city}</span
                        >
                    </h2>
                    <h3 class="">
                        {stadiums[0]?.venue?.capacity}
                    </h3>
                </div>
            </div>
        </Modal>
        <br /><br />
        <!-- $leagueStore.leagues.length: {$leagueStore.leagues?.length}<br /><br /> -->
        <!-- countryLeagues.length: {countryLeagues.length}<br /><br /> -->
        <!-- $leagueStore.data.length: {$leagueStore.data.length}<br /><br /> -->
        showModal: {showModal}<br />
        isMobileDevice: {isMobileDevice}<br />
        <!-- left: {left}<br /> -->
        <!-- tooltipStadiumWidth: {tooltipStadiumWidth}<br /> -->
        <!-- tooltipCountryWidth: {tooltipCountryWidth}<br /> -->
        <div style="">
            <button on:click={decreaseCount}>decrease</button>
            <!-- <span style="padding: 0 10px">$countStore: {$countStore.value}</span> -->
            <span style="padding: 0 10px">$counter: {$counter}</span>
            <button on:click={increaseCount}>increase</button>
        </div>
        <br />
        <div>
            <!-- <button on:click={() => toggleMap}>Toggle map</button><br /> -->
            <div style="display: flex; gap: 5px; justify-content: center;">
                <button on:click={() => displayMap("Europe")}>Europe</button><br
                />
                <button on:click={() => displayMap("Germany")}>Germany</button
                ><br />
                <button on:click={() => displayMap("France")}>France</button><br
                />
                <button on:click={() => displayMap("Switzerland")}
                    >Switzerland</button
                ><br />
                <button on:click={() => displayMap("Test")}>Test</button><br />
            </div>
            <br />
            <!-- <button on:click={() => loadComponent()}>Load component</button><br /> -->
            <!-- <Circle /> -->

            <div style="display: flex; gap: 5px; justify-content: center;">
                <button on:click={() => fetchLeagues()}>Fetch leagues</button>
                <br />
                <button on:click={() => fetchLeagueByApiFootballId()}
                    >Fetch league</button
                >
                <br />
                <button on:click={() => updateLeague()}>Update league</button>
                <br />
                <button on:click={() => setLeagues()}>Set leagues</button>
                <br />
                <button on:click={() => deleteLeague()}>Delete league</button>
                <br />
                <button on:click={() => fetchCountry()}
                    >Fetch country data</button
                >
            </div>

            <!-- {#await import("./{component2}.svelte") then Module}
			<Module.default subtitle="Subtilte as prop" />
		{/await} -->

            <!-- <img src="/images/{map}" width="200" alt="europe map" /> -->
            <!-- <Tooltip title="This is a map"> -->
            <!-- <object
				type="image/svg+xml"
				title="europe-svg"
				data="/images/{map}"
				id="svgObject"
				style="width: 300px; border: 2px dashed blue"
				role="presentation"
				on:mouseenter={abc}
				on:focus={() => {}}
			>
				<img src="./images/no-image.png" alt="failover" />
			</object> -->
            <!-- </Tooltip> -->
        </div>
    </div>
    <!-- <Counter /> -->
    <!-- </section> -->
</div>

<div
    class="row my-2 py-5 border-4 justify-content-center"
    style="position: relative;"
>
    <div
        class="col-sm-1 col-md-4 col-lg-3 col-xl-4 border-1 d-xs-none d-sm-none"
        style=""
    ></div>
    <div
        class="col-sm-10 col-md-4 col-lg-6 col-xl-4 border-2"
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
                data={stadiums}
                countrySlug={country.slug}
                {left}
                {top}
                bind:tooltipWidth={tooltipStadiumWidth}
                on:tooltipHover={onTooltipStadiumHover}
                on:tooltipLeave={onTooltipLeave}
                on:tooltipClose={onTooltipClose}
                on:modalOpen={onModalOpen}
            />
        {/if}

        <div id="svgWrapper" bind:this={svgMap} style="border: 1px solid red;">
            <svelte:component
                this={currentComponent}
                filter={filterValue}
                {country}
                stadiums3={stadiums}
                on:countryHover={onCountryHover}
                on:countryLeave={onCountryLeave}
                on:countryClick={onCountryClick}
                on:stadiumHover={onStadiumHover}
                on:stadiumLeave={onStadiumLeave}
                on:clickOutsideCountry={() => {
                    displayMap("Europe");
                    showFilterButtons = false;
                }}
            />
        </div>
    </div>
    <div
        class="col-sm-1 col-md-4 col-lg-3 col-xl-4 justify-center align-content border-3 d-xs-none d-sm-none"
    >
        {#if showFilterButtons}
            <div class="text-center" id="filterPanel">
                filterValue: {filterValue}<br />
                <button
                    class="btn btn-filter {filterValue == 'all' &&
                        'active'} grass-background"
                    id="btnAll"
                    on:click={() => {
                        filterStadiums("all");
                    }}
                    >All&nbsp;
                    <span class="pill">{stadiumsAll}</span>
                </button>
                <button
                    class="btn btn-filter {filterValue == 'top_league' &&
                        'active'}"
                    id="btnTop"
                    on:click={() => {
                        filterStadiums("top_league");
                    }}
                    >1<sup>st</sup>&nbsp;
                    <span class="pill">{stadiumsTopLeague}</span>
                </button>
                <button
                    class="btn btn-filter {filterValue == 'second_league' &&
                        'active'}"
                    id="btnSecond"
                    on:click={() => {
                        filterStadiums("second_league");
                    }}
                    >2<sup>nd</sup> league stadiums&nbsp;
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
                    &#60; 20,000&nbsp;
                    <span class="pill">{stadiumsSm}</span>
                </button>
                <button
                    class="btn btn-filter {filterValue == 'stadium_md' &&
                        'active'}"
                    id="btnMd"
                    on:click={() => {
                        filterStadiums("stadium_md");
                    }}
                    >20,000 &#60; 40,000&nbsp;
                    <span class="pill">{stadiumsMd}</span>
                </button>
                <button
                    class="btn btn-filter {filterValue == 'stadium_lg' &&
                        'active'}"
                    id="btnLg"
                    on:click={() => {
                        filterStadiums("stadium_lg");
                    }}
                    >40,000 &#60; 60,000&nbsp;
                    <span class="pill">{stadiumsLg}</span>
                </button>
                <button
                    class="btn btn-filter {filterValue == 'stadium_xl' &&
                        'active'}"
                    id="btnXl"
                    on:click={() => {
                        filterStadiums("stadium_xl");
                    }}
                    >&#62; 60,000&nbsp;
                    <span class="pill">{stadiumsXl}</span>
                </button>
            </div>
        {/if}
    </div>
</div>

<div class="row">
    <div class="col-12">
        <div class="box">
            <div class="pill">All</div>
            <div class="pill">1st League</div>
            <div class="pill">2nd League</div>
            <div class="pill">0 - 20k</div>
            <div class="pill">20k - 40k</div>
            <div class="pill">40k - 60k</div>
            <div class="pill">+60k</div>
        </div>
    </div>
</div>

<div class="row">
    <br /><br /><br /><br />
    <br /><br /><br /><br />
    <br /><br /><br /><br />
    <br /><br /><br /><br />
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
        padding: 15px 10px;
        height: 20px;
        line-height: 0px;
    }
    /* section {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        flex: 0.6;
    }

    h1 {
        width: 100%;
    }

    .welcome {
        display: block;
        position: relative;
        width: 100%;
        height: 0;
        padding: 0 0 calc(100% * 495 / 2048) 0;
    }

    .welcome img {
        position: absolute;
        width: 100%;
        height: 100%;
        top: 0;
        display: block;
    } */

    .btn-filter {
        padding: 0.6em;
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
        /* background: red !important; */
        background: url("/images/grass_01.jpg") no-repeat scroll 0 0 transparent !important;
    }
    .carousel-navigation-item:hover {
        cursor: pointer;
    }
</style>
