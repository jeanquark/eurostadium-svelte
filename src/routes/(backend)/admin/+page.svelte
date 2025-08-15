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

    const fetchCountries = async () => {
        try {
            if (countryStore.countries.length < 2) {
                await countryStore.fetchCountries();
            }
            selectedCountry = countryStore.countries[0];
        } catch (error) {
            console.log("error: ", error);
        }
    };

    const updateStadiums = async () => {
        try {
            if (!selectedCountry) {
                addToast({
                    message: "Please select a country.",
                    type: "warning",
                    dismissible: false,
                    timeout: 3000,
                });
                return;
            }
            loading = true;
            const response = await fetch(
                `/api/supabase/update-stadiums?country=${selectedCountry.name}`,
            );
            const data = await response.json();
            console.log("data: ", data);
            if (!data.success) {
                throw data.message;
            }
            addToast({
                message: `${data.total_rows_updated} stadiums updated successfully for ${selectedCountry.name}.`,
                type: "success",
                dismissible: false,
                timeout: 3000,
            });
        } catch (error) {
            console.log("error: ", error);
            addToast({
                message: "An error occured.",
                type: "error",
                dismissible: false,
                timeout: 3000,
            });
        } finally {
            loading = false;
        }
    };
    const updateTeams = async () => {
        try {
            if (!selectedCountry) {
                addToast({
                    message: "Please select a country.",
                    type: "warning",
                    dismissible: false,
                    timeout: 3000,
                });
                return;
            }
            loading = true;
            const response = await fetch(
                `/api/supabase/update-teams?country=${selectedCountry.name}`,
            );
            const data = await response.json();
            console.log("data: ", data);
            if (!data.success) {
                throw data.message;
            }
            addToast({
                message: `${data.total_rows_updated} teams updated successfully for ${selectedCountry.name}.`,
                type: "success",
                dismissible: false,
                timeout: 3000,
            });
        } catch (error) {
            console.log("error: ", error);
            addToast({
                message: "An error occured.",
                type: "error",
                dismissible: false,
                timeout: 3000,
            });
        } finally {
            loading = false;
        }
    };
    const updateImages = async () => {
        try {
            if (!selectedCountry) {
                addToast({
                    message: "Please select a country.",
                    type: "warning",
                    dismissible: false,
                    timeout: 3000,
                });
                return;
            }
            loading = true;
            const response = await fetch(
                `/api/supabase/update-images?country=${selectedCountry.name}`,
            );
            const data = await response.json();
            console.log("data: ", data);
            if (!data.success) {
                throw data.message;
            }
            addToast({
                message: `${data.total_rows_updated} images updated successfully for ${selectedCountry.name}.`,
                type: "success",
                dismissible: false,
                timeout: 3000,
            });
        } catch (error) {
            console.log("error: ", error);
            addToast({
                message: "An error occured.",
                type: "error",
                dismissible: false,
                timeout: 3000,
            });
        } finally {
            loading = false;
        }
    };
    const setImageUrls = async () => {
        try {
            if (!selectedCountry) {
                addToast({
                    message: "Please select a country.",
                    type: "warning",
                    dismissible: false,
                    timeout: 3000,
                });
                return;
            }
            loading = true;
            const response = await fetch(
                `/api/supabase/set-images-public-urls?country=${selectedCountry.name}`,
            );
            const data = await response.json();
            console.log("data: ", data);
            if (!data.success) {
                throw data.message;
            }
            addToast({
                message: `${data.total_rows_updated} public image urls updated successfully for ${selectedCountry.name}.`,
                type: "success",
                dismissible: false,
                timeout: 3000,
            });
        } catch (error) {
            console.log("error: ", error);
            addToast({
                message: "An error occured.",
                type: "error",
                dismissible: false,
                timeout: 3000,
            });
        } finally {
            loading = false;
        }
    };
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
            selectedCountry.name: {selectedCountry?.name}<br />
            {#if selectedCountry}
                <select bind:value={selectedCountry}>
                    {#each countryStore.countries as country}
                        <option value={country}>
                            {country.name}
                        </option>
                    {/each}
                </select>
            {:else}
                <i>no country selected</i>
            {/if}
            <button onclick={() => fetchCountries()}>Fetch countries</button>
        </div>
    </div>

    <div class="row justify-center">
        <div class="col-12">
            <hr />
        </div>
    </div>
    <div class="row justify-center my-2">
        <div class="col-12">
            {#if loading}
                <h3 class="text-center">loading...</h3>
            {/if}
            <br />
            <button onclick={() => updateStadiums()}>Update stadiums</button><br
            /><br />
            <button onclick={() => updateTeams()}>Update teams</button><br /><br
            />
            <button onclick={() => updateImages()}>Update images</button><br
            /><br />
            <button onclick={() => setImageUrls()}>Set images public url</button
            ><br /><br />
        </div>
    </div>
</div>

<style>
</style>
