<script>
    import { base } from "$app/paths";
    import { leagueStore } from "@store/league.js";
    import { onMount } from "svelte";
    import "@styles/table.css";
    import Pagination from "@components/Pagination.svelte";
    import Search from "@components/Search.svelte";
    import SortAsc from "@components/icons/SortAsc.svelte";
    import SortDesc from "@components/icons/SortDesc.svelte";
	import slugify from "@lib/utils/slugify";

    onMount(async () => {
        try {
            const urlParams = new URLSearchParams(window.location.search);
            const leagueName = urlParams.get('name');
            console.log('leagueName: ', leagueName);
            if (leagueName) {
                searchValue = leagueName;
                await leagueStore.fetchLeaguesByName(leagueName);
            } else {
                // await leagueStore.fetchPaginatedLeagues(1, 10, 'api_football_id', 'asc');
                await leagueStore.fetchPaginatedLeagues();
            }
        } catch (error) {
            console.log("error: ", error);
        }
    });

    let currentPage = 1;
    let itemsPerPage = 10;
    let sortBy = "country(uefa_ranking), national_level";
    let sortOrder = "asc";
    let searchValue = "";
    $: totalPages = $leagueStore.paginatedLeagues?.totalPages;

    const sortTable = async (column) => {
        if (sortBy === column) {
            sortOrder = sortOrder === "asc" ? "desc" : "asc";
        } else {
            sortBy = column;
            sortOrder = "asc";
        }
		await leagueStore.fetchPaginatedLeagues(currentPage, itemsPerPage, sortBy, sortOrder);
    }

    const onPageChange = async (page) => {
        console.log("onPageChange page: ", page);
        currentPage = page;
        // update your table data here
        await leagueStore.fetchPaginatedLeagues(page, itemsPerPage, sortBy, sortOrder);
    };

    const onSearch = async (searchTerm) => {
        console.log("onSearch searchTerm: ", searchTerm);
        await leagueStore.fetchLeaguesByName(searchTerm);
    };
</script>

<svelte:head>
    <title>Leagues</title>
    <meta name="description" content="Display leagues" />
</svelte:head>

<div class="row">
    <div class="col-12 text-center my-5">
        <!-- leagueStore.leagues.length: {$leagueStore.leagues.length}<br />
        leagueStore.paginatedCountries.data.length: {$leagueStore
            .paginatedLeagues?.data?.length}<br />
        leagueStore.paginatedCountries.totalCount: {$leagueStore
            .paginatedLeagues?.totalCount}<br />
			sortOrder: {sortOrder}<br />
        <h2 class="text-center">Leagues page</h2>
        <br />
        <a href="{base}/">Home page</a>
        <br />
        <a href="{base}/countries">Countries</a>
        <br />
        <a href="{base}/teams">Teams</a>
        <br /> -->
        <a href="{base}/" class="primary-button">Home page</a>
    </div>
</div>
<div class="row justify-center" style="">
    <div class="col-8" style="">
        <h2 class="text-center">Leagues</h2>
        <div class="responsive-table-container" style="">
            <Search {onSearch} searchTable="league" searchValue={searchValue} />
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
                        <th>Image</th>
                        <th># Teams</th>
						<th>Country</th>
                    </tr>
                </thead>
                <tbody>
                    {#each $leagueStore.paginatedLeagues?.data as league, index}
                        <tr>
                            <td>{index + 1}</td>
                            <td><a href="{league.wiki}" target="_blank">{league.name}</a>&nbsp;<img src="{base}/images/icons/external-link.svg" width="10" alt="External link" /></td>
                            <td>
                                <img
                                    src="{league.image}"
                                    alt={league.name}
                                    height="30"
                                    class="px-1"
                                /></td
                            >
                            <td><a href="/teams?country={league.country?.name}">{league.teams && league.teams[0]?.count}</a></td>
                            <!-- <td></td> -->
							<td>{league.country?.name}</td>
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
