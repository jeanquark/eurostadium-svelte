<script>
    import { base } from "$app/paths";
    import { supabase } from "@lib/supabase/supabaseClient";
    import { onMount } from "svelte";
    import { goto } from "$app/navigation";
    import { jwtDecode } from "jwt-decode";
    import { addToast } from "@store/toast";
    import Toasts from "@components/Toasts.svelte";
    import { countryStore } from "@store/country";
    import { counter } from "@store/count";

    onMount(async () => {
        if ($countryStore.countries.length < 2) {
            await countryStore.fetchCountries();
        }
    });

    let selectedUser = $state(null);
    let loading = $state(false);

    const fetchCountries = async () => {
        try {
            await userStore.fetchUsers();
        } catch (error) {
            console.log("error: ", error);
        }
    };
</script>

<div class="container">
    <h2 class="text-center">Countries</h2>
    $countryStore.countries.length: {$countryStore.countries?.length}<br />
    {#each $countryStore.countries as country, i}
        {i} - {country.name}<br />
    {/each}
    <br /><br />
</div>

<style>
</style>
