<script>
    import { onMount } from "svelte";
    import { base } from "$app/paths";
    // import { supabase } from "@lib/supabase/supabaseClient";
    import Account from "@components/auth/Account.svelte";
    // let session = null;

	let { data } = $props()
    let { supabase, session } = data


    onMount(async () => {
        console.log('[onMount] Account page')
        // supabase.auth.getSession().then(({ data }) => {
        //     session = data.session;
        // });

        // supabase.auth.onAuthStateChange((_event, _session) => {
        //     session = _session;
        // });
    })
</script>

<div class="">
    <a href="{base}/">Home page</a>&nbsp;|&nbsp;
    <a href="{base}/auth/login">Login</a>&nbsp;|&nbsp;
    <a href="{base}/auth/register">Register</a><br />
    <Account {session} />
</div>

<style>
</style>
