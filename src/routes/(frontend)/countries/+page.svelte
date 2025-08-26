<script>
	import { base } from "$app/paths";
	import { leagueStore } from "@store/league.js";
</script>

<svelte:head>
	<title>Countries</title>
	<meta name="description" content="Countries" />
</svelte:head>

<div class="row">
	<div class="col-12 text-center">
		<h2 class="text-center">Countries page</h2>
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

