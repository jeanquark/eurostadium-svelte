<script>
    import { base } from "$app/paths";
    import { supabase } from "@lib/supabase/supabaseClient";
    import { onMount } from "svelte";
    import { goto } from "$app/navigation";
    import { jwtDecode } from "jwt-decode";
    import { addToast } from "@store/toast";
    import Toasts from "@components/Toasts.svelte";
    import { countryStore } from "@store/country";
    import { leagueStore } from "@store/league";
    import { stadiumStore } from "@store/stadium";
    import { counter } from "@store/count";
    import dayjs from '$lib/utils/day'
    import { page } from '$app/stores';

    onMount(async () => {
    });


</script>

<div class="container">
    <h2 class="text-center">Stadium with ID {$page.params.id}</h2>
    


</div>

<style>
    .btn.active {
        background-color: #007bff;
        color: white;
    }
</style>
