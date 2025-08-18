<script>
    import { base } from "$app/paths";
    import { supabase } from "@lib/supabase/supabaseClient";
    import { onMount } from "svelte";
    import { goto } from "$app/navigation";
    import { jwtDecode } from "jwt-decode";
    import { addToast } from "@store/toast";
    import Toasts from "@components/Toasts.svelte";
    import { countryStore } from "@store/country";

    onMount(async () => {
        if ($countryStore.countries.length < 2) {
            countryStore.fetchCountries();
        }
    });

    let selectedCountry = $state(null);
    let loading = $state(false);

    const testAPIRoute = async () => {
        try {
            const response = await fetch(`/api/supabase/test-role`);
            const data = await response.json();
            console.log("data: ", data);
        } catch (error) {
            console.log("error: ", error);
        }
    }
</script>

<svelte:head>
    <title>Admin</title>
</svelte:head>

<div class="container">
    <h2 class="text-center">Admin</h2>
    <div class="text-center my-4">
        <a href="{base}/">Home</a>
    </div>
    <div class="row justify-center my-2">
        <div class="col-12">
            <button onclick={() => testAPIRoute()}>Test API Route</button>
        </div>
    </div>

    <div class="row justify-center">
        <div class="col-12">
            <hr />
        </div>
    </div>
    <div class="row justify-center my-2">
        <div class="col-12">
        </div>
    </div>
</div>

<style>
</style>
