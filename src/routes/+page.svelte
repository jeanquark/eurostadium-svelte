<script>
	import Counter from "./Counter.svelte";
	import Tooltip from "./Tooltip.svelte";
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
	import { countStore, countHandlers } from "../store/count";

	let map = "europe-with-russia.svg";

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
		const array = []
		querySnapshot.forEach((doc) => {
			// doc.data() is never undefined for query doc snapshots
			// console.log(doc.id, " => ", doc.data());
			array.push(doc.data())
		});
		// console.log('array: ', array)
		$leagueStore.leagues = array
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
		// console.log("onCountryHover dataLeaguesId: ", event.detail);
		const leagueIds = event.detail?.split(",");
		if (!leagueIds?.length) {
			return;
		}
		// console.log("abc: ", abc);
		const countryLeagues = []
		for (let i = 0; i < leagueIds.length; i++) {
			console.log('leagueIds[i]: ', leagueIds[i])
			// fetchLeagueByApiFootballId(parseInt(leagues[i]))
			const abc = $leagueStore.leagues.find((league) => league.api_football_id == leagueIds[i])
			if (abc) {
				countryLeagues.push(abc)
			}
		}
		console.log('countryLeagues: ', countryLeagues);
	};
	
	// Store
	// $: leagues = [];
	// leagueStore.subscribe((curr) => {
	// 	leagues = curr.data;
	// });
	const increaseCount = () => {
		$countStore.value += 1;
	};
	const decreaseCount = () => {
		// countHandlers.setCount(2)
		$countStore.value -= 1;
	};
</script>

<svelte:head>
	<title>Home</title>
	<meta name="description" content="Svelte demo app" />
</svelte:head>

<section>
	<Tooltip title="This is a greeting"><h2>eurostadium</h2></Tooltip>
	<br />
	<a href="/about">About</a>
	<br />
	$leagueStore.leagues.length: {$leagueStore.leagues?.length}<br /><br />
	<!-- $leagueStore.data.length: {$leagueStore.data.length}<br /><br /> -->
	<div style="display: flex">
		<button on:click={decreaseCount}>decrease</button>
		<span style="padding: 0 10px">{$countStore.value}</span>
		<button on:click={increaseCount}>increase</button>
	</div>
	<div>
		<!-- <button on:click={() => toggleMap}>Toggle map</button><br /> -->
		<div style="display: flex; gap: 5px; justify-content: center;">
			<button on:click={() => displayMap("Europe")}>Europe</button><br />
			<button on:click={() => displayMap("Germany")}>Germany</button><br
			/>
			<button on:click={() => displayMap("France")}>France</button><br />
			<button on:click={() => displayMap("Switzerland")}
				>Switzerland</button
			><br />
			<button on:click={() => displayMap("Test")}>Test</button><br />
		</div>
		<!-- <button on:click={() => loadComponent()}>Load component</button><br /> -->
		<!-- <Circle /> -->
		<div style="border: 1px solid red;">
			<svelte:component
				this={currentComponent}
				on:countryHover={onCountryHover}
			/>
			<!-- <img src="/images/europe-with-russia.svg" width="200" alt="europe map" /> -->
		</div>

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

	<!-- <Counter /> -->
</section>

<style>
	section {
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
	}
</style>
