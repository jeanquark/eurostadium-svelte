<script>
    import { onMount } from "svelte";
    import { jwtDecode } from "jwt-decode";
    import { goto } from "$app/navigation";
    import { base } from "$app/paths";
    import { supabase } from "@lib/supabase/supabaseClient";
    import "../../app.css";
    import Toasts from "@components/Toasts.svelte";
    import { addToast } from "@store/toast";
    import { page } from "$app/stores";

    let { children } = $props();

    onMount(() => {
        supabase.auth.onAuthStateChange((_event, _session) => {
            console.log("[onAuthStateChange] session: ", _session);
            if (!_session) {
                addToast({
                    message: "You are not authenticated.",
                    type: "error",
                    dismissible: false,
                    timeout: 3000,
                });
                // goto("/auth/login");
                return;
            }
            const jwt = jwtDecode(_session?.access_token);
            // console.log("jwt: ", jwt);
            const userRole = jwt.user_role;
            console.log("userRole: ", userRole);
            if (userRole != "admin") {
                addToast({
                    message: "You are not authenticated as an admin.",
                    type: "warning",
                    dismissible: false,
                    timeout: 3000,
                });
                // goto("/");
            }
        });
    });
</script>

<svelte:head>
    <title>Eurostadium - Admin</title>
    <meta name="robots" content="noindex" />
    <link
        href="https://fonts.googleapis.com/css?family=Gelasio"
        rel="stylesheet"
    />
</svelte:head>

<div class="app">
    <main class="main">
        <div style="position: fixed; top: 20px; right: 20px;">
            <Toasts />
        </div>
        <div class="row">
            <div class="col-2" style="border: 2px solid orange;">
                <ul>
                    <li><a href="{base}/admin">Admin</a></li>
                    <li><a href="{base}/admin/users">Users</a></li>
                    <li><a href="{base}/admin/countries">Countries</a></li>
                    <li><a href="{base}/admin/leagues">Leagues</a></li>
                    <li><a href="{base}/admin/teams">Teams</a></li>
                    <li><a href="{base}/admin/stadiums">Stadiums</a></li>
                    <li><a href="{base}/admin/images">Images</a></li>
                    <li><a href="{base}/">Home</a></li>
                </ul>
            </div>
            <div class="col-10" style="border: 2px solid orangered;">
                $page.path: {$page.url.pathname}<br />
                {@render children()}
            </div>
        </div>
    </main>
</div>

<style>
    ul {
        list-style-type: none;
        padding: 20px 20px;
    }

    li a {
        display: block;
        text-decoration: none;
        padding: 10px 0;
    }
    li a:hover {
        color: yellow;
    }
</style>
