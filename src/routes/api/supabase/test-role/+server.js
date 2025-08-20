import { json } from '@sveltejs/kit';
import { promises as fs } from "fs";
import { env } from '$env/dynamic/public';
import { createServerClient } from '@supabase/ssr'
import slugify from '@utils/slugify';
import { supabase } from "@lib/supabase/supabaseClient";
import { jwtDecode } from "jwt-decode";


// export async function GET({ request }) {
// export async function GET({ locals: { supabase } }) {
export async function GET(event) {
    // export async function GET({ locals: { safeGetSession }, cookies }) {
    try {
        console.log('/api/supabase/test-role')
        // console.log('locals: ', locals);
        // console.log('event: ', event);
        console.log('event.locals.user: ', event.locals.user);
        console.log('event.request: ', event.request);
        const authUser = event.locals.user;
        // const { session } = await safeGetSession()
        // console.log('session: ', session);

        const authHeader = event.request.headers.get('Authorization');
        console.log('authHeader: ', authHeader);

        if (!authHeader) {
            return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
        }

        const token = authHeader.split(' ')[1];

        const decoded = jwtDecode(token);
        console.log('decoded: ', decoded);

        return json({
            success: true,
            authUser
        });



    } catch (error) {
        console.log('error: ', error);
        return json({
            success: false,
            message: error.message
        });
    }
}