<script>
    import { base } from "$app/paths";
    import { supabase } from "@lib/supabase/supabaseClient";
    import { onMount } from "svelte";
    import { goto } from "$app/navigation";
    import { jwtDecode } from "jwt-decode";
    import { addToast } from "@store/toast";
    import Toasts from "@components/Toasts.svelte";
    import { leagueStore } from "@store/league";
    import { counter } from "@store/count";

    onMount(async () => {
        if ($leagueStore.leagues.length < 2) {
            await leagueStore.fetchLeagues();
        }
    });

    let selectedUser = $state(null);
    let loading = $state(false);
</script>

<div class="container">
    <h2 class="text-center">Leagues</h2>
    $leagueStore.leagues.length: {$leagueStore.leagues?.length}<br />
    {#each $leagueStore.leagues as league, i}
        {i} - {league.name}<br />
    {/each}
    <br /><br />
</div>

<style>
</style>
