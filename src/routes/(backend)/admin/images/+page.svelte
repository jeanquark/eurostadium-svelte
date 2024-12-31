<script>
    import { base } from "$app/paths";
    import { supabase } from "@lib/supabase/supabaseClient";
    import { onMount } from "svelte";
    import { goto } from "$app/navigation";
    import { jwtDecode } from "jwt-decode";
    import { addToast } from "@store/toast";
    import Toasts from "@components/Toasts.svelte";
    import { imageStore } from "@store/image";
    import { counter } from "@store/count";

    onMount(async () => {
        if ($imageStore.images.length < 2) {
            await imageStore.fetchImages();
        }
    });

    let selectedUser = $state(null);
    let loading = $state(false);

    const fetchImages = async () => {
        try {
            await imageStore.fetchImages();
        } catch (error) {
            console.log("error: ", error);
        }
    };
</script>

<div class="container">
    <h2 class="text-center">Images</h2>
    $imageStore.images.length: {$imageStore.images?.length}<br />
    {#each $imageStore.images as image, i}
        {i} - {image.name}<br />
    {/each}
    <br /><br />
</div>

<style>
</style>
