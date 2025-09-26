<script>
    import { base } from '$app/paths'
    import { teamStore } from '@store/team.js'
    import { onMount } from 'svelte'
    import '@styles/table.css'
    import Pagination from '@components/Pagination.svelte'
    import Search from '@components/Search.svelte'
    import SortAsc from '@components/icons/SortAsc.svelte'
    import SortDesc from '@components/icons/SortDesc.svelte'
    import slugify from '@lib/utils/slugify'

    onMount(async () => {
        try {
            // if ($teamStore.teams.length < 2) {
            // await teamStore.fetchTeams();
            // }
            await teamStore.fetchPaginatedTeams()
        } catch (error) {
            console.log('error: ', error)
        }
    })

    let currentPage = 1
    let itemsPerPage = 10
    let sortBy = 'name'
    let sortOrder = 'asc'
    // $: totalPages = $teamStore.paginatedteams?.totalPages;
    let totalPages = 10
    let searchValue = ''

    const sortTable = async (column) => {
        if (sortBy === column) {
            sortOrder = sortOrder === 'asc' ? 'desc' : 'asc'
        } else {
            sortBy = column
            sortOrder = 'asc'
        }
        await teamStore.fetchPaginatedteams(currentPage, itemsPerPage, sortBy, sortOrder)
    }

    const onPageChange = async (page) => {
        console.log('onPageChange page: ', page)
        currentPage = page
        // update your table data here
        await teamStore.fetchPaginatedTeams(page, itemsPerPage, sortBy, sortOrder, searchValue)
    }

    const onSearch = async (searchTerm) => {
        console.log('onSearch searchTerm: ', searchTerm)
        // await teamStore.fetchTeamsByName(searchTerm);
        searchValue = searchTerm
        await teamStore.fetchPaginatedTeams(1, itemsPerPage, sortBy, sortOrder, searchTerm)
        if (searchTerm === '') {
            currentPage = 1
        }
    }
</script>

<svelte:head>
    <title>Teams</title>
    <meta name="description" content="Display teams" />
</svelte:head>

<div class="row no-gutters">
    <div class="col-12 text-center my-3">
        <!-- teamStore.teams.length: {$teamStore.teams.length}<br />
        teamStore.paginatedTeams.data.length: {$teamStore.paginatedTeams?.data
            ?.length}<br />-->
        $teamStore.paginatedTeams.totalCount: {$teamStore.paginatedTeams?.totalCount}<br />
        $teamStore.paginatedTeams.totalPages: {$teamStore.paginatedTeams?.totalPages}<br />
        <!-- totalPages: {$totalPages}<br /> -->
        <!-- sortOrder: {sortOrder}<br />
        <h2 class="text-center">Teams page</h2>
        <br />
        <a href="{base}/">Home page</a>
        <br />
        <a href="{base}/countries">Countries</a>
        <br />
        <a href="{base}/stadiums">Stadiums</a>
        <br /> -->
        <a href="{base}/" class="primary-button">Home page</a>
    </div>
</div>
<div class="row justify-center" style="" id="table">
    <div class="col-8" style="">
        <h2 class="text-center">Teams</h2>
        <div class="responsive-table-container" style="">
            <Search {onSearch} searchTable="team" />
            <table class="full-data-table" style="">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>ID</th>
                        <th>
                            Name
                            <button class="sort-icon" on:click={() => sortTable('name')}>
                                {#if sortBy === 'name' && sortOrder === 'asc'}
                                    <SortAsc />
                                {:else if sortBy === 'name' && sortOrder === 'desc'}
                                    <SortDesc />
                                {:else}
                                    <SortAsc />
                                {/if}
                            </button>
                        </th>
                        <th>Image</th>
                        <th>League</th>
                        <th>Country</th>
                        <th>Stadium</th>
                    </tr>
                </thead>
                <tbody>
                    {#each $teamStore.paginatedTeams?.data as team, index}
                        <tr>
                            <td>{index + 1}</td>
                            <td>{team.id}</td>
                            <td><a href={team.wiki} target="_blank">{team.name}</a>&nbsp;<img src="{base}/images/icons/external-link.svg" width="10" alt="External link" /> </td>
                            <td> <img src={team.image} alt={team.name} height="30" class="px-1" /></td>
                            <td>{team.league?.name}</td>
                            <td>{team.league?.country?.name}</td>
                            <td> <a href="/stadiums?country={team.stadium?.id}">{team.stadium?.name}</a></td>
                        </tr>
                    {/each}
                </tbody>
            </table>
            <!-- <Pagination {totalPages} {currentPage} {onPageChange} /> -->
            <!-- <Pagination totalPages={141} {currentPage} {onPageChange} /> -->
            <Pagination totalPages={$teamStore.paginatedTeams?.totalPages} {currentPage} {onPageChange} />
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
