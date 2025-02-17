import { json } from '@sveltejs/kit';
import { promises as fs } from "fs";
import { env } from '$env/dynamic/public';
import { createServerClient } from '@supabase/ssr'
import slugify from '@utils/slugify'

export async function GET({ url, locals: { supabase } }) {
    try {
        // console.log('url: ', url);
        // console.log('supabase: ', supabase);
        const countrySlug = slugify(url.searchParams.get('country'))
        console.log('countrySlug: ', countrySlug)

        if (!countrySlug) {
            return json({
                success: false,
                message: 'Specify country in url params: "/api/supabase/update-stadiums?country=[COUNTRY_SLUG]"'
            });
        }

        let rowsUpdated = 0
        let countryTeams = []

        const file = `./static/json/teams/${countrySlug}.json`;
        const teamsFile = await fs.readFile(file, "utf8");
        if (teamsFile.length > 0) {
            countryTeams = JSON.parse(teamsFile)
        }

        for (let i = 0; i < countryTeams.length; i++) {
            if (countryTeams[i] && countryTeams[i].venue && countryTeams[i].venue.api_football_id) {
                const { data, error: error2 } = await supabase
                    .from('stadiums')
                    .upsert(
                        {
                            api_football_id: countryTeams[i]['venue']['api_football_id'],
                            name: countryTeams[i]['venue']['name'] ? countryTeams[i]['venue']['name'].substring(0, 59) : '',
                            address: countryTeams[i]['venue']['address'] ? countryTeams[i]['venue']['address'].substring(0, 59) : '',
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