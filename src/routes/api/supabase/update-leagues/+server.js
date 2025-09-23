import { json } from '@sveltejs/kit';
import { promises as fs } from "fs";
import { env } from '$env/dynamic/public';
import { createServerClient } from '@supabase/ssr'

// export async function GET({ request }) {
export async function GET({ url, locals: { supabase } }) {


    try {
        const file1 = './static/json/leagues.json';
        const leaguesFile = await fs.readFile(file1, "utf8");
        let leaguesArray = []
        if (leaguesFile.length > 0) {
            leaguesArray = JSON.parse(leaguesFile)
        }
        console.log('leaguesArray: ', leaguesArray);

        let rowsUpdated = 0;

        for (let i = 0; i < leaguesArray.length; i++) {
            const { data, error: error2 } = await supabase
                .from('leagues')
                .upsert(
                    {
                        name: leaguesArray[i]['name'],
                        slug: leaguesArray[i]['slug'],
                        api_football_id: leaguesArray[i]['api_football_id'],
                        country_id: leaguesArray[i]['country_id'],
                        wiki: leaguesArray[i]['wiki'],
                        national_level: leaguesArray[i]['national_level'],
                        is_active: leaguesArray[i]['is_active']
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

            // const { data: country, error: error1 } = await supabase
            //     .from('countries')
            //     .select()
            //     .eq('name', leaguesArray[i]['country'])
            //     .limit(1)
            //     .single()
            // console.log('country: ', country);
            // if (error1) {
            //     throw error1
            // }

            // if (country && country.id) {
            //     const { data, error: error2 } = await supabase
            //         .from('leagues')
            //         .upsert(
            //             {
            //                 api_football_id: leaguesArray[i]['api_football_id'], name: leaguesArray[i]['name'], 
            //                 slug: leaguesArray[i]['slug'],
            //                 image: `/images/leagues/${country.slug}/${leaguesArray[i]['api_football_id']}.jpg`,
            //                 country_id: country.id,
            //                 wiki: leaguesArray[i]['wiki'],
            //                 is_active: true
            //             }, {
            //             onConflict: 'api_football_id'
            //         }
            //         )
            //         .select()
            //     console.log('data: ', data);
            //     rowsUpdated++
            //     if (error2) {
            //         throw error2
            //     }
            // }
        // }

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