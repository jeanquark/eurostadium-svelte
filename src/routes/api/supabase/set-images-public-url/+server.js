import { json } from '@sveltejs/kit';
// import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public'
import { env } from '$env/dynamic/public';
import { createServerClient } from '@supabase/ssr'
import slugify from 'slugify';

export async function GET({ url, locals: { supabase } }) {
    try {
        const countrySlug = slugify(url.searchParams.get('country'))
        console.log('countrySlug: ', countrySlug)

        if (!countrySlug) {
            return json({
                success: false,
                message: 'Specify country in url params: "/api/supabase/set-image-public-url?country=[COUNTRY_SLUG]"'
            });
        }

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

        // 1) Fetch images by country
        const { data: images, error: error1 } = await supabase.storage
            .from("stadiums")
            .list(countrySlug, {
                limit: 400,
                offset: 0,
                sortBy: { column: "name", order: "asc" },
            });
        if (error1) {
            throw error1
        }
        console.log('images: ', images);
        // return

        // 2) Create a signed URL
        // for (let i = 0; i < 5; i++) {
        for (let i = 0; i < images.length; i++) {
            const { data: data2, error: error2 } = await supabase
                .storage
                .from('stadiums')
                .createSignedUrl(`${countrySlug}/${images[i]['name']}`, 60 * 60 * 24 * 365)
            // console.log('signedUrl: ', signedUrl);
            console.log('data2: ', data2);

            if (error2) {
                throw error2
            }

            console.log('images[i][name]: ', images[i]['name']);

            // 2.1) Update signed url in images table
            const { data: data3, error: error3 } = await supabase
                .from('images')
                .update(
                    {
                        size: images[i].metadata.size,
                        url: data2.signedUrl
                    },
                    {
                        onConflict: 'name'
                    }
                )
                .eq('name', images[i]['name'])

            if (error3) {
                throw error3
            }
            // console.log('data3: ', data3);
        }

        return json({
            success: true,
            url,
            total_images: images.length,
        });
    } catch (error) {
        console.log('error: ', error);
        return json({
            success: false,
            message: error.message
        });
    }
}
