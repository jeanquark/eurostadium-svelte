<script>
    import { base } from "$app/paths";
    import { countryStore } from "@store/country.js";
    import { onMount } from "svelte";
    import "@styles/table.css";
    import Pagination from "@components/Pagination.svelte";
    import Search from "@components/Search.svelte";
    import SortAsc from "@components/icons/SortAsc.svelte";
    import SortDesc from "@components/icons/SortDesc.svelte";

    onMount(async () => {
        try {
            // if ($countryStore.countries.length < 2) {
            //     await countryStore.fetchCountries();
            // }
            await countryStore.fetchPaginatedCountries();
        } catch (error) {
            console.log("error: ", error);
        }
    });

    let currentPage = 1;
    let itemsPerPage = 10;
    let sortBy = "name";
    let sortOrder = "asc";
    $: totalPages = $countryStore.paginatedCountries?.totalPages;

    const sortTable = async (column) => {
        if (sortBy === column) {
            sortOrder = sortOrder === "asc" ? "desc" : "asc";
        } else {
            sortBy = column;
            sortOrder = "asc";
        }
        await countryStore.fetchPaginatedCountries(
            currentPage,
            itemsPerPage,
            sortBy,
            sortOrder
        );
    };

    const onPageChange = async (page) => {
        console.log("onPageChange page: ", page);
        currentPage = page;
        // update your table data here
        await countryStore.fetchPaginatedCountries(
            page,
            itemsPerPage,
            sortBy,
            sortOrder
        );
    };

    const onSearch = async (searchTerm) => {
        console.log("onSearch searchTerm: ", searchTerm);
        await countryStore.fetchCountryByName(searchTerm);
    };
</script>

<svelte:head>
    <title>Countries</title>
    <meta name="description" content="Display countries" />
</svelte:head>

<div class="row">
    <div class="col-12 text-center my-5">
        <!-- countryStore.countries.length: {$countryStore.countries.length}<br />
        countryStore.paginatedCountries.data.length: {$countryStore
            .paginatedCountries?.data?.length}<br />
        countryStore.paginatedCountries.totalCount: {$countryStore
            .paginatedCountries?.totalCount}<br />
			sortOrder: {sortOrder}<br />
        <h2 class="text-center">Countries page</h2>
        <br />
        <a href="{base}/">Home page</a>
        <br />
        <a href="{base}/leagues">Leagues</a>
        <br />
        <a href="{base}/teams">Teams</a>
        <br />
        <br /> -->
        <a href="{base}/" class="primary-button">Home page</a>
    </div>
</div>
<div class="row justify-center" style="">
    <div class="col-8" style="">
        <h2 class="text-center">Countries</h2>
        <div class="responsive-table-container" style="">
            <Search {onSearch} searchTable="country" />
            <table class="full-data-table" style="">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>
                            Name
                            <button
                                class="sort-icon"
                                on:click={() => sortTable("name")}
                            >
                                {#if sortBy === "name" && sortOrder === "asc"}
                                    <SortAsc />
                                {:else if sortBy === "name" && sortOrder === "desc"}
                                    <SortDesc />
                                {:else}
                                    <SortAsc />
                                {/if}
                            </button>
                        </th>
                        <th>Flag</th>
                        <th>UEFA ranking</th>
                        <th>First league</th>
                        <th>Second league</th>
                    </tr>
                </thead>
                <tbody>
                    {#if $countryStore.paginatedCountries?.data.length < 1}
                        <tr>
                            <td colspan="6" style="text-align: center;"
                                >No data</td
                            >
                        </tr>
                    {:else}
                        {#each $countryStore.paginatedCountries.data as country, index}
                            <tr>
                                <td>{index + 1}</td>
                                <td>{country.name}</td>
                                <td>
                                    <img
                                        src="/images/flags/{country.image}"
                                        alt={country.name}
                                        height="30"
                                        class="px-1"
                                    /></td
                                >
                                <td>{country.uefa_ranking}</td>
                                <td
                                    ><a href="/leagues?id={country.leagues[0]?.id}"
                                        >{country.leagues[0]?.name}</a
                                    ></td
                                >
                                <td
                                    ><a href="/leagues?id={country.leagues[1]?.id}"
                                        >{country.leagues[1]?.name}</a
                                    ></td
                                >
                            </tr>
                        {/each}
                    {/if}
                </tbody>
            </table>
            <Pagination {totalPages} {currentPage} {onPageChange} />
        </div>
    </div>
</div>
<div class="row border-3">
    <div class="col-4 border-1">col-4</div>
    <div class="col-4">col-4</div>
    <div class="col-4">col-4</div>
</div>

<style scoped>
    .sort-icon {
        border: none;
        box-sizing: border-box;
        background: none;
    }
    .sort-icon:hover {
        cursor: pointer;
    }
</style>
