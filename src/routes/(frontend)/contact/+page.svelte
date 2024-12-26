<script>
    import { base } from "$app/paths";
</script>

<svelte:head>
    <title>Contact</title>
    <meta name="description" content="Contact us" />
</svelte:head>

<div class="container2">
    <div class="row2">
        <div
            class="col-sm-12 col-md-3 col-lg-2 col-xl-1"
            style="background: yellow;"
        >
            col-sm-12 col-md-3 col-lg-2 col-xl-1
        </div>
        <div
            class="col-sm-12 col-md-6 col-lg-8 col-xl-10"
            style="background: orange;"
        >
            col-sm-12 col-md-6 col-lg-8 col-xl-10
        </div>
        <div
            class="col-sm-12 col-md-3 col-lg-2 col-xl-1"
            style="background: orangered;"
        >
            col-sm-12 col-md-3 col-lg-2 col-xl-1
        </div>
    </div>
</div>

<style>
    *,
    ::before,
    ::after {
        margin: 0;
        box-sizing: border-box;
    }

    .container2 {
        /* max-width: 1200px; */
        margin: auto;
        /* padding: 0 1rem; */
    }

    .row2 {
        display: flex;
        flex-flow: row wrap;
        /* margin: 0 -1rem; */
    }
</style>
