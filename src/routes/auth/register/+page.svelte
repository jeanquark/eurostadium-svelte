<script>
    import { base } from "$app/paths";
    import { onMount } from "svelte";
    import Register from "@components/auth/Register.svelte";
    import { supabase } from "@lib/supabase/supabaseClient";
    import { goto } from '$app/navigation';

    let session = $state(null);

    onMount(() => {
        supabase.auth.getSession().then(({ data }) => {
            session = data.session;
        });
        
        supabase.auth.onAuthStateChange((_event, _session) => {
            session = _session;
            console.log('[onAuthStateChange] session: ', session)
            console.log('session: ', session);
            if (session) {
                goto('/')
            }
        });
        
    })
</script>

<div class="">
    <a href="{base}/">Home page</a>&nbsp;|&nbsp;
    <a href="{base}/auth/login">Login</a>&nbsp;|&nbsp;
    <a href="{base}/auth/account">Account</a><br />
    <Register />
</div>

<style>
</style>
