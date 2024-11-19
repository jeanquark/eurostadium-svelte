import { json } from '@sveltejs/kit';
import { promises as fs } from "fs";
import { env } from '$env/dynamic/public';
import { createServerClient } from '@supabase/ssr'

export async function GET({ request }) {

    try {
        const file1 = './static/json/leagues.json';
        const leaguesFile = await fs.readFile(file1, "utf8");
        let leaguesArray = []
        if (leaguesFile.length > 0) {
            leaguesArray = JSON.parse(leaguesFile)
        }
        // console.log('leaguesArray: ', leaguesArray);

        // 1) Update Supabase DB
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

        let rowsUpdated = 0;

        for (let i = 0; i < leaguesArray.length; i++) {
            // for (let i = 0; i < 2; i++) {
            const { data: country, error: error1 } = await supabase
                .from('countries')
                .select()
                .eq('name', leaguesArray[i]['country'])
                .limit(1)
                .single()
            console.log('country: ', country);
            if (error1) {
                throw error1
            }

            if (country && country.id) {
                const { data, error: error2 } = await supabase
                    .from('leagues')
                    .upsert(
                        {
                            api_football_id: leaguesArray[i]['api_football_id'], name: leaguesArray[i]['name'], 
                            slug: leaguesArray[i]['slug'],
                            image: `/images/leagues/${country.slug}/${leaguesArray[i]['api_football_id']}.jpg`,
                            country_id: country.id,
                            is_active: true
                        }, {
                        onConflict: 'api_football_id'
                    }
                    )
                    .select()
                console.log('data: ', data);
                rowsUpdated++
                if (error2) {
                    throw error2
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