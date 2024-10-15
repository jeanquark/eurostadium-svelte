<script>
	import { base } from "$app/paths";
	import { leagueStore } from "../../store/league.js";
</script>

<svelte:head>
	<title>About</title>
	<meta name="description" content="About" />
</svelte:head>

<div class="row">
	<div class="col-12 text-center">
		<h2 class="text-center">About page</h2>
		<br />
		<a href="{base}/">Home page</a>
		<br />
		<br />
	</div>
</div>
<div class="row border-3">
	<div class="col-4 border-1">col-4</div>
	<div class="col-4">col-4</div>
	<div class="col-4">col-4</div>
</div>

<!-- <div class="text-column">
	<h1>About this app</h1>
	<a href="/">&larr;Home</a>
	$leagueStore.leagues.length: {$leagueStore.leagues?.length}<br /><br />


	<p>
		This is a <a href="https://kit.svelte.dev">SvelteKit</a> app. You can make your own by typing the
		following into your command line and following the prompts:
	</p>

	<pre>npm create svelte@latest</pre>

	<p>
		The page you're looking at is purely static HTML, with no client-side interactivity needed.
		Because of that, we don't need to load any JavaScript. Try viewing the page's source, or opening
		the devtools network panel and reloading.
	</p>

	<p>
		The <a href="/sverdle">Sverdle</a> page illustrates SvelteKit's data loading and form handling. Try
		using it with JavaScript disabled!
	</p>
</div> -->
