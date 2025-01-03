<script>
    import { onMount } from "svelte";
    import { base } from "$app/paths";
    import { dev } from "$app/environment";
    import Counter from "../Counter.svelte";
    import Tooltip from "../Tooltip.svelte";
    import TooltipCountry from "@lib/components/TooltipCountry.svelte";
    import TooltipStadium from "@lib/components/TooltipStadium.svelte";
    import Modal from "@components/Modal.svelte";
    import Circle from "../Circle.svelte";
    import Rectangle from "../Rectangle.svelte";
    import Europe from "@components/svg/Europe.svelte";
    import Germany from "@components/svg/Germany.svelte";
    import welcome from "$lib/images/svelte-welcome.webp";
    import welcome_fallback from "$lib/images/svelte-welcome.png";
    import { db } from "@lib/firebase/firebase";
    import { supabase } from "@lib/supabase/supabaseClient";
    import {
        collection,
        query,
        where,
        doc,
        getDocs,
        addDoc,
        updateDoc,
        deleteDoc,
    } from "firebase/firestore";
    import { counter } from "@store/count";
    import { countryStore } from "@store/country";
    import { leagueStore } from "@store/league";
    import { stadiumStore } from "@store/stadium";
    import { addToast } from "@store/toast";
    import camelize from "@utils/convertToCamelCase";
    import Carousel from "@components/Carousel.svelte";
    import FilterButtons from "@components/FilterButtons.svelte";

    // const dispatch = createEventDispatcher();
    // let { clickOutsideCountry } = $props();

    // let { supabase, session } = $props()

    let map = "europe-with-russia.svg";
    let countryLeagues = $state([]);
    let country = $state({
        slug: "",
        name: "",
        population: 0,
        leagues: [],
    });
    // let stadiums = [];
    // $: stadiums = [];
    let stadiums = $state([]);
    let selectedStadium = $state(null);
    let teams = [];
    let stadiums2 = [];
    // $:stadiums = [];
    let left = $state(0);
    let top = $state(0);
    // $: countryLeagues = []
    let showCountryTooltip = $state(false);
    let showStadiumTooltip = $state(false);
    let showFilterButtons = $state(false);
    let showComponent = $state(false);
    let filterValue = $state("all");
    let svgMap;
    let showModal = $state(false);
    let myElement;
    let tooltipCountryWidth = $state(0);
    let tooltipStadiumWidth = $state(0);
    let mouseOverTooltip = $state(false);
    let isMobileDevice = $state(false);
    // let session = $state(null)
    let CurrentComponent = $state(Europe);

    onMount(async () => {
        if (hasTouchSupport() && hasSmallScreen()) {
            console.log("Mobile device detected");
        } else {
            console.log("Desktop device detected");
        }
        if ($leagueStore.leagues.length < 2) {
            await leagueStore.fetchLeagues();
        }
        // console.log("$leagueStore.leagues: ", $leagueStore.leagues);
        // if (hasSmallScreen() && hasTouchSupport()) {
        if (hasSmallScreen()) {
            isMobileDevice = true;
        }
        showComponent = true;

        // supabase.auth.getSession().then(({ data }) => {
        //     session = data.session
        // })

        // supabase.auth.onAuthStateChange((_event, _session) => {
        //     session = _session
        // })

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
        // return
        // let myComponent
        // console.log('myComponent: ', myComponent);
        // const module = await import (`./${componentName}.svelte`);
        const module = await import(`@components/svg/${map}.svelte`);
        // const module = await import ('./Circle.svelte');
        // console.log('module: ', module)
        // console.log('module.default: ', module.default);
        // return
        // currentComponent = module.default;
        CurrentComponent = module.default;
        showStadiumTooltip = false;
    };

    const displayMap = async (map) => {
        if (map?.toLowerCase() == "europe") {
            showFilterButtons = false;
        }
        loadComponent(map);
    };

    const showNotification = () => {
        console.log("showNotification");
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

    const countryHover = (event) => {
        // console.log("countryHover: ", event);
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
        console.log("countryClick event: ", event);
        // return
        let countrySlug = event;

        if (countrySlug == "europe") {
            displayMap("Europe");
            return;
        }
        // switch (event) {
        //     case 'andorra':
        //         countrySlug = 'spain'
        //         break;
        //     case 'monaco':
        //         countrySlug = 'france'
        //         break;
        //     case 'liechtenstein':
        //         countrySlug = 'switzerland'
        //         break;
        //     default:
        //         countrySlug = event
        // }
        // const countrySlug = event
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
        console.log("stadiumHover: ", event);
        // return

        const { stadiumId, clientX, clientY, rect } = event;
        // const stadiumId = event.detail;
        // stadiums = $stadiumStore.stadiumsByCountry[country.slug]?.filter(
        //     (team) => team.id == stadiumId,
        // );
        console.log("stadiums: ", stadiums);
        const abc = stadiums.find((el) => el.stadium.id == stadiumId);
        console.log("abc: ", abc);
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
    const onModalOpen = () => {
        showModal = true;
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

    const fetchImageUploads = async () => {
        const abc = await supabase.from("image_uploads").select(`*`);
        console.log("abc: ", abc);
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

    const clickOutsideCountry = () => {
        displayMap("Europe");
        // showFilterButtons = false
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
        <a href="{base}/about">About page</a>&nbsp;|&nbsp;<a
            href="{base}/upload-image">Upload image</a
        >&nbsp;|&nbsp;
        <a href="{base}/auth/login">Login</a>&nbsp;|&nbsp;
        <a href="{base}/auth/register">Register</a>&nbsp;|&nbsp;
        <a href="{base}/auth/account">Account</a>&nbsp;|&nbsp;
        <a href="{base}/admin">Admin</a>
        <br /><br />
        <button onclick={() => (showModal = true)}>Show modal</button>
        {#if showModal}
            <Modal
                bind:showModal
                data={selectedStadium}
                countrySlug={country.slug}
            >
                {#snippet header()}{/snippet}
            </Modal>
        {/if}
        <br /><br />
        <button
            onclick={() =>
                addToast({
                    message: "Ceci est un message",
                    type: "success",
                    dismissible: true,
                    timeout: 3000,
                })}>Show notification</button
        ><br />

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
        leaguesStore.leagues.length: {$leagueStore.leagues.length}<br />
        <!-- selectedStadium: {selectedStadium}<br /> -->
        filterValue: {filterValue}<br />
        <!-- currentComponent: {currentComponent}<br /> -->
        stadiums.length: {stadiums.length}<br />
        showStadiumTooltip: {showStadiumTooltip}<br />

        <button onclick={() => stadiumStore.toggleLoading()}
            >Toggle loading</button
        ><br /><br />
        <div style="">
            <button onclick={decreaseCount}>decrease</button>
            <!-- <span style="padding: 0 10px">$countStore: {$countStore.value}</span> -->
            <span style="padding: 0 10px">$counter: {$counter}</span>
            <button onclick={increaseCount}>increase</button>
            <!-- <button on:click={updateState}>update state</button> -->
        </div>
        <br />
        <div>
            <!-- <button on:click={() => toggleMap}>Toggle map</button><br /> -->
            <div style="display: flex; gap: 5px; justify-content: center;">
                <button onclick={() => displayMap("Europe")}>Europe</button><br
                />
                <button onclick={() => displayMap("Germany")}>Germany</button
                ><br />
                <button onclick={() => displayMap("France")}>France</button><br
                />
                <button onclick={() => displayMap("Switzerland")}
                    >Switzerland</button
                ><br />
                <button onclick={() => displayMap("Test")}>Test</button><br />
            </div>
            <br />
            <!-- <button on:click={() => loadComponent()}>Load component</button><br /> -->
            <!-- <Circle /> -->

            <div style="display: flex; gap: 5px; justify-content: center;">
                <button onclick={() => fetchLeagues()}>Fetch leagues</button>
                <br />
                <button onclick={() => fetchLeagueByApiFootballId()}
                    >Fetch league</button
                >
                <br />
                <button onclick={() => updateLeague()}>Update league</button>
                <br />
                <button onclick={() => setLeagues()}>Set leagues</button>
                <br />
                <button onclick={() => deleteLeague()}>Delete league</button>
                <br />
                <button onclick={() => fetchCountries()}
                    >Fetch country data</button
                >
            </div>
            <br />
            <button onclick={() => fetchImageUploads()}
                >Fetch image uploads</button
            >

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
        <p class="my-1"><i>Hover over any stadium to display images</i></p>
    {:else}
        <p class="my-1"><i>Click on any country to load its map</i></p>
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
        class="col-sm-1 col-md-4 col-lg-3 col-xl-3 border-1 hidden-sm-and-down"
        style=""
    ></div>
    <div
        class="col-sm-10 col-md-4 col-lg-6 col-xl-6 border-2"
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
            <!-- <TooltipStadium
                data={selectedStadium}
                countrySlug={country.slug}
                {left}
                {top}
                bind:tooltipWidth={tooltipStadiumWidth}
                on:tooltipHover={onTooltipStadiumHover}
                on:tooltipLeave={onTooltipLeave}
                on:tooltipClose={onTooltipClose}
                on:modalOpen={onModalOpen}
            /> -->
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

        <!-- {#if showComponent} -->
        <!-- <Rectangle />  -->
        <!-- <Europe filter={filterValue} {country} stadiums3={stadiums} /> -->
        <!-- {/if} -->
        <!-- stadiums: {stadiums.length}<br /> -->
        <div id="svgWrapper" bind:this={svgMap} style="border: 1px solid red;">
            <!-- <svelte:component
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
            /> -->
            <!-- <svelte:component
                this={currentComponent}
                filter={filterValue}
                countryObj={country}
                stadiumsArray={stadiums}
                {countryHover}
                {countryLeave}
                {countryClick}
                {stadiumHover}
                {stadiumLeave}
                {clickOutsideCountry}
            /> -->
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
        class="col-sm-1 col-md-4 col-lg-3 col-xl-3 justify-center align-content border-3 d-xs-none hidden-sm-and-down"
    >
        {#if showFilterButtons}
            <!-- <FilterButtons
                {country}
                on:updateFilter={onUpdateFilter}
                on:updateStadiums={onUpdateStadiums}
            /> -->
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
            <FilterButtons {country} {updateFilter} {updateStadiums} />
        {/if}
    </div>
</div>

<div class="row">
    <!-- <br /><br /><br /><br />
    <br /><br /><br /><br />
    <br /><br /><br /><br />
    <br /><br /><br /><br /> -->
    <!-- <div class="col-6">
        {#if !session}
            <Login />
        {:else}
            <Account {session} />
        {/if}
    </div>
    <div class="col-6">
        <Register />
    </div> -->
</div>

<style>
    :global(svg) {
        /* max-width: 512px; */
        display: block;
    }
</style>
