<script>
    import { base } from "$app/paths";
    import { supabase } from "@lib/supabase/supabaseClient";
    import { onMount } from "svelte";
    import { page } from "$app/stores";
    import Toasts from "@components/Toasts.svelte";
    import { addToast } from "@store/toast";
    import { countryStore } from "@store/country";
    import { leagueStore } from "@store/league";
    import { stadiumStore } from "@store/stadium";
    import dayjs from "$lib/utils/day";
    import slugify from "@utils/slugify";

    onMount(async () => {
        try {
            if ($countryStore.countries.length < 2) {
                await countryStore.fetchCountries();
            }
        } catch (error) {
            console.log("error: ", error);
        }
    });
    let loadingFetchLeagueTeams = $state(false);
    let loadingUpdateTeams = $state(false);
    let loadingUpdateStadiums = $state(false);
    let loadingUpdateImages = $state(false);
    let loadingUpdateStorageUrl = $state(false);
    let loadingUpdateCoordinates = $state(false);

    const selectCountry = (country) => {
        try {
            console.log("selectCountry league: ", country);
            if (country.id === $countryStore.country?.id) {
                countryStore.setCountry(null);
                return;
            }
            countryStore.setCountry(country);
            leagueStore.fetchLeaguesByCountryId(country.id);
            // stadiumStore.stadiumsByLeagueId = {};
            leagueStore.setLeague(null);
            stadiumStore.clearStadiums();
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
            // stadiumStore.fetchStadiumsByLeagueId(league.id);
            stadiumStore.fetchStadiumsByApiFootballLeagueId(
                league.api_football_id
            );
        } catch (error) {
            console.log("error: ", error);
        }
    };
    const fetchLeagueTeams = async () => {
        try {
            console.log("fetchLeagueTeams");
            loadingFetchLeagueTeams = true;
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
            if (!response.ok) {
                throw new Error(`Could not fetch teams for ${country.name} from API Football.`);
            }
            const data = await response.json();
            console.log("data: ", data);
            addToast({
                type: "success",
                message: `Updated teams for country "${country.name}" and season "${season}" with data from API Football. Check /teams/(${slugify(country.name)}).json.`,
            });
        } catch (error) {
            console.log("error: ", error);
            addToast({
                type: "error",
                message: error,
            });
        } finally {
            loadingFetchLeagueTeams = false;
        }
    };

    const updateStadiums = async () => {
        try {
            console.log("updateStadiums");
            loadingUpdateStadiums = true;
            const countrySlug = slugify($countryStore.country?.name);

            // 1) Fetch teams from static/json/teams/[country].json file
            const response = await fetch(`/json/teams/${countrySlug}.json`);
            // console.log("response: ", response);
            const teamsJSONFile = await response.json();
            console.log("teamsJSONFile: ", teamsJSONFile);
            // return

            for (let i = 0; i < teamsJSONFile.length; i++) {
                const teamJSONData = teamsJSONFile[i];
                console.log("teamJSONData: ", teamJSONData);

                const { data: insertedVenue, error: insertVenueError } =
                    await supabase
                        .from("stadiums")
                        .upsert(
                            {
                                // id: existingVenue.id,
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
                            },
                            { onConflict: "api_football_id" }
                        )
                        .select();
                if (insertVenueError) {
                    console.error("Insert venue error: ", insertVenueError);
                } else {
                    console.log("Inserted venue: ", insertedVenue);
                    addToast({
                        type: "success",
                        message: `Stadium "${teamJSONData.venue.name}" was inserted successfully.`,
                    });
                }
                // }
            }
        } catch (error) {
            console.log("error: ", error);
        } finally {
            loadingUpdateStadiums = false;
        }
    };

    const updateTeams = async () => {
        try {
            console.log("updateTeams");
            loadingUpdateTeams = true;
            const countrySlug = slugify($countryStore.country?.name);

            // 1) Fetch teams from static/json/teams/[country].json file
            const response = await fetch(`/json/teams/${countrySlug}.json`);
            // console.log("response: ", response);
            const teamsJSONFile = await response.json();
            console.log("teamsJSONFile: ", teamsJSONFile);
            // return

            for (let i = 0; i < teamsJSONFile.length; i++) {
                const teamJSONData = teamsJSONFile[i];
                console.log("teamJSONData: ", teamJSONData);

                const { data: upsertedData, error: upsertTeamError } =
                    await supabase
                        .from("teams")
                        .upsert(
                            {
                                // id: existingTeam.id,
                                api_football_id:
                                    teamJSONData.team.api_football_id,
                                api_football_venue_id:
                                    teamJSONData.venue.api_football_id,
                                api_football_league_id:
                                    teamJSONData.league.api_football_id,
                                name: teamJSONData.team.name,
                                slug: slugify(teamJSONData.team.name),
                                image: `/images/teams/${countrySlug}/${teamJSONData.team.api_football_id}.png`,
                                code: teamJSONData.team.code,
                                founded: teamJSONData.team.founded,
                                wiki: teamJSONData.team.wiki,
                                is_active: true,
                            },
                            { onConflict: "api_football_id" }
                        )
                        // .onConflict('api_football_id')
                        .select();
                if (upsertTeamError) {
                    console.error("Upsert error: ", upsertTeamError);
                } else {
                    console.log("Upserted team: ", upsertedData);
                    addToast({
                        type: "success",
                        message: `Team "${teamJSONData.team.name}" was inserted successfully.`,
                    });
                }
            }
            addToast({
                type: "success",
                message: `Updated teams for country "${$countryStore.country?.name}"`,
            });
        } catch (error) {
            console.log("error: ", error);
        } finally {
            loadingUpdateTeams = false;
        }
    };


    const updateImages = async () => {
        try {
            console.log("updateImages");
            loadingUpdateImages = true;
            const countrySlug = slugify($countryStore.country?.name);

            // 1) Fetch teams from static/json/teams/[country].json file
            const response = await fetch(`/json/teams/${countrySlug}.json`);
            // console.log("response: ", response);
            const teamsJSONFile = await response.json();
            console.log("teamsJSONFile: ", teamsJSONFile);

            for (let i = 0; i < teamsJSONFile.length; i++) {
                let imagesCount = 0;
                for (let j = 0; j < teamsJSONFile[i].images.length; j++) {
                    const { data: upsertedData, error: upsertImageError } =
                        await supabase
                            .from("images")
                            .upsert(
                                {
                                    api_football_venue_id:
                                        teamsJSONFile[i]["venue"][
                                            "api_football_id"
                                        ],
                                    name: teamsJSONFile[i]["images"][j]["name"],
                                    source: teamsJSONFile[i]["images"][j][
                                        "source"
                                    ],
                                    width: 0,
                                    height: 0,
                                    display_order: teamsJSONFile[i]["images"][j][
                                        "display_order"
                                    ]
                                        ? teamsJSONFile[i]["images"][j][
                                              "display_order"
                                          ]
                                        : j + 1,
                                    is_active: true,
                                },
                                {
                                    onConflict: "name",
                                }
                            )
                            .select();
                    if (upsertImageError) {
                        console.error("Upsert error: ", upsertImageError);
                    } else {
                        imagesCount++;
                        console.log("Upserted image: ", upsertedData);
                    }
                }
                addToast({
                    type: "success",
                    message: `${imagesCount} images for stadium "${teamsJSONFile[i].team?.name}" were inserted.`,
                });
            }
        } catch (error) {
            console.log("error: ", error);
        } finally {
            loadingUpdateImages = false;
        }
    };

    const updateStorageUrl = async () => {
        try {
            console.log("updateStorageUrl");
            loadingUpdateStorageUrl = true;
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
        } finally {
            loadingUpdateStorageUrl = false;
        }
    };

    const calculateSVGCoordinates = async () => {
        try {
            console.log("calculateSVGCoordinates");
            loadingUpdateCoordinates = true;
            const baseUrl = $page.url.origin;
            const countrySlug = slugify($countryStore.country?.name);
            console.log("countrySlug: ", countrySlug);
            // return;

            const response = await fetch(
                `${baseUrl}/api/calculate-svg-coord?country=${countrySlug}`
            );
            const data = await response.json();
            console.log("data: ", data);
            addToast({
                type: "success",
                message: `Updated stadiums x & y coord for country "${$countryStore.country?.name}"`,
            });
        } catch (error) {
            console.log("error: ", error);
        } finally {
            loadingUpdateCoordinates = false;
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
    <!-- loadingFetchLeagueTeams: {loadingFetchLeagueTeams}<br /> -->
    <!-- <br /><br /> -->

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
            <div class="col-12">
                <h4 class="my-2">
                    Actions on {$countryStore.country?.name}'s data
                </h4>

                <button
                    class={`btn btn-outline-warning btn-sm ma-1 ${loadingFetchLeagueTeams == true ? "loading disabled" : ""}`}
                    onclick={fetchLeagueTeams}
                >
                    Fetch teams
                </button>
                <small>
                    <i
                        >This will fetch teams for {$countryStore.country?.name}
                        from Football-API and update the static/json/teams/{slugify(
                            $countryStore.country?.name
                        )}.json file.</i
                    ></small
                ><br />
                <button
                    class={`btn btn-outline-warning btn-sm ma-1 ${loadingUpdateCoordinates ? "loading disabled" : ""}`}
                    onclick={calculateSVGCoordinates}
                >
                    Calculate x and y coordinates
                </button>
                <small>
                    <i
                        >This will update the x and y values for stadiums in
                        static/json/teams/{slugify(
                            $countryStore.country?.name
                        )}.json file.</i
                    ></small
                ><br />
                <button
                    class={`btn btn-outline-primary btn-sm ma-1 ${loadingUpdateStadiums ? "loading disabled" : ""}`}
                    onclick={updateStadiums}
                >
                    Update stadiums
                </button>
                <small>
                    <i
                        >This will update stadiums in Supabase DB for {$countryStore
                            .country?.name} (long process).</i
                    ></small
                ><br />
                <button
                    class={`btn btn-outline-primary btn-sm ma-1 ${loadingUpdateTeams ? "loading disabled" : ""}`}
                    onclick={updateTeams}
                >
                    Update teams
                </button>
                <small>
                    <i
                        >This will update teams in Supabase DB for {$countryStore
                            .country?.name} and provide each of them with their current
                        league ID (long process).</i
                    ></small
                ><br />
                <button
                    class={`btn btn-outline-primary btn-sm ma-1 ${loadingUpdateImages ? "loading disabled" : ""}`}
                    onclick={updateImages}
                >
                    Update images
                </button>
                <small>
                    <i
                        >This will insert images in Supabase DB for {$countryStore
                            .country?.name} if not existing (long process).</i
                    ></small
                ><br />
                <button
                    class={`btn btn-outline-primary btn-sm ma-1 ${loadingUpdateStorageUrl ? "loading disabled" : ""}`}
                    onclick={updateStorageUrl}
                >
                    Update storage url
                </button>
                <small>
                    <i
                        >This will update the image url field in Supabase DB
                        images table for each image stored in {slugify(
                            $countryStore.country?.name
                        )}
                        folder of Supabase storage (long process).</i
                    ></small
                >
            </div>
            <div class="col-12">
                <h3 class="my-2">Select a league for {$countryStore.country?.name}</h3>
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
        </div>
    {/if}

    <h3 class="text-left">Teams</h3>

    <div class="row" style="">
        <div class="col-12" style="">
            <div class="responsive-table-container" style="">
                <table class="full-data-table" style="">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>ID</th>
                            <th>Stadium name</th>
                            <th>City</th>
                            <th>Capacity</th>
                            <th>X coord</th>
                            <th>Y coord</th>
                            <th>Teams</th>
                            <th>Nb. d'images</th>
                            <th>Images</th>
                        </tr>
                    </thead>
                    <tbody>
                        {#each $stadiumStore.stadiumsByLeagueId[$leagueStore.league?.api_football_id] as stadium, index}
                            <tr>
                                <td>{index + 1}</td>
                                <td>{stadium.id}</td>
                                <td
                                    ><a href="/admin/stadiums/{stadium.id}"
                                        >{stadium.stadium_name}</a
                                    ></td
                                >
                                <td>{stadium.stadium_city}</td>
                                <td>{stadium.stadium_capacity}</td>
                                <td>{stadium.stadium_x}</td>
                                <td>{stadium.stadium_y}</td>
                                <td>
                                    {#each stadium.teams as team, teamIndex}
                                        {team.name}{teamIndex < stadium.teams.length - 1 ? ", " : ""}
                                    {/each}
                                </td>
                                <td
                                    ><span
                                        class={stadium.images.length < 1
                                            ? "text-error"
                                            : ""}>{stadium.images.length}</span
                                    ></td
                                >
                                <td>
                                    {#each stadium.images as image, i}
                                        <!-- <img
                                            src={image.url}
                                            alt={image.name}
                                            height="50"
                                            class="px-1"
                                        /> -->
                                        <img
                                            src={`/images/stadiums/${slugify($countryStore.country?.name)}/${image.name}`}
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
</style>
