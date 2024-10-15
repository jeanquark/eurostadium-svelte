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
            class="colx-sm-12 colx-md-3 colx-lg-2 colx-xl-1"
            style="background: yellow;"
        >
            col-sm-12 col-md-3 col-lg-2 col-xl-1
        </div>
        <div
            class="colx-sm-12 colx-md-6 colx-lg-8 colx-xl-10"
            style="background: orange;"
        >
            col-sm-12 col-md-6 col-lg-8 col-xl-10
        </div>
        <div
            class="colx-sm-12 colx-md-3 colx-lg-2 colx-xl-1"
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

    [class^="colx-"] {
        flex: 1 0 auto;
        padding: 0 1rem;
    }
    .colx-12 {
        flex-basis: 100%;
        max-width: 100%;
    }
    .colx-11 {
        flex-basis: 91.66%;
        max-width: 91.66%;
    }
    .colx-10 {
        flex-basis: 83.33%;
        max-width: 83.33%;
    }
    .colx-9 {
        flex-basis: 75%;
        max-width: 75%;
    }
    .colx-8 {
        flex-basis: 66.66%;
        max-width: 66.66%;
    }
    .colx-7 {
        flex-basis: 58.33%;
        max-width: 58.33%;
    }
    .colx-6 {
        flex-basis: 50%;
        max-width: 50%;
    }
    .colx-5 {
        flex-basis: 41.66%;
        max-width: 41.66%;
    }
    .colx-4 {
        flex-basis: 33.33%;
        max-width: 33.33%;
    }
    .colx-3 {
        flex-basis: 25%;
        max-width: 25%;
    }
    .colx-2 {
        flex-basis: 16.66%;
        max-width: 16.66%;
    }
    .colx-1 {
        flex-basis: 8.33%;
        max-width: 8.33%;
    }
    /* xl */
    @media screen and (min-width: 1201px) {
        .colx-xl-12 {
            flex-basis: 100%;
            max-width: 100%;
        }
        .colx-xl-10 {
            flex-basis: 83.33%;
            max-width: 83.33%;
        }
        .colx-xl-8 {
            flex-basis: 66.66%;
            max-width: 66.66%;
        }
        .colx-xl-6 {
            flex-basis: 50%;
            max-width: 50%;
        }
        .colx-xl-4 {
            flex-basis: 33.33%;
            max-width: 33.33%;
        }
        .colx-xl-3 {
            flex-basis: 25%;
            max-width: 25%;
        }
        .colx-xl-2 {
            flex-basis: 16.66%;
            max-width: 16.66%;
        }
        .colx-xl-1 {
            flex-basis: 8.33%;
            max-width: 8.33%;
        }
    }
    /* lg */
    @media screen and (max-width: 1200px) {
        .colx-lg-12 {
            flex-basis: 100%;
            max-width: 100%;
        }
        .colx-lg-10 {
            flex-basis: 83.33%;
            max-width: 83.33%;
        }
        .colx-lg-8 {
            flex-basis: 66.66%;
            max-width: 66.66%;
        }
        .colx-lg-6 {
            flex-basis: 50%;
            max-width: 50%;
        }
        .colx-lg-4 {
            flex-basis: 33.33%;
            max-width: 33.33%;
        }
        .colx-lg-3 {
            flex-basis: 25%;
            max-width: 25%;
        }
        .colx-lg-2 {
            flex-basis: 16.66%;
            max-width: 16.66%;
        }
        .colx-lg-1 {
            flex-basis: 8.33%;
            max-width: 8.33%;
        }
        .colx-lg-0 {
            flex-basis: 0%;
            max-width: 0%;
        }
    }
    /* md */
    @media screen and (max-width: 992px) {
        .colx-md-12 {
            flex-basis: 100%;
            max-width: 100%;
        }
        .colx-md-10 {
            flex-basis: 83.33%;
            max-width: 83.33%;
        }
        .colx-md-8 {
            flex-basis: 66.66%;
            max-width: 66.66%;
        }
        .colx-md-6 {
            flex-basis: 50%;
            max-width: 50%;
        }
        .colx-md-4 {
            flex-basis: 33.33%;
            max-width: 33.33%;
        }
        .colx-md-3 {
            flex-basis: 25%;
            max-width: 25%;
        }
        .colx-md-2 {
            flex-basis: 16.66%;
            max-width: 16.66%;
        }
        .colx-md-1 {
            flex-basis: 8.33%;
            max-width: 8.33%;
        }
        .colx-md-0 {
            flex-basis: 0%;
            max-width: 0%;
        }
    }
    /* sm */
    @media screen and (max-width: 768px) {
        .colx-sm-12 {
            flex-basis: 100%;
            max-width: 100%;
        }
        .colx-sm-10 {
            flex-basis: 83.33%;
            max-width: 83.33%;
        }
        .colx-sm-8 {
            flex-basis: 66.66%;
            max-width: 66.66%;
        }
        .colx-sm-6 {
            flex-basis: 50%;
            max-width: 50%;
        }
        .colx-sm-4 {
            flex-basis: 33.33%;
            max-width: 33.33%;
        }
        .colx-sm-3 {
            flex-basis: 25%;
            max-width: 25%;
        }
        .colx-sm-2 {
            flex-basis: 16.66%;
            max-width: 16.66%;
        }
        .colx-sm-1 {
            flex-basis: 8.33%;
            max-width: 8.33%;
        }
        .colx-sm-0 {
            flex-basis: 0%;
            max-width: 0%;
        }
    }
</style>
