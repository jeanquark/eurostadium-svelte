import { json } from '@sveltejs/kit';
import { promises as fs } from "fs";
import { env } from '$env/dynamic/public';
import { createServerClient } from '@supabase/ssr'
import slugify from '@utils/slugify';
import { supabase } from "@lib/supabase/supabaseClient";
import { jwtDecode } from "jwt-decode";


export async function GET({ request }) {
    // export async function GET({ locals: { safeGetSession }, cookies }) {
    try {
        console.log('/api/supabase/test-role')
        // console.log('locals: ', locals);

        // const { session } = await safeGetSession()
        // console.log('session: ', session);

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

        const authHeader = request.headers.get('Authorization');
        console.log('authHeader: ', authHeader);

        if (!authHeader) {
            return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
        }

        const token = authHeader.split(' ')[1];

        const decoded = jwtDecode(token);
        console.log('decoded: ', decoded);
        const user_role = decoded.user_role
        console.log('auth_role: ', user_role);

        const { data: { user }, error } = await supabase.auth.getUser(token);
        console.log('user: ', user);
        console.log('error: ', error);

        if (error || !user) {
            return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
        }

        // console.log('locals: ', locals);
        // const { safeGetSession } = locals
        // console.log('safeGetSession: ', safeGetSession);

        // const { session, user } = await safeGetSession()
        // console.log('session: ', session);
        // console.log('user: ', user);


        // return {
        //     session,
        //     user,
        //     cookies: cookies.getAll(),
        // }

        return json({
            success: true,
            // access_token
        });

    } catch (error) {
        console.log('error: ', error);
        return json({
            success: false,
            message: error.message
        });
    }
}