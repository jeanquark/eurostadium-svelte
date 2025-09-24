<script>
    import { base } from '$app/paths'
    import { onMount } from 'svelte'
    import '@styles/table.css'
    import slugify from '@utils/slugify'
    import Pagination from '@components/Pagination.svelte'
    import Search from '@components/Search.svelte'
    import SortAsc from '@components/icons/SortAsc.svelte'
    import SortDesc from '@components/icons/SortDesc.svelte'
    import { countryStore } from '@store/country.js'
    import { stadiumStore } from '@store/stadium.js'
    import Modal from '@components/Modal.svelte'

    onMount(async () => {
        try {
            if ($countryStore.countries.length < 2) {
                await countryStore.fetchCountries()
            }
            console.log('$countryStore.countries: ', $countryStore.countries)
            // selectedCountry = $countryStore.countries[Math.floor(Math.random() * 54)] || null
            selectedCountry = $countryStore.countries[51]
            console.log('$countryStore.countries.length: ', $countryStore.countries.length)
            const uefa_ranking = generateRandomExponential(1, $countryStore.countries.length)
            console.log('uefa_ranking: ', uefa_ranking)
            const selectedCountry2 = $countryStore.countries.find((c) => c.uefa_ranking === uefa_ranking)
            console.log('selectedCountry2: ', selectedCountry2)

            await stadiumStore.fetchPaginatedStadiums('1', '10', 'id', 'asc', 'Switzerland')
            totalPages = $stadiumStore.paginatedStadiums?.totalPages || 1
            totalCount = $stadiumStore.paginatedStadiums?.totalCount || 1
        } catch (error) {
            console.log('error: ', error)
        }
    })

    let currentPage = $state(1)
    let itemsPerPage = $state(10)
    let sortBy = $state('id')
    let totalPages = $state(1)
    let totalCount = $state(1)
    let sortOrder = $state('asc')
    let showModal = $state(false)
    let selectedCountry = $state(null)
    let selectedStadium = $state(null)
    let tooltipText = 'Select country'
    // $: totalPages = $stadiumStore.paginatedStadiums?.totalPages;
    // let totalPages = $state($stadiumStore.paginatedStadiums?.totalPages)
    // $derived: totalPages = stadiumStore.paginatedStadiums?.totalPages

    const sortTable = async (column) => {
        if (sortBy === column) {
            sortOrder = sortOrder === 'asc' ? 'desc' : 'asc'
        } else {
            sortBy = column
            sortOrder = 'asc'
        }
        console.log('sortBy: ', sortBy)
        console.log('sortOrder: ', sortOrder)
        await stadiumStore.fetchPaginatedStadiums(currentPage, itemsPerPage, sortBy, sortOrder, selectedCountry?.name)
    }

    const selectCountry = async (country) => {
        console.log('selectCountry country: ', country)
        selectedCountry = country
        if (country && country.name) {
            await stadiumStore.fetchPaginatedStadiums(1, itemsPerPage, sortBy, sortOrder, country.name)
        }
    }

    const onPageChange = async (page) => {
        console.log('onPageChange page: ', page)
        currentPage = page
        // update your table data here
        await stadiumStore.fetchPaginatedStadiums(page, itemsPerPage, sortBy, sortOrder, selectedCountry?.name)
    }

    const openModal = (stadium) => {
        console.log('openModal stadium: ', stadium)
        selectedStadium = stadium
        // selectedStadium = {
        //     data: ...stadium
        // }
        showModal = true
    }

    const generateRandomExponential = (min = 1, max = 54) => {
        const random = Math.random()
        const scaled = (1 - Math.sqrt(random)) * (max - min + 1) + min
        console.log('random number: ', Math.floor(scaled))
        return Math.floor(scaled)
    }
    const generateRandomExponential2 = (min = 1, max = 54) => {
        const random = Math.random()
        // Uses reciprocal to strongly favor smaller numbers
        const scaled = (1 / (random + 0.01) - 1) / (1 / 0.01 - 1) // Normalized
        console.log('random number: ', Math.floor(scaled * (max - min + 1)) + min)
        return Math.floor(scaled * (max - min + 1)) + min
    }
</script>

<svelte:head>
    <title>stadiums</title>
    <meta name="description" content="Stadiums" />
</svelte:head>

<div class="row">
    <div class="col-12 text-center my-5">
        <!-- stadiumStore.stadiums.length: {$stadiumStore.stadiums.length}<br />
        stadiumStore.paginatedStadiums.data.length: {$stadiumStore.paginatedStadiums?.data?.length}<br />
        stadiumStore.paginatedStadiums.totalCount: {$stadiumStore.paginatedStadiums?.totalCount}<br />
        $stadiumStore.paginatedStadiums?.totalPages: {$stadiumStore.paginatedStadiums?.totalPages}<br /> -->
        <!-- selectedCountry.name: {selectedCountry?.name}<br />
        sortOrder: {sortOrder}<br />
        countryStore.countries.length: {$countryStore.countries.length}<br />
        total pages: {$stadiumStore.paginatedStadiums.totalPages}<br />
        total count: {$stadiumStore.paginatedStadiums.totalCount}<br />
        <h2 class="text-center">Stadiums page</h2>
        <br />
        <a href="{base}/">Home page</a>
        <br />
        <a href="{base}/leagues">Leagues</a>
        <br />
        <a href="{base}/teams">Teams</a>
        <br />
        <br /> -->
        <!-- <a href="{base}/" class="button my-2">&larr; Home page</a> -->
        <a href="{base}/" class="primary-button">Home page</a>
    </div>
</div>

<div class="row justify-center">
    <div class="col-8 text-start">
        <h3 class="text-center my-2">Pick a country</h3>
        <div style="background: #f8f9fa; padding: 10px; border-radius: 8px;">
            {#each $countryStore.countries.sort((a, b) => a.name.localeCompare(b.name)) as country, index}
                <!-- {country.name} ({country.id}) &nbsp; &nbsp; -->
                <!-- :class="{selectedCountry?.id === country.id ? 'active' : ''}" -->
                <!-- title="{country.name}" -->
                <div class="tooltip">
                    <button type="button" class={`flag-btn mx-1 ${selectedCountry?.id === country.id ? 'active' : ''}`} onclick={() => selectCountry(country)} aria-label={`Select ${country.name}`} style="background: none; padding: 0;">
                        <img src="{base}/images/flags/{country.image || `${base}/no-image.png`}" alt={country.name} height="30" />
                    </button>
                    <span class="tooltiptext">{country.name}</span>
                </div>
            {/each}
        </div>
    </div>
</div>
<div class="row justify-center">
    <div class="col-12">
        {#if showModal}
            <Modal bind:showModal data={selectedStadium}>
                {#snippet header()}{/snippet}
            </Modal>
        {/if}
    </div>
</div>
<div class="row justify-center my-2" style="" id="table">
    <div class="col-8" style="background: #f8f9fa; padding: 10px 0px; border-radius: 8px;">
        <button onclick={() => generateRandomExponential()}>Generate random exponential</button>
        {#if selectedCountry !== null}
            <div class="row justify-center align-center">
                <img src="/images/countries/{slugify(selectedCountry.name)}_stadium.jpg" alt={selectedCountry.name} height="80" class="mx-2 border-radius-06" />
                <h2 class="text-center mx-2">
                    Stadiums in {selectedCountry?.name}
                </h2>
                <img src="/images/countries/{slugify(selectedCountry.name)}.jpg" alt={selectedCountry.name} height="80" class="mx-2 border-radius-06" />
            </div>
        {/if}
        <div class="responsive-table-container" style="">
            <table class="full-data-table" style="">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>
                            Name
                            <button class="sort-icon" onclick={() => sortTable('stadium_name')}>
                                {#if sortBy === 'stadium_name' && sortOrder === 'asc'}
                                    <SortAsc />
                                {:else if sortBy === 'stadium_name' && sortOrder === 'desc'}
                                    <SortDesc />
                                {:else}
                                    <SortAsc />
                                {/if}
                            </button>
                        </th>
                        <th>City</th>
                        <th
                            >Capacity
                            <button class="sort-icon" onclick={() => sortTable('stadium_capacity')}>
                                {#if sortBy === 'stadium_capacity' && sortOrder === 'asc'}
                                    <SortAsc />
                                {:else if sortBy === 'stadium_capacity' && sortOrder === 'desc'}
                                    <SortDesc />
                                {:else}
                                    <SortAsc />
                                {/if}
                            </button>
                        </th>
                        <th>Teams</th>
                        <th>Images</th>
                    </tr>
                </thead>
                <tbody>
                    {#each $stadiumStore.paginatedStadiums?.data as stadium, index}
                        <tr>
                            <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                            <!-- <td>{stadium.id}</td> -->
                            <td>
                                <a href={stadium.stadium_wiki} target="_blank">
                                    {stadium.stadium_name}&nbsp;<img src="{base}/images/icons/external-link.svg" width="10" alt="External link" />
                                </a>
                            </td>
                            <td>{stadium.stadium_city}</td>
                            <td>{new Intl.NumberFormat().format(stadium.stadium_capacity)}</td>
                            <td>
                                {#each stadium.teams as team, teamIndex}
                                    <!-- {team.name}{teamIndex < stadium.teams.length - 1 ? ', ' : ''} -->
                                    <div class="tooltip">
                                        <a href={team.wiki} target="_blank">
                                            <img src={team.image || `${base}/images/no-image.png`} alt={team.name} height="50" class="px-1" />
                                        </a>
                                        <span class="tooltiptext">{team.name}</span>
                                    </div>
                                {/each}
                            </td>
                            <td style="">
                                <!-- {#each stadium.images as image}
                                    <img src={image.url || `${base}/no-image.png`} alt={stadium.name} height="50" class="px-1" />
                                {/each} -->
                                <div style="display: flex; align-items: center;">
                                    <button type="button" class={`img-btn`} onclick={() => openModal(stadium)} aria-label={stadium.images[0]?.name} style="background: none; border:none; padding: 0;">
                                        <img src={stadium.images[0]?.url || `${base}/images/no-image.png`} alt={stadium.images[0]?.name} height="50" class="px-1" />
                                    </button>
                                    <span style="">({stadium.images.length})</span>
                                </div>
                            </td>
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
    .flag-btn {
        opacity: 0.3;
        border: none;
        box-sizing: border-box;
    }
    .flag-btn:hover {
        cursor: pointer;
        opacity: 1;
    }
    .flag-btn.active {
        opacity: 1;
        /* border: 4px solid red; */
    }
    .img-btn {
        border: none;
        box-sizing: border-box;
    }
    .img-btn:hover {
        cursor: pointer;
    }

    .tooltip {
        position: relative;
        display: inline-block;
    }

    .sort-icon {
        border: none;
        box-sizing: border-box;
        background: none;
    }
    .sort-icon:hover {
        cursor: pointer;
    }

    .tooltip .tooltiptext {
        visibility: hidden;
        /* width: 120px; */
        background-color: #555;
        color: #fff;
        text-align: center;
        padding: 5px 5px;
        border-radius: 6px;
        position: absolute;
        position: absolute;
        top: -50%;
        left: 50%;
        transform: translate(-50%, -50%);
        z-index: 1;
        opacity: 0;
        transition: opacity 0.3s;
    }

    .tooltip .tooltiptext::after {
        content: '';
        position: absolute;
        top: 100%;
        left: 50%;
        margin-left: -5px;
        border-width: 5px;
        border-style: solid;
        border-color: #555 transparent transparent transparent;
    }

    .tooltip:hover .tooltiptext {
        visibility: visible;
        opacity: 1;
    }

    
</style>
