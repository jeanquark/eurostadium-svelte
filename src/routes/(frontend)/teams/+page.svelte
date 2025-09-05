<script>
    import { base } from "$app/paths";
    import { teamStore } from "@store/team.js";
    import { onMount } from "svelte";
    import "@styles/table.css";
    import Pagination from "@components/Pagination.svelte";
    import Search from "@components/Search.svelte";
    import SortAsc from "@components/icons/SortAsc.svelte";
    import SortDesc from "@components/icons/SortDesc.svelte";
	import slugify from "@lib/utils/slugify";

    onMount(async () => {
        try {
            if ($teamStore.teams.length < 2) {
                // await teamStore.fetchTeams();
            }
            await teamStore.fetchPaginatedTeams();
        } catch (error) {
            console.log("error: ", error);
        }
    });

    let currentPage = 1;
    let itemsPerPage = 10;
    let sortBy = "name";
    let sortOrder = "asc";
    $: totalPages = $teamStore.paginatedteams?.totalPages;

    const sortTable = async (column) => {
        if (sortBy === column) {
            sortOrder = sortOrder === "asc" ? "desc" : "asc";
        } else {
            sortBy = column;
            sortOrder = "asc";
        }
		await teamStore.fetchPaginatedteams(currentPage, itemsPerPage, sortBy, sortOrder);
    }

    const onPageChange = async (page) => {
        console.log("onPageChange page: ", page);
        currentPage = page;
        // update your table data here
        await teamStore.fetchPaginatedteams(page, itemsPerPage, sortBy, sortOrder);
    };

    const onSearch = async (searchTerm) => {
        console.log("onSearch searchTerm: ", searchTerm);
        // await teamStore.fetchLeagueByName(searchTerm);
    };
</script>

<svelte:head>
    <title>teams</title>
    <meta name="description" content="Countries" />
</svelte:head>

<div class="row">
    <div class="col-12 text-center">
        teamStore.teams.length: {$teamStore.teams.length}<br />
        teamStore.paginatedTeams.data.length: {$teamStore
            .paginatedTeams?.data?.length}<br />
        teamStore.paginatedTeams.totalCount: {$teamStore
            .paginatedTeams?.totalCount}<br />
			sortOrder: {sortOrder}<br />
        <h2 class="text-center">Teams page</h2>
        <br />
        <a href="{base}/">Home page</a>
        <br />
        <a href="{base}/countries">Countries</a>
        <br />
        <a href="{base}/stadiums">Stadiums</a>
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
                        <th>Image</th>
                        <th>Wiki</th>
                    </tr>
                </thead>
                <tbody>
                    {#each $teamStore.paginatedTeams?.data as team, index}
                        <tr>
                            <td>{index + 1}</td>
                            <td>{team.id}</td>
                            <td>{team.name}</td>
                            <td>
                                <img
                                    src="{team.image}"
                                    alt={team.name}
                                    height="30"
                                    class="px-1"
                                /></td
                            >
                            <td>{team.wiki}</td>
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
