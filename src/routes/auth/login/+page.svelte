<script>
    import { base } from "$app/paths";
    import Login from "@components/auth/Login.svelte";
</script>

<div class="">
    <a href="{base}/">Home page</a>&nbsp;|&nbsp;
    <a href="{base}/auth/register">Register</a>&nbsp;|&nbsp;
    <a href="{base}/auth/account">Account</a><br />
    <Login />
</div>

<style>
</style>
