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
        console.log('countriesArray: ', countriesArray);

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

        for (let i = 0; i < countriesArray.length; i++) {
            const { data, error } = await supabase
                .from('countries')
                .upsert(
                    { 
                        slug: countriesArray[i]['slug'], 
                        name: countriesArray[i]['name'], 
                        image: countriesArray[i]['image'], 
                        is_active: true 
                    }, { 
                        onConflict: 'slug' 
                    }
                )
                .select()
            console.log('data: ', data);
            rowsUpdated++
            if (error) {
                throw error
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