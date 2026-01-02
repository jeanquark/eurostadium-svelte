<script>
    import { base } from "$app/paths";
    import { countryStore } from "@store/country.js";
    import { onMount } from "svelte";
    import "@styles/table.css";
    import { supabase } from "@lib/supabase/supabaseClient";

    onMount(async () => {
        try {
            const { count, error } = await supabase.from("countries").select('*', { count: 'exact' });
            if (error) {
                throw error;
            }
            numberOfCountries = count;
        } catch (error) {
            console.log("error: ", error);
        }
    });

    let numberOfCountries = $state(0);

</script>

<svelte:head>
    <title>Pong</title>
    <meta name="description" content="Pong" />
</svelte:head>

<div class="row">
    <div class="col-12 text-center my-5">
        <h3 class="text-center">Pong</h3>
        <br /><br />
        <p class="text-center">number of countries: {numberOfCountries}</p>
    </div>
</div>

<style scoped>
</style>
