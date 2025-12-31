import { json } from '@sveltejs/kit';
import { env } from '$env/dynamic/public';
import { createServerClient } from '@supabase/ssr'

export async function GET({ url }) {
    try {
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

        const { data: countries, error } = await supabase
            .from('countries')
            .select('id')

        // console.log('countries: ', countries);

        return json({
            success: true,
            message: 'pong',
            total_countries: countries.length
        });

    } catch (error) {
        console.log('error: ', error);
        console.log('error.message: ', error.message);
        return json({
            success: false,
            message: 'Une erreur est survenue.'
        });
    }
}