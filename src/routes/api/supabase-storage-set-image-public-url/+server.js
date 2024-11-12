import { json } from '@sveltejs/kit';
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public'
import { createServerClient } from '@supabase/ssr'

export async function GET({ request }) {
    try {
        const supabase = createServerClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY, {
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
            .list("switzerland", {
                limit: 100,
                offset: 0,
                sortBy: { column: "name", order: "asc" },
            });
        if (error1) {
            throw error1
        }

        // 2) Fetch public url by image
        const { data: url, error: error2 } = supabase.storage
            .from("stadiums")
            .getPublicUrl("switzerland/10500_001.jpg");

        if (error2) {
            throw error2
        }
        
        // 3) Create a signed URL
        // const { data: signedUrl, error3 } = await supabase
        // .storage
        // .from('stadiums')
        // .createSignedUrl('switzerland/10500_001.png', 60 * 60 * 24 * 365)

        // if (error3) {
        //     throw error3
        // }
        
        console.log('images.length: ', images.length);
        console.log('images[0]: ', images[0]);
        console.log('url: ', url);
        console.log('signedUrl: ', signedUrl);

        return json({
            success: true,
            total_images: images.length,
            url
        });
    } catch (error) {
        console.log('error: ', error);
        return json(new Response(error, {
            status: 404
        }))
    }
}
