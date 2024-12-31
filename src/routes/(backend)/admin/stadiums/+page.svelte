<script>
    import { base } from "$app/paths";
    import { supabase } from "@lib/supabase/supabaseClient";
    import { onMount } from "svelte";
    import { goto } from "$app/navigation";
    import { jwtDecode } from "jwt-decode";
    import { addToast } from "@store/toast";
    import Toasts from "@components/Toasts.svelte";
    import { stadiumStore } from "@store/stadium";
    import { counter } from "@store/count";

    onMount(async () => {
        if ($stadiumStore.stadiums.length < 2) {
            await stadiumStore.fetchStadiums();
        }
    });

    let selectedUser = $state(null);
    let loading = $state(false);

    const fetchStadiums = async () => {
        try {
            await stadiumStore.fetchUsers();
        } catch (error) {
            console.log("error: ", error);
        }
    };
</script>

<div class="container">
    <h2 class="text-center">Stadiums</h2>
    $stadiumStore.stadiums.length: {$stadiumStore.stadiums?.length}<br />
    {#each $stadiumStore.stadiums as stadium, i}
        {i} - {stadium.name}<br />
    {/each}
    <br /><br />
</div>

<style>
</style>
