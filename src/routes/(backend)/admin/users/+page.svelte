<script>
    import { base } from "$app/paths";
    import { supabase } from "@lib/supabase/supabaseClient";
    import { onMount } from "svelte";
    import { goto } from "$app/navigation";
    import { jwtDecode } from "jwt-decode";
    import { addToast } from "@store/toast";
    import Toasts from "@components/Toasts.svelte";
    import { userStore } from "@store/user";

    onMount(async () => {
        if ($userStore.users.length < 2) {
            await userStore.fetchUsers();
        }
        console.log("userStore.users: ", userStore.users);
    });

    let selectedUser = $state(null);
    let loading = $state(false);

    const fetchCountries = async () => {
        try {
            if (countryStore.countries.length < 2) {
                await countryStore.fetchCountries();
            }
            selectedUser = countryStore.countries[0];
        } catch (error) {
            console.log("error: ", error);
        }
    };
</script>

<div class="container">
    <h2 class="text-center">Users</h2>
    $userStore.users.length: {$userStore.users?.length}<br />
    userStore.users.length: {userStore.users?.length}<br />
    {#each userStore.users as user, i}
        {i} - {user.id}
    {/each}
</div>

<style>
</style>
