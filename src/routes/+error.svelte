<script>
    import { page } from "$app/stores";
    import { base } from "$app/paths";
</script>

<div class="container">
    <div class="card">
        <h3>{$page.status}: {$page.error.message}</h3>
        <br />
        <a href="{base}/">Home</a>
    </div>
</div>

<style>
    .container {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100vh;
    }
    .card {
        padding: 10px;
        border: 2px solid orange;
        border-radius: 0.5em;
        text-align: center;
    }
</style>
