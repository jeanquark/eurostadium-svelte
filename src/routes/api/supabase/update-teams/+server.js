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
            const file = `./static/json/teams/austria.json`;
            const teamsFile = await fs.readFile(file, "utf8");
            if (teamsFile.length > 0) {
                countryTeams = JSON.parse(teamsFile)
            }

            // console.log('countryTeams: ', countryTeams);
            // console.log('countryTeams[0]: ', countryTeams[0]?.venue?.api_football_id);
            for (let j = 0; j < countryTeams.length; j++) {
            // for (let j = 0; j < 2; j++) {
                if (countryTeams[j] && countryTeams[j].team && countryTeams[j].team.api_football_id) {
                    console.log('countryTeams[j].team.api_football_id: ', countryTeams[j].team.api_football_id);
                    // const { data: league, error: error1 } = await supabase
                    //     .from('leagues')
                    //     .select()
                    //     .eq('api_football_id', countryTeams[i]['league']['api_football_id'])
                    //     .limit(1)
                    //     .single()

                    // if (error1) {
                    //     throw error1
                    // }

                    // if (!league) {
                    //     continue;
                    // }
                    // const { data: venue, error: error2 } = await supabase
                    //     .from('stadiums')
                    //     .select()
                    //     .eq('api_football_id', countryTeams[i]['venue']['api_football_id'])
                    //     .limit(1)
                    //     .single()

                    // if (error2) {
                    //     throw error2
                    // }
                    // if (!venue) {
                    //     continue;
                    // }
                    const { data, error: error3 } = await supabase
                        .from('teams')
                        .upsert(
                            {
                                api_football_id: countryTeams[j]['team']['api_football_id'],
                                name: countryTeams[j]['team']['name'],
                                code: countryTeams[j]['team']['code'],
                                founded: countryTeams[j]['team']['founded'],
                                image: `/images/teams/${countryTeams[j]['team']['name']}.png`,
                                api_football_league_id: countryTeams[j]['league']['api_football_id'] ? countryTeams[j]['league']['api_football_id'] : null,
                                // api_football_league_id: country.api_football_id,
                                api_football_venue_id: countryTeams[j]['venue']['api_football_id'],
                                // api_football_venue_id: venue.api_football_id,
                                is_active: true
                            },
                            {
                                onConflict: 'api_football_id'
                            }
                        )
                        .select()
                    rowsUpdated++

                    if (error3) {
                        throw error3
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