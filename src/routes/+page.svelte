<script>
	import Counter from "./Counter.svelte";
	import Tooltip from "./Tooltip.svelte";
	import TooltipCountry from "./TooltipCountry.svelte";
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
		doc,
		getDoc,
		getDocs,
		addDoc,
		setDoc,
		updateDoc,
		deleteDoc,
	} from "firebase/firestore";
	import { leagueStore, leagueHandlers } from "../store/league.js";
	import { counter } from "../store/count";
	import { stadiumStore } from "../store/stadium";

	let map = "europe-with-russia.svg";
	let countryLeagues = [];
	let left = 0;
	let top = 0;
	// $: countryLeagues = []

	const toggleMap = () => {
		console.clear();
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
	const onCountryClick = async (event) => {
		console.log("onCountryClick country: ", event.detail);
		// const querySnapshot = await getDocs(collection(db, "countries/germany/stadiums"));
		// console.log('querySnapshot: ', querySnapshot);
		// const array = [];
		// querySnapshot.forEach((doc) => {
		// 	array.push(doc.data());
		// });
		// console.log('array: ', array)
		// $stadiumStore = [...$stadiumStore, {
		// 	germany: [
		// 		{
		// 			id: 1,
		// 			city: 'Berlin'
		// 		},
		// 		{
		// 			id: 2,
		// 			city: 'Munich'
		// 		}
		// 	]
		// }];
		const abc = $stadiumStore
		console.log('abc: ', abc);
		stadiumStore.setStadium({
			germany: [
				{
					id: 1,
					city: "Berlin",
				},
				{
					id: 2,
					city: "Munich",
				},
			],
			france: [
				{
					id: 1,
					city: 'Paris'
				},
				{
					id: 2,
					city: 'Marseille'
				}
			]
		});
		console.log("stadiumStore: ", $stadiumStore);
		return;
		displayMap(event.detail);
	};
	const onCountryHover = (event) => {
		// return
		console.log("onCountryHover: ", event.detail);
		// const leagueIds = event.detail?.split(",");
		const { leagueIds, clientX, rect } = event.detail;
		console.log("leagueIds: ", leagueIds);
		const offsetWidth = document.getElementById("svgWrapper").offsetWidth;
		console.log("offsetWidth: ", offsetWidth);
		const tooltip = document.getElementById("tooltip");
		const tooltipRect = tooltip.getBoundingClientRect();
		// let left = 0

		if (clientX > offsetWidth / 2) {
			// tooltip.style.left = `${rect.x - 410 - rect.width}px`
			// tooltip.style.left = `${rect.x - rect.width - parseInt(tooltipRect.width)}px`
			left = parseInt(`${rect.x - 200}px`);
			// tooltip.style.left = offsetLeft + (clientX - parseInt(tooltipRect.width)) - 20 + 'px'
		} else {
			left = parseInt(`${rect.x + rect.width}px`);
		}
		console.log("left: ", left);

		// const leagueIds = data.leagueIds
		if (!leagueIds?.length) {
			return;
		}
		countryLeagues = [];
		// console.log("abc: ", abc);
		for (let i = 0; i < leagueIds.length; i++) {
			// console.log('leagueIds[i]: ', leagueIds[i])
			// fetchLeagueByApiFootballId(parseInt(leagues[i]))
			const abc = $leagueStore.leagues.find(
				(league) => league.api_football_id == parseInt(leagueIds[i]),
			);
			if (abc) {
				countryLeagues.push(abc);
			}
		}
		// console.log('countryLeagues: ', countryLeagues);
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
</script>

<svelte:head>
	<title>Home</title>
	<meta name="description" content="Svelte demo app" />
</svelte:head>

<div class="row border-4">
	<div class="col-4 border-1">col-4</div>
	<div class="col-4 border-2">col-4</div>
	<div class="col-4 border-3">col-4</div>
</div>
<div class="row" style="justify-content: center;">
	<div class="col-12 text-center">
		<!-- <section> -->
		<Tooltip title="This is a greeting"><h2>eurostadium</h2></Tooltip>
		<div id="tooltip">
			<!-- <TooltipCountry data={countryLeagues} {left} {top} /> -->
		</div>
		<br />
		<a href="/about">About page</a>
		<br /><br />
		<!-- $leagueStore.leagues.length: {$leagueStore.leagues?.length}<br /><br /> -->
		<!-- countryLeagues.length: {countryLeagues.length}<br /><br /> -->
		<!-- $leagueStore.data.length: {$leagueStore.data.length}<br /><br /> -->
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

<div class="row my-2">
	<div class="col-4"></div>
	<div class="col-4">
		<div id="svgWrapper" style="border: 1px solid red;">
			<svelte:component
				this={currentComponent}
				on:countryHover={onCountryHover}
				on:countryClick={onCountryClick}
				on:clickOutsideCountry={() => displayMap("Europe")}
			/>
		</div>
	</div>
	<div class="col-4"></div>
</div>

<br /><br /><br /><br />

<style>
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
</style>
