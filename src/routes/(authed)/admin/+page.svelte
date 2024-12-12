<script>
    import { base } from "$app/paths";
    import { supabase } from "@lib/supabase/supabaseClient";
</script>

<svelte:head>
    <title>Admin</title>
</svelte:head>

<div class="container">
    <h2 class="text-center">Admin</h2>
    <div class="text-center my-4">
        <a href="{base}/">&larr;Home</a>&nbsp;|&nbsp;
        <a href="{base}/upload-image">Upload image</a>
    </div> 
</div>

<style>
</style>
