<script>
    import { base } from "$app/paths";
    import Register from "@components/auth/Register.svelte";
</script>

<div class="">
    <a href="{base}/">Home page</a>&nbsp;|&nbsp;
    <a href="{base}/auth/login">Login</a>&nbsp;|&nbsp;
    <a href="{base}/auth/account">Account</a><br />
    <Register />
</div>

<style>
</style>
