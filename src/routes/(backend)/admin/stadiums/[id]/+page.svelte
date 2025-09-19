<script>
    import { base } from "$app/paths";
    import { supabase } from "@lib/supabase/supabaseClient";
    import { onMount } from "svelte";
    import { addToast } from "@store/toast";
    import { page } from "$app/stores";
    import slugify from "@utils/slugify";

    onMount(async () => {
        try {
            const { data, error } = await supabase
                .from("stadiums_with_images_view")
                .select(`*`)
                .eq("id", $page.params.id);
            if (error) {
                console.error("Error fetching stadium data:", error);
                addToast({
                    type: "error",
                    message: "Failed to load stadium data.",
                });
                return;
            }
            console.log("data: ", data);
            if (data.length === 0) {
                addToast({
                    type: "info",
                    message: "No teams found for this stadium.",
                });
            } else {
                // Process the data as needed
                console.log("Images in stadium:", data);
                stadiumData = data[0];
            }
        } catch (error) {
            console.log("error: ", error);
        }
    });

    let stadiumData = {};
</script>

<div class="container">
    <div class="row">
        <div class="col-12">
            <a href="{base}/admin/stadiums" class="">&larr; Back to Stadiums</a>
        </div>
    </div>

    <div class="row">
        <div class="col-12">
            <h2 class="text-center my-2">{stadiumData?.stadium_name}</h2>
        </div>
    </div>
    <div class="row">
        <div class="col-12">
            <table class="table table-striped">
                <tbody>
                    <tr>
                        <th>ID</th>
                        <td>{stadiumData?.id}</td>
                    </tr>
                    <tr>
                        <th>API Football Venue ID</th>
                        <td>{stadiumData?.api_football_venue_id}</td>
                    </tr>
                    <tr>
                        <th>City</th>
                        <td>{stadiumData?.stadium_city}</td>
                    </tr>
                    <tr>
                        <th>Capacity</th>
                        <td>{stadiumData?.stadium_capacity}</td>
                    </tr>
                    <tr>
                        <th>Wiki</th>
                        <td
                            ><a href={stadiumData?.stadium_wiki} target="_blank"
                                >{stadiumData?.stadium_wiki}</a
                            ></td
                        >
                    </tr>
                    <tr>
                        <th>Team Name</th>
                        <td>
                            {#each stadiumData?.teams as team}<span
                                    >{team.name},
                                </span>{/each}</td
                        >
                    </tr>
                    <tr>
                        <th>League Name</th>
                        <td>{stadiumData?.league_name}</td>
                    </tr>
                    <tr>
                        <th>Country Name</th>
                        <td>{stadiumData?.country_name}</td>
                    </tr>
                    <tr>
                        <th>X</th>
                        <td>{stadiumData?.stadium_x}</td>
                    </tr>
                    <tr>
                        <th>Y</th>
                        <td>{stadiumData?.stadium_y}</td>
                    </tr>
                    <tr>
                        <th>Images</th>
                        <td
                            >{#each stadiumData?.images as image}
                                <img
                                    src={`/images/stadiums/${slugify(stadiumData.country_name)}/${image.name}`}
                                    width="200"
                                    alt="{image.name}"
                                    class="img-fluid mx-2"
                                />
                            {/each}</td
                        >
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</div>

<style>
</style>
