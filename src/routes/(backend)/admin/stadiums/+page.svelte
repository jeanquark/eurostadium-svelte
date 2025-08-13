<script>
    import { base } from '$app/paths'
    import { supabase } from '@lib/supabase/supabaseClient'
    import { onMount } from 'svelte'
    import { goto } from '$app/navigation'
    import { jwtDecode } from 'jwt-decode'
    import { addToast } from '@store/toast'
    import Toasts from '@components/Toasts.svelte'
    import { countryStore } from '@store/country'
    import { leagueStore } from '@store/league'
    import { stadiumStore } from '@store/stadium'
    import { counter } from '@store/count'
    import dayjs from '$lib/utils/day'
    // import { Link } from '$lib/navigation';

    onMount(async () => {
        if ($countryStore.countries.length < 2) {
            await countryStore.fetchCountries()
        }
    })

    let selectedCountry = $state(null)
    let selectedLeague = $state(null)
    let loading = $state(false)

    const fetchStadiums = async () => {
        try {
            await stadiumStore.fetchUsers()
        } catch (error) {
            console.log('error: ', error)
        }
    }

    const selectCountry = (value) => {
        try {
            console.log('selectCountry value: ', value)
            selectedCountry = value
            // countryStore.country = value
            // countryStore.set({
            //     country: value})
            countryStore.setCountry(value)
            leagueStore.fetchLeaguesByCountryId(selectedCountry.id)
        } catch (error) {
            console.log('error: ', error)
        }
    }
    const selectLeague = (value) => {
        try {
            console.log('selectLeague value: ', value)
            selectedLeague = value
            leagueStore.setLeague(value)
            stadiumStore.fetchStadiumsByLeagueId(selectedLeague.id)
        } catch (error) {
            console.log('error: ', error)
        }
    }
</script>

<div class="container">
    <h2 class="text-center">Stadiums</h2>
    selectedCountry: {selectedCountry ? selectedCountry.name : 'None'}<br />
    selectedLeague: {selectedLeague ? selectedLeague.name : 'None'}<br />
    $stadiumStore.stadiums.length: {$stadiumStore.stadiums?.length}<br />
    $leagueStore.leaguesByCountryId.length: {$leagueStore.leaguesByCountryId?.length}<br />
    <p>CountryStore.country.id: {$countryStore.country?.id}</p>
    <p>LeagueStore.league: {$leagueStore.league?.name}</p>
    <br /><br />

    <h3 class="my-2">Select country</h3>
    {#each $countryStore.countries as country, index}
        <button
            class="btn btn-filter {$countryStore.country?.id === country.id && 'active'}"
            onclick={() => {
                selectCountry(country)
            }}>{country.name}</button
        >
    {/each}

    <h3 class="my-2">Select league</h3>
    {#each $leagueStore.leaguesByCountryId as league, index}
        <button
            class="btn ma-1 {$leagueStore.league?.id === league.id && 'active'}"
            onclick={() => {
                selectLeague(league)
            }}>{league.name}</button
        >
    {/each}

    <br /><br />

    <table>
        <thead>
            <tr>
                <th>ID</th>
                <th>Name</th>
                <th>City</th>
                <th>Capacity</th>
                <th>Nb. d'images</th>
                <th>Images</th>
                <th>Created at</th>
                <th>Last update</th>
            </tr>
        </thead>
        <tbody>
            <!-- {#each $stadiumStore.stadiumsByLeagueId[selectedLeague?.id] as stadium, index} -->
            {#each $stadiumStore.stadiumsByLeagueId[$leagueStore.league?.id] as stadium, index}
                <tr>
                    <td>{stadium.id}</td>
                    <td><a href="/admin/stadiums/{stadium.id}">{stadium.name}</a></td>
                    <td>{stadium.city}</td>
                    <td>{stadium.capacity}</td>
                    <td>{stadium.images.length}</td>
                    <td>
                        {#each stadium.images as image, i}
                            <img src={image.url} alt={image.name} width="50" />
                        {/each}</td
                    >
                    <td>{dayjs(stadium.inserted_at).format('ddd DD MMM YYYY')}</td>
                    <td>{dayjs(stadium.updated_at).fromNow()}</td>
                </tr>
            {/each}
        </tbody>
    </table>
</div>

<style>
    .btn.active {
        background-color: #007bff;
        color: white;
    }
</style>
