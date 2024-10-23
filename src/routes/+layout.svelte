<script>
	import Header from "./Header.svelte";
	import "../app.css";
</script>

<svelte:head>
	<link href="https://fonts.googleapis.com/css?family=Gelasio" rel="stylesheet">
</svelte:head>

<div class="app">
	<!-- <Header /> -->


	<header>
		<h3 class="text-center my-2">Football stadiums across Europe</h3>
        <img src="/images/logo.svg" width="100" alt="logo"/>
	</header>

	<main class="main">
		<slot />
	</main>

	<footer>
		<!-- <p>visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to learn SvelteKit</p> -->
		<br /><br />Footer<br /><br />
	</footer>
</div>

<style>
	@font-face {
        font-family: 'Gelasio';
        font-style: normal;
        font-weight: 400;
        src: local('Gelasio Regular'), local('Gelasio-Regular'), url(https://fonts.gstatic.com/s/gelasio/v1/cIf9MaFfvUQxTTqS9C6hYQ.woff2) format('woff2');
        unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
    }

    h1 {
        font-family: Gelasio
    }
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
