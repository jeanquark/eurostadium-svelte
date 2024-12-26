<script>
    import { base } from "$app/paths";
    import { supabase } from "@lib/supabase/supabaseClient";
    import { onMount } from "svelte";
    import { goto } from "$app/navigation";
    import { jwtDecode } from "jwt-decode";
    import { addToast } from "@store/toast";
    import Toasts from "@components/Toasts.svelte";

    onMount(async () => {
        supabase.auth.onAuthStateChange((_event, _session) => {
            console.log("[onAuthStateChange] session: ", _session);
            if (!_session) {
                addToast({
                    message: "You are not authenticated.",
                    type: "error",
                    dismissible: false,
                    timeout: 3000,
                });
                goto("/auth/login");
            }
            const jwt = jwtDecode(_session.access_token);
            console.log("jwt: ", jwt);
            const userRole = jwt.user_role;
            console.log("userRole: ", userRole);
            if (userRole != "admin") {
                addToast({
                    message: "You are not authenticated as an admin.",
                    type: "warning",
                    dismissible: false,
                    timeout: 3000,
                });
                goto("/");
            }
        });
    });
</script>

<svelte:head>
    <title>Admin</title>
</svelte:head>

<div class="container">
    <div style="position: fixed; top: 20px; right: 20px;">
        <Toasts />
    </div>
    <h2 class="text-center">Admin</h2>
    <div class="text-center my-4">
        <a href="{base}/">&larr;Home</a>&nbsp;|&nbsp;
        <a href="{base}/upload-image">Upload image</a>
    </div>
</div>

<style>
</style>
