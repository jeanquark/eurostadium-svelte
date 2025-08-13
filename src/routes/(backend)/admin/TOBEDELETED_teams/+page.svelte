<script>
    import { base } from "$app/paths";
    import { supabase } from "@lib/supabase/supabaseClient";
    import { onMount } from "svelte";
    import { goto } from "$app/navigation";
    import { jwtDecode } from "jwt-decode";
    import { addToast } from "@store/toast";
    import Toasts from "@components/Toasts.svelte";
    import { teamStore } from "@store/team";
    import { counter } from "@store/count";

    onMount(async () => {
        if ($teamStore.teams.length < 2) {
            await teamStore.fetchTeams();
        }
    });

    let selectedUser = $state(null);
    let loading = $state(false);

    const fetchTeams = async () => {
        try {
            await teamStore.fetchTeams();
        } catch (error) {
            console.log("error: ", error);
        }
    };
</script>

<div class="container">
    <h2 class="text-center">Teams</h2>
    $teamStore.teams.length: {$teamStore.teams?.length}<br />
    {#each $teamStore.teams as team, i}
        {i} - {team.name}<br />
    {/each}
    <br /><br />
</div>

<style>
</style>
