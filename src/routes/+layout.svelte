<script>
	import Header from "./Header.svelte";
	import "../app.css";
</script>

<div class="app">
	<!-- <Header /> -->

	<main class="main">
		<slot />
	</main>

	<footer>
		<!-- <p>visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to learn SvelteKit</p> -->
		<br /><br />Footer<br /><br />
	</footer>
</div>

<style>
	.app {
		min-height: 100vh;
		margin: 0;
		position: relative;
	}
	@media only screen and (max-width: 600px) {
		.main {
			background-image: url("/images/background-stadiums-mobile-screen.svg");
		}
	}
	@media only screen and (max-width: 1199px) {
		.main {
			background-image: url("/images/background-stadiums-tablet-screen.svg");
		}
	}
	@media only screen and (min-width: 1200px) {
		.main {
			background-image: url("/images/background-stadiums.svg");
		}
	}
	footer {
		position: absolute;
		bottom: 0;
		width: 100%;
		height: 200px;
		border: 1px solid red;
		background-image: url("/images/footer.svg");
		background-size: cover;
		background-repeat: no-repeat;
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
