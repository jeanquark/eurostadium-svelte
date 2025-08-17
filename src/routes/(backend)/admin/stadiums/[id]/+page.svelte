<script>
    import { base } from "$app/paths";
    import { supabase } from "@lib/supabase/supabaseClient";
    import { onMount } from "svelte";
    import { addToast } from "@store/toast";
    import { page } from '$app/stores';

    onMount(async () => {
        try {
            const { data, error } = await supabase.from('teams_view').select(`*`).eq('stadium_id', $page.params.id);
            if (error) {
                console.error('Error fetching stadium data:', error);
                addToast({ type: 'error', message: 'Failed to load stadium data.' });
                return;
            }
            if (data.length === 0) {
                addToast({ type: 'info', message: 'No teams found for this stadium.' });
            } else {
                // Process the data as needed
                console.log('Images in stadium:', data);
                stadiumImages = data
            }
        } catch (error) {
            console.log('error: ', error);
        }
    });

    let stadiumImages = [];

</script>

<div class="container">
    <div class="row">
        <div class="col-12">
            <a href="{base}/admin/stadiums" class="">&larr; Back to Stadiums</a>
        </div>
    </div>
    <div class="row">
        <div class="col-12">
            <h2 class="text-center">{stadiumImages[0]?.stadium_name}</h2>
            <h3 class="text-center">{stadiumImages[0]?.stadium_city}</h3>
            <h4 class="text-center">{stadiumImages[0]?.stadium_capacity}</h4>
            <p class="text-center"><a class="text-center" href="{stadiumImages[0]?.stadium_wiki}" target="_blank">wiki</a></p>
            <p class="text-center">{stadiumImages[0]?.team_name}</p>
            <p class="text-center">{stadiumImages[0]?.league_name}</p>
            <p class="text-center">{stadiumImages[0]?.country_name}</p>
            <p class="text-center">API Football ID: {stadiumImages[0]?.stadium_api_football_id}</p>
        </div>
    </div>
    <div class="row justify-start align-center">
        {#each stadiumImages as image, index}
        <div class="col-4 pa-3">
            <img src="{image.image_url}" width="100%" alt="Stadium Image {index + 1}" class="img-fluid mb-3" />
            <small><a href="{image.image_url}" target="_blank">View Image</a></small>
            <small><a href="{image.image_src}" target="_blank">Source</a></small>
        </div>
        {/each}
    </div>


</div>

<style>
</style>
