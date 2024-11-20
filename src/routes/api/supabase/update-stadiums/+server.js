import { json } from '@sveltejs/kit';
import { promises as fs } from "fs";
import { env } from '$env/dynamic/public';
import { createServerClient } from '@supabase/ssr'

export async function GET({ request }) {
    try {

        const file1 = './static/json/countries.json';
        const countriesFile = await fs.readFile(file1, "utf8");
        let countriesArray = []
        if (countriesFile.length > 0) {
            countriesArray = JSON.parse(countriesFile)
        }

        // 1) Set up Supabase DB
        const supabase = createServerClient(env.PUBLIC_SUPABASE_URL, env.PUBLIC_SUPABASE_ANON_KEY, {
            global: {
                fetch,
            },
            cookies: {
                getAll() {
                    return null
                }
            }
        })

        // console.log('countriesArray: ', countriesArray);
        let rowsUpdated = 0
        // for (let i = 0; i < countriesArray.length; i++) {
        for (let i = 0; i < 1; i++) {
            let countryTeams = []
            // const file = `./static/json/teams/${countriesArray[i].slug}.json`;
            const file = `./static/json/teams/switzerland.json`;
            const teamsFile = await fs.readFile(file, "utf8");
            if (teamsFile.length > 0) {
                countryTeams = JSON.parse(teamsFile)
            }

            // console.log('countryTeams: ', countryTeams);
            // console.log('countryTeams[0]: ', countryTeams[0]?.venue?.api_football_id);
            for (let j = 0; j < countryTeams.length; j++) {
                // for (let j = 0; j < 2; j++) {
                if (countryTeams[i] && countryTeams[i].venue && countryTeams[i].venue.api_football_id) {
                    const { data, error: error2 } = await supabase
                        .from('stadiums')
                        .upsert(
                            {
                                api_football_id: countryTeams[j]['venue']['api_football_id'],
                                name: countryTeams[j]['venue']['name'],
                                address: countryTeams[j]['venue']['address'],
                                city: countryTeams[j]['venue']['city'],
                                capacity: countryTeams[j]['venue']['capacity'],
                                surface: countryTeams[j]['venue']['surface'],
                                lat: countryTeams[j]['venue']['lat'],
                                lng: countryTeams[j]['venue']['lng'],
                                x: countryTeams[j]['venue']['x'],
                                y: countryTeams[j]['venue']['y'],
                                wiki: countryTeams[j]['venue']['wiki'],
                                is_active: true
                            },
                            {
                                onConflict: 'api_football_id'
                            }
                        )
                        .select()

                    rowsUpdated++
                    if (error2) {
                        throw error2
                    }
                }
            }
        }

        return json({
            success: true,
            total_rows_updated: rowsUpdated
        });
    } catch (error) {
        console.log('error: ', error);
        return json(new Response(error, {
            status: 404
        }))
    }
}