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
        // console.log('countriesArray: ', countriesArray);
        let rowsUpdated = 0
        for (let i = 0; i < countriesArray.length; i++) {
            let countryTeams = []
            const file = `./static/json/teams/${countriesArray[i].slug}.json`;
            const teamsFile = await fs.readFile(file, "utf8");
            if (teamsFile.length > 0) {
                countryTeams = JSON.parse(teamsFile)
            }

            // console.log('countryTeams: ', countryTeams);
            // console.log('countryTeams[0]: ', countryTeams[0]?.venue?.api_football_id);
            // for (let j = 0; j < countryTeams.length; j++) {
            for (let j = 0; j < 2; j++) {
                if (countryTeams[i] && countryTeams[i].venue && countryTeams[i].venue.api_football_id) {
                    const { data, error: error2 } = await supabase
                        .from('stadiums')
                        .upsert(
                            {
                                api_football_id: countryTeams[i]['venue']['api_football_id'], 
                                name: countryTeams[i]['venue']['name'],
                                address: countryTeams[i]['venue']['address'],
                                city: countryTeams[i]['venue']['city'],
                                capacity: countryTeams[i]['venue']['capacity'],
                                surface: countryTeams[i]['venue']['surface'],
                                lat: countryTeams[i]['venue']['lat'],
                                lng: countryTeams[i]['venue']['lng'],
                                x: countryTeams[i]['venue']['x'],
                                y: countryTeams[i]['venue']['y'],
                                wiki: countryTeams[i]['venue']['wiki'],
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
                return json({
                    success: true,
                    total_rows_updated: rowsUpdated
                });
            }
        }
    } catch (error) {
        console.log('error: ', error);
        return json(new Response(error, {
            status: 404
        }))
    }
}