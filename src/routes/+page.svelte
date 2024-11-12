<script>
    import { createEventDispatcher, onMount } from "svelte";
    import { base } from "$app/paths";
    import { dev } from "$app/environment";
    import Counter from "./Counter.svelte";
    import Tooltip from "./Tooltip.svelte";
    import TooltipCountry from "./TooltipCountry.svelte";
    import TooltipStadium from "./TooltipStadium.svelte";
    import Modal from "./components/Modal.svelte";
    import Circle from "./Circle.svelte";
    import Rectangle from "./Rectangle.svelte";
    import Europe from "./components/svg/Europe.svelte";
    import Germany from "./components/svg/Germany.svelte";
    import welcome from "$lib/images/svelte-welcome.webp";
    import welcome_fallback from "$lib/images/svelte-welcome.png";
    import { db } from "../lib/firebase/firebase";
    import { supabase } from "../lib/supabase/supabaseClient";
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
    import { countryStore } from "../store/country";
    import { leagueStore } from "../store/league";
    import { stadiumStore } from "../store/stadium";
    import camelize from "../utils/convertToCamelCase";
    import Carousel from "./components/Carousel.svelte";
    import FilterButtons from "./components/FilterButtons.svelte";
    import Account from "./auth/Account.svelte";
    import Login from "./auth/Login.svelte";
    import Register from "./auth/Register.svelte";

    const dispatch = createEventDispatcher();

    let map = "europe-with-russia.svg";
    let countryLeagues = [];
    let country = {
        slug: "",
        name: "",
        population: 0,
        leagues: [],
    };
    $: country2 = {};
    // let stadiums = [];
    $: stadiums = [];
    let selectedStadium = {};
    let teams = [];
    let stadiums2 = [];
    // $:stadiums = [];
    let left = 0;
    let top = 0;
    // $: countryLeagues = []
    let showCountryTooltip = false;
    let showStadiumTooltip = false;
    let showFilterButtons = false;
    let showComponent = false;
    let filterValue = "all";
    let svgMap;
    let showModal = false;
    let myElement;
    let tooltipCountryWidth = 0;
    let tooltipStadiumWidth = 0;
    let mouseOverTooltip = false;
    let isMobileDevice = false;
    let session = null;

    onMount(async () => {
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
        showComponent = true;

        supabase.auth.getSession().then(({ data }) => {
            session = data.session;
        });

        supabase.auth.onAuthStateChange((_event, _session) => {
            session = _session;
        });

        // fetchStadiumsByCountrySlug('switzerland');

        // const { data, error } = await supabase.storage
        //     .from("stadiums")
        //     .list("switzerland", {
        //         limit: 100,
        //         offset: 0,
        //         sortBy: { column: "name", order: "asc" },
        //     });

        // const { data, error } = supabase.storage
        //     .from("stadiums")
        //     .getPublicUrl("switzerland/10500_001.jpg");

        // if (error) {
        //     console.log("error: ", error);
        // }
        // console.log("data: ", data);
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
        // console.log('module: ', module)
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

    const fetchCountries = async () => {
        try {
            await countryStore.fetchCountries();
        } catch (error) {
            console.log("error: ", error);
        }
    };

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
    const fetchStadiumsByCountrySlug = async (countrySlug) => {
        await stadiumStore.fetchStadiumsByCountrySlug(countrySlug);
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
        // console.log("onCountryHover: ", event.detail);
        // return
        // console.clear();
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
            // console.log("abc: ", abc);
            if (abc) {
                countryLeagues.push(abc);
            }
        }

        // console.log('countryStore.countries: ', countryStore.countries);
        // const abc2 = countryStore.countries?.find(
        //     (country) => (country.name = event.detail.countryName),
        // );
        // console.log("abc2: ", abc2);
        // console.log('countryLeagues: ', countryLeagues);
        country = {
            slug: event.detail.id,
            name: event.detail.countryName,
            population: event.detail.population,
            leagues: countryLeagues,
        };
    };
    const onCountryClick = async (event) => {
        const countrySlug = event.detail;
        console.log("onCountryClick countrySlug: ", countrySlug);
        // return
        if (isMobileDevice) {
            console.log("isMobileDevice");
            // displayMap(camelize(country));
            // return
        }
        showCountryTooltip = false;

        // await fetchStadiumsByCountrySlug('switzerland');
        // await stadiumStore.fetchStadiumsByCountrySlug(countrySlug);

        const stadiumsByCountry = $stadiumStore.stadiumsByCountry[countrySlug];

        // console.log('stadiumsByCountry: ', stadiumsByCountry)
        // console.log('stadiumStore.stadiumsByCountry: ', $stadiumStore.stadiumsByCountry)
        if (!$stadiumStore.stadiumsByCountry[countrySlug]) {
            // const querySnapshot = await getDocs(collection(db, `countries/${country}/stadiums`));
            await stadiumStore.fetchStadiumsByCountrySlug(countrySlug);

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

        stadiums = $stadiumStore.stadiumsByCountry[countrySlug];
        // console.log('stadiums: ', stadiums)
        // return
        // const abc = $stadiumStore.stadiums;
        // console.log("abc: ", abc);
        // return
        // const def = camelize(countrySlug);
        // console.log("def: ", def);
        // return
        displayMap(camelize(countrySlug));
        filterValue = "all";
        showFilterButtons = true;
    };
    const onCountryLeave = () => {
        // console.log("onCountryLeave");
        showCountryTooltip = false;
    };

    const onStadiumHover = (event) => {
        console.log("onStadiumHover: ", event.detail);
        // return

        const { stadiumId, clientX, clientY, rect } = event.detail;
        // const stadiumId = event.detail;
        // stadiums = $stadiumStore.stadiumsByCountry[country.slug]?.filter(
        //     (team) => team.id == stadiumId,
        // );
        console.log("stadiums: ", stadiums);
        selectedStadium = stadiums.find((el) => el.stadium.id == stadiumId);

        console.log("selectedStadium: ", selectedStadium);
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
    const onUpdateFilter = (value) => {
        console.log("onUpdateFilter: ", value.detail);
        filterValue = value.detail;
        // stadiums = value.detail
        // dispatch('updateFilter', value.detail)
    };
    const onUpdateStadiums = (value) => {
        console.log("onUpdateStadiums: ", value.detail);
        stadiums = value.detail;
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
    // const fetchCountry = async () => {
    //     const country = 'germany'
    //     return
    //     const response = await fetch(`/json/countries/${country}.json`)
    //     const json = await response.json()

    //     const abc = json.length
    //     console.log('abc: ', abc)

    //     for (let i = 0; i < json.length; i++) {
    //         await addDoc(collection(db, `countries/${country}/stadiums`), json[i])
    //     }
    // }

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
    <title>Eurostadium - Home</title>
    <meta name="description" content="Football stadiums across Europe" />
</svelte:head>

<div class="row">
    <div class="col-xs-12"></div>
</div>

<!-- <div class="row">
    <div class="col-xs-12 col-sm-4 col-md-3 col-lg-2 col-xl-1 border-1">
        col-xl-2
    </div>
    <div class="col-xs-12 col-sm-4 col-md-6 col-lg-8 col-xl-10 border-2">
        col-xl-8
    </div>
    <div class="col-xs-12 col-sm-4 col-md-3 col-lg-2 col-xl-1 border-3">
        col-xl-2
    </div>
</div> -->
<!-- <div class="row">
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
</div> -->
<div class="row" style="justify-content: center;">
    <div class="col-12 text-center" style="overflow: auto;">
        <!-- </div> -->
        <br />
        <a href="{base}/about">About page</a>
        <br /><br />
        <button on:click={() => (showModal = true)}>Show modal</button>
        <Modal bind:showModal bind:stadiums bind:country>
            <!-- <h2 slot="header">modal</h2> -->
            <!-- This is the modal content<br /> -->
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
                        {stadiums[0]?.stadium?.capacity}
                    </h3>
                </div>
            </div>
        </Modal>
        <br /><br />
        <!-- $leagueStore.leagues.length: {$leagueStore.leagues?.length}<br /><br /> -->
        <!-- countryLeagues.length: {countryLeagues.length}<br /><br /> -->
        <!-- $leagueStore.data.length: {$leagueStore.data.length}<br /><br /> -->
        <!-- dev: {dev}<br /> -->
        showModal: {showModal}<br />
        isMobileDevice: {isMobileDevice}<br />
        country.slug: {country.slug}<br />
        <!-- left: {left}<br /> -->
        <!-- tooltipStadiumWidth: {tooltipStadiumWidth}<br /> -->
        <!-- tooltipCountryWidth: {tooltipCountryWidth}<br /> -->
        <!-- countryStore.countries: {countryStore.countries?.length}<br /> -->
        $stadiumStore.loading: {$stadiumStore.loading}<br />
        $stadiumStore.stadiumsByCountry: {$stadiumStore.stadiumsByCountry}<br />
        <!-- $stadiumStore.stadiumsByCountry[0]: {$stadiumStore.stadiumsByCountry[0]}<br /> -->
        $stadiumStore.stadiumsByCountry[switzerland].length: {$stadiumStore
            .stadiumsByCountry["switzerland"]?.length}<br />
        stadiums.length: {stadiums.length}<br />
        <!-- selectedStadium: {selectedStadium}<br /> -->
        filterValue: {filterValue}<br />
        <button on:click={() => stadiumStore.toggleLoading()}
            >Toggle loading</button
        ><br /><br />
        <div style="">
            <button on:click={decreaseCount}>decrease</button>
            <!-- <span style="padding: 0 10px">$countStore: {$countStore.value}</span> -->
            <span style="padding: 0 10px">$counter: {$counter}</span>
            <button on:click={increaseCount}>increase</button>
            <!-- <button on:click={updateState}>update state</button> -->
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

<div class="row justify-content-center">
    {#if showFilterButtons}
        <p class="my-1"><i>Hover over any stadium to display images..</i></p>
    {:else}
        <p class="my-1"><i>Click on any country to load its map..</i></p>
    {/if}
</div>

<div class="row justify-content-center">
    <div class="col-4">
        <!-- <Rectangle /> -->
    </div>
</div>

<div
    class="row my-0 py-0 border-4 justify-content-center"
    style="position: relative;"
>
    <div
        class="col-sm-1 col-md-4 col-lg-3 col-xl-4 border-1 hidden-sm-and-down"
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
                data={selectedStadium}
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

        <!-- {#if showComponent} -->
        <!-- <Rectangle />  -->
        <!-- <Europe filter={filterValue} {country} stadiums3={stadiums} /> -->
        <!-- {/if} -->
        <div id="svgWrapper" bind:this={svgMap} style="border: 1px solid red;">
            <svelte:component
                this={currentComponent}
                filter={filterValue}
                countryObj={country}
                stadiumsArray={stadiums}
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
        class="col-sm-1 col-md-4 col-lg-3 col-xl-4 justify-center align-content border-3 d-xs-none hidden-sm-and-down"
    >
        {#if showFilterButtons}
            <FilterButtons
                {country}
                on:updateFilter={onUpdateFilter}
                on:updateStadiums={onUpdateStadiums}
            />
        {/if}
    </div>
</div>

<div class="row hidden-md-and-up">
    <div class="col-12 py-2">
        {#if showFilterButtons}
            <FilterButtons />
        {/if}
    </div>
</div>

<div class="row">
    <!-- <br /><br /><br /><br />
    <br /><br /><br /><br />
    <br /><br /><br /><br />
    <br /><br /><br /><br /> -->
    <div class="col-6">
        {#if !session}
            <Login />
        {:else}
            <Account {session} />
        {/if}
    </div>
    <div class="col-6">
        <Register />
    </div>
</div>

<style>
    :global(svg) {
        /* max-width: 512px; */
        display: block;
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

    .carousel-navigation-item:hover {
        cursor: pointer;
    }
</style>
