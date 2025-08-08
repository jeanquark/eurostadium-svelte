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
        // const { data, error } = await supabase.auth.admin.listUsers()

        // if (error) {
        //     console.error('Error fetching users:', error)
        //     return []
        // }

        // return json({
        //     success: true,
        //     users: data.users
        // });


        // const { data, error } = await supabase
        //     .from('users')  // Your public profiles table
        //     .select(`
        //         *,
        //         auth_users:users_id(*)
        //     `);
        // if (error) throw error;
        // console.log('data: ', data);
        // return data;

        
        const { data, error } = await supabase.auth.admin.listUsers()

        const { data: publicUsers } = await supabase.from('users').select('*')

        const { data: publicRoles } = await supabase.from('user_roles').select('*')

        const merged = data.users.map(user => {
            const publicData = publicUsers.find(p => p.id === user.id)
            const roles = publicRoles.filter(r => r.user_id === user.id)?.map(role =>
                role.role,
            )
            return {
                id: user.id,
                email: user.email,
                firstname: publicData?.firstname,
                lastname: publicData?.lastname,
                username: publicData?.username,
                roles: roles || [],
            }
        })
        console.log('merged: ', merged);

        return json({
            success: true,
            users: merged
        });

    } catch (error) {
        console.log('error: ', error);
        return json(new Response(error, {
            status: 404
        }))
    }
}