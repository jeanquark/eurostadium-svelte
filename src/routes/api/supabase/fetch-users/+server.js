import { json } from '@sveltejs/kit';
import { promises as fs } from "fs";
import { env } from '$env/dynamic/public';
import { SUPABASE_SERVICE_ROLE_KEY } from '$env/static/private'
import { createServerClient } from '@supabase/ssr'
import { createClient } from '@supabase/supabase-js'


const supabase = createClient(
    env.PUBLIC_SUPABASE_URL,
    SUPABASE_SERVICE_ROLE_KEY
)

export async function GET({ request }) {
    try {
        const { data, error } = await supabase.auth.admin.listUsers()

        if (error) {
            console.error('Error fetching users:', error)
            return []
        }

        return json({
            success: true,
            users: data.users
        });

    } catch (error) {
        console.log('error: ', error);
        return json(new Response(error, {
            status: 404
        }))
    }
}