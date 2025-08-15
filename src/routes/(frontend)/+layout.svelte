<script>
    import { base } from "$app/paths";
    import { onMount } from "svelte";
    import { PUBLIC_APP_ENV } from '$env/static/public';
    import "../../app.css";
    import { supabase } from "@lib/supabase/supabaseClient";
    import { initGA } from "@lib/analytics.js";
    import Toasts from "@components/Toasts.svelte";

    let { children } = $props();
    let session = $state(null);
    const isDev = PUBLIC_APP_ENV === 'development';

    onMount(() => {
        try {
            supabase.auth.getSession().then(({ data }) => {
                // console.log('data: ', data);
                session = data.session;
            });

            supabase.auth.onAuthStateChange((_event, _session) => {
                session = _session;
            });
            initGA();
        } catch (error) {
            console.log("error: ", error);
        }
    });
</script>

<svelte:head>
    <link
        href="https://fonts.googleapis.com/css?family=Gelasio"
        rel="stylesheet"
    />
    <!-- Google tag (gtag.js) -->
    <script
        async
        src="https://www.googletagmanager.com/gtag/js?id=G-HPDK1Z6D0V"
    ></script>
</svelte:head>

<div class="app">
    <header>
        <div class="row justify-content-center">
            <div class="col-4 col-lg-6 col-md-8 col-sm-10 col-xs-12">
                <img
                    src="{base}/images/logo_with_text-min.svg"
                    width="100%"
                    alt="logo"
                    class="text-center"
                />
            </div>
        </div>
    </header>

    <main class="main">
        <div style="position: fixed; top: 20px; right: 20px;">
            <Toasts />
        </div>
        {@render children()}
        <footer></footer>
        <div
            class="row justify-content-center text-white"
            style="background: #325bad; padding-top: 5px;"
        >
            <div class="col-12">
                <!-- <nav class="text-center">
                    <a href="{base}/">Home</a> |
                    <a href="{base}/about/">About</a> |
                    <a href="{base}/auth/login">Login</a> |
                    <a href="{base}/auth/register">Register</a> |
                    <a href="{base}/auth/account">Account</a> |
                    <a href="{base}/upload-image">Upload image</a> |
                    <a href="{base}/admin">Admin</a>
                </nav> -->
            </div>
            <div class="col-12 my-2">
                <div class="text-center">
                    <a
                        href="mailto:info@eurostadium.net"
                        class=""
                        style="color: #ccc;">info@eurostadium.net</a
                    >
                    {#if isDev}
                    <a href="/auth/login" style="color: #ccc;">Login</a> |
                    <a href="/admin" style="color: #ccc;">Admin</a>
                    {/if}
                </div>
            </div>
        </div>
    </main>
</div>

<style>
    @font-face {
        font-family: "Gelasio";
        font-style: normal;
        font-weight: 400;
        src:
            local("Gelasio Regular"),
            local("Gelasio-Regular"),
            url(https://fonts.gstatic.com/s/gelasio/v1/cIf9MaFfvUQxTTqS9C6hYQ.woff2)
                format("woff2");
        unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6,
            U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193,
            U+2212, U+2215, U+FEFF, U+FFFD;
    }

    /* h1 {
        font-family: Gelasio;
    } */
    .app {
        min-height: 100vh;
        margin: 0;
        position: relative;
    }
    @media only screen and (max-width: 600px) {
        .main {
            min-height: 100vh;
            display: flex;
            flex-direction: column;
            background-image: url("/images/svg/background-stadiums-mobile-screen-min.svg");
        }
        footer {
            margin-top: auto;
            width: 100%;
            height: 200px;
            background-image: url("/images/svg/footer-mobile-screen-min.svg");
            background-repeat: no-repeat;
            background-position: center center;
            background-size: cover;
        }
    }
    @media only screen and (max-width: 1199px) {
        .main {
            min-height: 100vh;
            display: flex;
            flex-direction: column;
            background-image: url("/images/svg/background-stadiums-tablet-screen-min.svg");
        }
        footer {
            margin-top: auto;
            width: 100%;
            height: 200px;
            background-image: url("/images/svg/footer-tablet-screen-min.svg");
            background-repeat: no-repeat;
            background-position: center center;
            background-size: cover;
        }
    }
    @media only screen and (min-width: 1200px) {
        .main {
            min-height: 100vh;
            display: flex;
            flex-direction: column;
            background-image: url("/images/svg/background-stadiums-min.svg");
        }
        footer {
            margin-top: auto;
            width: 100%;
            height: 200px;
            background-image: url("/images/svg/footer-min.svg");
            background-repeat: no-repeat;
            background-position: center center;
            background-size: cover;
        }
    }
</style>
