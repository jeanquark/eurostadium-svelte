import { json } from '@sveltejs/kit';
import { promises as fs } from "fs";
import { env } from '$env/dynamic/public';
import { createServerClient } from '@supabase/ssr'
import slugify from '@utils/slugify';

export async function GET({ url, locals: { supabase } }) {
    try {
        const countrySlug = slugify(url.searchParams.get('country'))
        console.log('countrySlug: ', countrySlug)

        if (!countrySlug) {
            return json({
                success: false,
                message: 'Specify country in url params: "/api/supabase/update-images?country=[COUNTRY_SLUG]"'
            });
        }

        // // 1) Set up Supabase DB
        // const supabase = createServerClient(env.PUBLIC_SUPABASE_URL, env.PUBLIC_SUPABASE_ANON_KEY, {
        //     global: {
        //         fetch,
        //     },
        //     cookies: {
        //         getAll() {
        //             return null
        //         }
        //     }
        // })

        let rowsUpdated = 0
        let countryTeams = []

        const file = `./static/json/teams/${countrySlug}.json`;
        const teamsFile = await fs.readFile(file, "utf8");
        if (teamsFile.length > 0) {
            countryTeams = JSON.parse(teamsFile)
        }

        for (let i = 0; i < countryTeams.length; i++) {
            if (countryTeams[i] && countryTeams[i].venue && countryTeams[i].images) {
                for (let j = 0; j < countryTeams[i]['images'].length; j++) {
                    const { data, error: error1 } = await supabase
                        .from('images')
                        .upsert(
                            {
                                api_football_venue_id: countryTeams[i]['venue']['api_football_id'],
                                name: countryTeams[i]['images'][j]['name'],
                                source: countryTeams[i]['images'][j]['source'],
                                width: 0,
                                height: 0,
                                display_order: countryTeams[i]['images'][j]['display_order'] ? countryTeams[i]['images'][j]['display_order'] : j + 1,
                                is_active: true
                            },
                            {
                                onConflict: 'name'
                            }
                        )
                        .select()
                    rowsUpdated++

                    if (error1) {
                        throw error1
                    }
                }
            }
        }

        return json({
            success: true,
            country: countrySlug,
            total_rows_updated: rowsUpdated
        });

    } catch (error) {
        console.log('error: ', error);
        return json({
            success: false,
            message: error.message
        });
    }
}