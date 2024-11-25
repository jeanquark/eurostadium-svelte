<script>
    import { supabase } from "../lib/supabase/supabaseClient";
    import Login from "../../components/auth/Login.svelte";
    let session = null;

    onMount(async () => {
        supabase.auth.getSession().then(({ data }) => {
            session = data.session;
        });

        supabase.auth.onAuthStateChange((_event, _session) => {
            session = _session;
        });
    })
</script>

<div class="">
    <Account {session} />
</div>

<style>
</style>
