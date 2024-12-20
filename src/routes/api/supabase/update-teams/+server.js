import { json } from '@sveltejs/kit';
import { promises as fs } from "fs";
import { env } from '$env/dynamic/public';
import { createServerClient } from '@supabase/ssr'
import slugify from '@utils/slugify';

export async function GET({ url }) {
    try {
        const countrySlug = url.searchParams.get('country')
        console.log('countrySlug: ', countrySlug)

        if (!countrySlug) {
            return json({
                success: false,
                message: 'Specify country in url params: "/api/supabase/update-stadiums?country=[COUNTRY_SLUG]"'
            });
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

        let rowsUpdated = 0
        let countryTeams = []

        const file = `./static/json/teams/${countrySlug}.json`;
        const teamsFile = await fs.readFile(file, "utf8");
        if (teamsFile.length > 0) {
            countryTeams = JSON.parse(teamsFile)
        }

        for (let i = 0; i < countryTeams.length; i++) {
            if (countryTeams[i] && countryTeams[i].team && countryTeams[i].team.api_football_id && countryTeams[i].venue.api_football_id) {

                const teamSlug = slugify(countryTeams[i]['team']['name'])
                console.log('teamSlug: ', teamSlug);

                const { data, error: error3 } = await supabase
                    .from('teams')
                    .upsert(
                        {
                            api_football_id: countryTeams[i]['team']['api_football_id'],
                            name: countryTeams[i]['team']['name'],
                            code: countryTeams[i]['team']['code'],
                            founded: countryTeams[i]['team']['founded'],
                            image: `/images/teams/${countrySlug}/${countryTeams[i]['team']['api_football_id']}.png`,
                            api_football_league_id: countryTeams[i]['league']['api_football_id'] ? countryTeams[i]['league']['api_football_id'] : null,
                            api_football_venue_id: countryTeams[i]['venue']['api_football_id'],
                            wiki: countryTeams[i]['team']['wiki'],
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

        return json({
            success: true,
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