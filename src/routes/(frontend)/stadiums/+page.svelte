<script>
    import { base } from "$app/paths";
    import { stadiumStore } from "@store/stadium.js";
    import { onMount } from "svelte";
    import "@styles/table.css";
    import Pagination from "@components/Pagination.svelte";
    import Search from "@components/Search.svelte";
    import SortAsc from "@components/icons/SortAsc.svelte";
    import SortDesc from "@components/icons/SortDesc.svelte";

    onMount(async () => {
        try {
            if ($stadiumStore.stadiums.length < 2) {
                // await stadiumStore.fetchStadiums();
            }
            await stadiumStore.fetchPaginatedStadiums();
        } catch (error) {
            console.log("error: ", error);
        }
    });

    let currentPage = 1;
    let itemsPerPage = 10;
    let sortBy = "name";
    let sortOrder = "asc";
    $: totalPages = $stadiumStore.paginatedStadiums?.totalPages;

    const sortTable = async (column) => {
        if (sortBy === column) {
            sortOrder = sortOrder === "asc" ? "desc" : "asc";
        } else {
            sortBy = column;
            sortOrder = "asc";
        }
		await stadiumStore.fetchPaginatedstadiums(currentPage, itemsPerPage, sortBy, sortOrder);
    }

    const onPageChange = async (page) => {
        console.log("onPageChange page: ", page);
        currentPage = page;
        // update your table data here
        await stadiumStore.fetchPaginatedStadiums(page, itemsPerPage, sortBy, sortOrder);
    };

    const onSearch = async (searchTerm) => {
        console.log("onSearch searchTerm: ", searchTerm);
        await stadiumStore.fetchCountryByName(searchTerm);
    };
</script>

<svelte:head>
    <title>stadiums</title>
    <meta name="description" content="Stadiums" />
</svelte:head>

<div class="row">
    <div class="col-12 text-center">
        stadiumStore.stadiums.length: {$stadiumStore.stadiums.length}<br />
        stadiumStore.paginatedStadiums.data.length: {$stadiumStore
            .paginatedStadiums?.data?.length}<br />
        stadiumStore.paginatedStadiums.totalCount: {$stadiumStore
            .paginatedStadiums?.totalCount}<br />
			sortOrder: {sortOrder}<br />
        <h2 class="text-center">Stadiums page</h2>
        <br />
        <a href="{base}/">Home page</a>
        <br />
        <a href="{base}/leagues">Leagues</a>
        <br />
        <a href="{base}/teams">Teams</a>
        <br />
        <br />
    </div>
</div>
<div class="row justify-center" style="">
    <div class="col-8" style="">
        <div class="responsive-table-container" style="">
            <Search {onSearch} />
            <table class="full-data-table" style="">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>ID</th>
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
						<th>Images</th>
                    </tr>
                </thead>
                <tbody>
                    {#each $stadiumStore.paginatedStadiums?.data as stadium, index}
                        <tr>
                            <td>{index + 1}</td>
                            <td>{stadium.id}</td>
                            <td>{stadium.name}</td>
							<td></td>
                        </tr>
                    {/each}
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
