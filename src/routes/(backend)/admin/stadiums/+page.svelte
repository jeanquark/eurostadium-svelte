<script>
    import { base } from "$app/paths";
    import { supabase } from "@lib/supabase/supabaseClient";
    import { onMount } from "svelte";
    import { goto } from "$app/navigation";
    import { page } from "$app/stores";
    import { jwtDecode } from "jwt-decode";
    import Toasts from "@components/Toasts.svelte";
    import { addToast } from "@store/toast";
    import { countryStore } from "@store/country";
    import { leagueStore } from "@store/league";
    import { stadiumStore } from "@store/stadium";
    import { counter } from "@store/count";
    import dayjs from "$lib/utils/day";
    import slugify from "@utils/slugify";

    onMount(async () => {
        if ($countryStore.countries.length < 2) {
            await countryStore.fetchCountries();
        }
    });

    // let selectedCountry = $state(null);
    // let selectedLeague = $state(null);
    let loading = $state(false);

    const selectCountry = (country) => {
        try {
            console.log("selectCountry league: ", country);
            if (country.id === $countryStore.country?.id) {
                countryStore.setCountry(null);
                return;
            }
            countryStore.setCountry(country);
            leagueStore.fetchLeaguesByCountryId(country.id);
        } catch (error) {
            console.log("error: ", error);
        }
    };
    const selectLeague = (league) => {
        try {
            console.log("selectLeague value: ", league);
            if (league.id === $leagueStore.league?.id) {
                leagueStore.setLeague(null);
                return;
            }
            leagueStore.setLeague(league);
            stadiumStore.fetchStadiumsByLeagueId(league.id);
        } catch (error) {
            console.log("error: ", error);
        }
    };
    const fetchLeagueTeams = async () => {
        try {
            console.log("fetchLeagueTeams");
            const season = 2025;

            // 1) Retrieve country start and end index from countries.json
            const response1 = await fetch("/json/countries.json");
            const countriesJSONFile = await response1.json();
            const country = countriesJSONFile.find(
                (c) => c.name === $countryStore.country?.name
            );
            console.log("country: ", country);
            if (!country) {
                console.error("Country not found in countries.json");
                return;
            }
            // return
            const countryStartIndex = country.index; // Replace with actual start index
            const countryEndIndex = country.index; // Replace with actual end index

            if (countryEndIndex - countryStartIndex > 1) {
                addToast({
                    type: "error",
                    message: `Country "${country.name}" has too many teams to fetch at once. Please select a smaller range.`,
                });
                return;
            }

            // 2) Fetch teams by country from API Football and update static/json/teams/[COUNTRY_NAME].json file
            const baseUrl = $page.url.origin;
            // console.log('baseUrl: ', baseUrl);
            const response = await fetch(
                `${baseUrl}/api/api-football/fetch-teams?season=${season}&countryStartIndex=${countryStartIndex}&countryEndIndex=${countryEndIndex}`
            );
            // console.log("response: ", response);
            const data = await response.json();
            // console.log("data: ", data);
            addToast({
                type: "success",
                message: `Updated teams for country "${country.name}" and season "${season}" from API Football in json file.`,
            });
        } catch (error) {
            console.log("error: ", error);
        }
    };

    const updateTeams = async () => {
        try {
            console.log("updateTeams");
            const countrySlug = slugify($countryStore.country?.name);

            // 1) Fetch teams from static/json/teams/[country].json file
            const response2 = await fetch(`/json/teams/${countrySlug}.json`);
            // console.log("response2: ", response2);
            const teamsJSONFile = await response2.json();
            console.log("teamsJSONFile: ", teamsJSONFile);
            // return

            for (let i = 0; i < teamsJSONFile.length; i++) {
                const teamJSONData = teamsJSONFile[i];
                console.log("teamJSONData: ", teamJSONData);

                const { data: existingTeam, error: error1 } = await supabase
                    .from("teams")
                    .select("*")
                    .eq("api_football_id", teamJSONData.team.api_football_id)
                    .single();
                console.log("existingTeam: ", existingTeam);

                // 2) If team does not exist, insert it
                if (!existingTeam) {
                    console.warn(
                        `Team "${teamJSONData.team.name}" not found in DB, insert it.`
                    );
                    addToast({
                        type: "warning",
                        message: `Team "${teamJSONData.team.name}" not found in DB, insert it`,
                    });

                    // 2.1) First insert venue if it doesn't exist
                    const { data: existingVenue, error: error2 } =
                        await supabase
                            .from("stadiums")
                            .select("*")
                            .eq(
                                "api_football_id",
                                teamJSONData.venue.api_football_id
                            )
                            .single();
                    console.log("existingVenue: ", existingVenue);
                    if (!existingVenue) {
                        console.warn(
                            `Venue "${teamJSONData.venue.name}" not found in DB, insert it.`
                        );

                        const { data: insertedVenue, error: insertVenueError } =
                            await supabase
                                .from("stadiums")
                                .insert({
                                    api_football_id:
                                        teamJSONData.venue.api_football_id,
                                    name: teamJSONData.venue.name,
                                    city: teamJSONData.venue.city,
                                    capacity: teamJSONData.venue.capacity,
                                    wiki: teamJSONData.venue.wiki,
                                    surface: teamJSONData.venue.surface,
                                    lat: teamJSONData.venue.lat,
                                    lng: teamJSONData.venue.lng,
                                    x: teamJSONData.venue.x,
                                    y: teamJSONData.venue.y,
                                    is_active: true,
                                })
                                .select();
                        if (insertVenueError) {
                            console.error(
                                "Insert venue error: ",
                                insertVenueError
                            );
                        } else {
                            console.log("Inserted venue: ", insertedVenue);
                        }
                    }

                    // 2.2) Insert team
                    const { data: insertedData, error: insertError } =
                        await supabase
                            .from("teams")
                            .insert({
                                api_football_id:
                                    teamJSONData.team.api_football_id,
                                api_football_venue_id:
                                    teamJSONData.venue.api_football_id,
                                api_football_league_id:
                                    teamJSONData.league.api_football_id,
                                name: teamJSONData.team.name,
                                slug: slugify(teamJSONData.team.name),
                                code: teamJSONData.team.code,
                                founded: teamJSONData.team.founded,
                                wiki: teamJSONData.team.wiki,
                                is_active: true,
                            })
                            .select();
                    if (insertError) {
                        console.error("Insert error: ", insertError);
                    } else {
                        console.log("Inserted team: ", insertedData);
                    }
                } else {
                    // 3.3) If team already exists, update league ID
                    console.log(
                        `Team "${teamJSONData.team.name}" already exists in DB, simply update league id.`
                    );
                    const leagueId =
                        teamJSONData.league.api_football_id || null;

                    const { data: updatedData, error: updateError } =
                        await supabase
                            .from("teams")
                            .update({
                                api_football_league_id: leagueId,
                                updated_at: new Date().toISOString(),
                            })
                            .eq(
                                "api_football_id",
                                teamJSONData.team.api_football_id
                            )
                            .select();
                    if (updateError) {
                        console.error("Update error: ", updateError);
                    } else {
                        console.log("Update team: ", updatedData);
                    }
                }
            }
            addToast({
                type: "success",
                message: `Updated teams for country "${$countryStore.country?.name}"`,
            });
        } catch (error) {
            console.log("error: ", error);
        }
    };

    const updateStorageUrl = async () => {
        try {
            console.log("updateStorageUrl");
            const baseUrl = $page.url.origin;
            const countrySlug = slugify($countryStore.country?.name);
            console.log("countrySlug: ", countrySlug);
            // return;

            const response = await fetch(
                `${baseUrl}/api/supabase/set-images-public-url?country=${countrySlug}`
            );
            const data = await response.json();
            console.log("data: ", data);
            addToast({
                type: "success",
                message: `Updated storage url for country "${$countryStore.country?.name}"`,
            });
        } catch (error) {
            console.log("error: ", error);
        }
    };
</script>

<div class="container">
    <h2 class="text-center">Stadiums</h2>
    <!-- selectedCountry: {selectedCountry ? selectedCountry.name : "None"}<br /> -->
    <!-- selectedLeague: {selectedLeague ? selectedLeague.name : "None"}<br /> -->
    <!-- $stadiumStore.stadiums.length: {$stadiumStore.stadiums?.length}<br /> -->
    <!-- $leagueStore.leaguesByCountryId.length: {$leagueStore.leaguesByCountryId?.length}<br /> -->
    <!-- <p>CountryStore.country.id: {$countryStore.country?.id}</p> -->
    <!-- <p>LeagueStore.league: {$leagueStore.league?.name}</p> -->

    <br /><br />

    <div class="row my-2">
        <div class="col-12">
            <h3 class="my-2">Select a country</h3>
            {#each $countryStore.countries as country, index}
                <button
                    class="btn btn-outline-secondary btn-sm ma-1 {$countryStore
                        .country?.id === country.id && 'active'}"
                    onclick={() => {
                        selectCountry(country);
                    }}>{country.name}</button
                >
            {/each}
        </div>
    </div>
    {#if $countryStore.country?.id}
        <div class="row my-2">
            <div class="col-6">
                <h3 class="my-2">Select a league</h3>
                {#each $leagueStore.leaguesByCountryId as league, index}
                    <button
                        class="btn btn-outline-primary btn-sm ma-1 {$leagueStore
                            .league?.id === league.id && 'active'}"
                        onclick={() => {
                            selectLeague(league);
                        }}>{league.name}</button
                    >
                {/each}
            </div>
            <div class="col-6">
                <h4 class="my-2">
                    Actions on {$countryStore.country?.name}'s data
                </h4>

                <button
                    class="btn btn-outline-primary btn-sm ma-1"
                    onclick={fetchLeagueTeams}
                >
                    Fetch teams
                </button>
                <small>
                    <i
                        >This will fetch teams for {$countryStore.country?.name}
                        from Football-API and update the static/json/teams/[country].json
                        file.</i
                    ></small
                ><br />
                <button
                    class="btn btn-outline-primary btn-sm ma-1"
                    onclick={updateTeams}
                >
                    Update teams
                </button>
                <small>
                    <i
                        >This will update teams in Supabase DB for {$countryStore.country?.name} and provide each of them with their current league ID.</i
                    ></small
                ><br />
                <button
                    class="btn btn-outline-primary btn-sm ma-1"
                    onclick={updateStorageUrl}
                >
                    Update storage url
                </button>
                <small>
                    <i
                        >This will update the image url field in Supabase DB images
                        table for each image stored in {$countryStore.country
                            ?.name}
                        folder of Supabase storage</i
                    ></small
                >
            </div>
        </div>
    {/if}

    <br /><br />

    <div class="row">
        <div class="col-12">
            <div class="responsive-table-container">
                <table class="full-data-table">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>ID</th>
                            <th>Name</th>
                            <th>City</th>
                            <th>Capacity</th>
                            <th>Nb. d'images</th>
                            <th>Images</th>
                        </tr>
                    </thead>
                    <tbody>
                        {#each $stadiumStore.stadiumsByLeagueId[$leagueStore.league?.id] as stadium, index}
                            <tr>
                                <td>{index + 1}</td>
                                <td>{stadium.id}</td>
                                <td
                                    ><a href="/admin/stadiums/{stadium.id}"
                                        >{stadium.name}</a
                                    ></td
                                >
                                <td>{stadium.city}</td>
                                <td>{stadium.capacity}</td>
                                <td>{stadium.images.length}</td>
                                <td>
                                    {#each stadium.images as image, i}
                                        <img
                                            src={image.url}
                                            alt={image.name}
                                            height="50"
                                            class="px-1"
                                        />
                                    {/each}</td
                                >
                            </tr>
                        {/each}
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</div>

<style>
    .btn.active {
        background-color: #007bff;
        color: white;
    }
    .responsive-table-container {
        width: 100%;
        overflow-x: auto;
        margin: 20px 0;
        border: 1px solid #ddd;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        -webkit-overflow-scrolling: touch; /* Smooth scrolling on iOS */
    }

    .full-data-table {
        width: auto; /* Changed from 100% to auto */
        min-width: 100%; /* Ensures table is at least as wide as container */
        border-collapse: collapse;
    }

    .full-data-table th,
    .full-data-table td {
        padding: 12px 15px;
        text-align: left;
        border-bottom: 1px solid #ddd;
        height: 50px; /* Fixed row height */
        vertical-align: middle;
        white-space: nowrap; /* Keeps content on one line */
        /* Removed overflow: hidden and text-overflow: ellipsis */
    }

    .full-data-table th {
        background-color: #f8f9fa;
        position: sticky;
        top: 0;
        font-weight: bold;
    }

    .full-data-table tr:nth-child(even) {
        background-color: #f9f9f9;
    }

    .full-data-table tr:hover {
        background-color: #f1f1f1;
    }

    /* Responsive adjustments */
    @media (max-width: 768px) {
        .full-data-table th,
        .full-data-table td {
            padding: 8px 10px;
            height: 40px;
        }
    }
</style>
