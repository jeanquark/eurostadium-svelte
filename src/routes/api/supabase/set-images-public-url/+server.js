import { json } from '@sveltejs/kit';
// import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public'
import { env } from '$env/dynamic/public';
import { createServerClient } from '@supabase/ssr'

export async function GET({ url }) {
    try {
        const countrySlug = url.searchParams.get('country')
        console.log('countrySlug: ', countrySlug)

        if (!countrySlug) {
            return json({
                success: false,
                message: 'Specify country in url params: "/api/supabase/set-image-public-url?country=[COUNTRY_SLUG]"'
            });
        }

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

        // 1) Fetch images by country
        const { data: images, error: error1 } = await supabase.storage
            .from("stadiums")
            .list(countrySlug, {
                limit: 300,
                offset: 0,
                sortBy: { column: "name", order: "asc" },
            });
        if (error1) {
            throw error1
        }

        // console.log('images: ', images);

        // 2) Fetch public url by image
        // for (let i = 0; i < 10; i++) {
        //     const { data: url, error: error2 } = supabase.storage
        //         .from("stadiums")
        //         .getPublicUrl(`${countrySlug}/${images[i]['name']}`);
        //     console.log('url: ', url);
        //     if (error2) {
        //         throw error2
        //     }
        // }


        // 3) Create a signed URL
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

            console.log('data3: ', data3);
        }

        // console.log('images.length: ', images.length);
        // console.log('images[0]: ', images[0]);
        // console.log('url: ', url);
        // console.log('signedUrl: ', signedUrl);

        // for (let i = 0; i < 10; i++) {
        //     const { data, error: error3 } = await supabase
        //         .from('images')
        //         .upsert(
        //             {
        //                 url: data.signedUrl
        //             },
        //             {
        //                 onConflict: 'name'
        //             }
        //         )
        //         if (error3) {
        //             throw error3
        //         }
        // }


        return json({
            success: true,
            total_images: images.length,
            url
        });
    } catch (error) {
        console.log('error: ', error);
        // return json(new Response(error, {
        //     status: 404
        // }))
        return json({
            success: false,
            message: error.message
        });
    }
}
