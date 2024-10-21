<script>
	import Header from "./Header.svelte";
	import "../app.css";
</script>

<div class="app">
	<!-- <Header /> -->

	<main>
		<slot />
	</main>

	<footer>
		<!-- <p>visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to learn SvelteKit</p> -->
	</footer>
</div>

<style>
	@media only screen and (max-width: 600px) {
		.app {
			background-image: url("/images/background-stadiums-mobile-screen.svg");
		}
	}
	@media only screen and (max-width: 1199px) {
		.app {
			background-image: url("/images/background-stadiums-tablet-screen.svg");
		}
	}
	@media only screen and (min-width: 1200px) {
		.app {
			background-image: url("/images/background-stadiums.svg");
		}
	}
	/* .app {
		display: flex;
		flex-direction: column;
		min-height: 100vh;
	}

	main {
		flex: 1;
		display: flex;
		flex-direction: column;
		padding: 1rem;
		width: 100%;
		max-width: 64rem;
		margin: 0 auto;
		box-sizing: border-box;
	}

	footer {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		padding: 12px;
	}

	footer a {
		font-weight: bold;
	}

	@media (min-width: 480px) {
		footer {
			padding: 12px 0;
		}
	} */
</style>
