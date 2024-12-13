<script>
    import { onMount } from "svelte";
    import { base } from "$app/paths";
    import { supabase } from "@lib/supabase/supabaseClient";
    import Account from "@components/auth/Account.svelte";
    import { goto } from "$app/navigation";

    let session = $state(null);

    onMount(async () => {
        console.log("[onMount] Account page");

        supabase.auth.onAuthStateChange((_event, _session) => {
            session = _session;
            console.log("[onAuthStateChange] session: ", session);
            console.log("session: ", session);
            if (!session) {
                goto("/auth/login");
            }
        });
    });
</script>

<div class="">
    <a href="{base}/">Home page</a>&nbsp;|&nbsp;
    <a href="{base}/auth/login">Login</a>&nbsp;|&nbsp;
    <a href="{base}/auth/register">Register</a><br />
    <button onclick={() => goto("/")}>Home</button>
    <!-- <Account {supabase} {session} /> -->
    <Account {session} />
</div>

<style>
</style>
