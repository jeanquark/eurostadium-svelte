// src/routes/+page.server.ts
import { fail, redirect } from '@sveltejs/kit'

export const load = async ({ url, locals: { safeGetSession }, cookies }) => {
    const { session, user } = await safeGetSession()
    // console.log('session: ', session);

    // if the user is already logged in return them to the account page
    if (session) {
        redirect(303, '/auth/account')
    }

    return { url: url.origin, session, user, cookies: cookies.getAll() }
}

export const actions = {
    default: async (event) => {
        const {
            url,
            request,
            locals: { supabase },
        } = event
        const formData = await request.formData()
        const email = formData.get('email')
        const validEmail = /^[\w-\.+]+@([\w-]+\.)+[\w-]{2,8}$/.test(email)

        if (!validEmail) {
            return fail(400, { errors: { email: 'Please enter a valid email address' }, email })
        }

        const { error } = await supabase.auth.signInWithOtp({ email })

        if (error) {
            return fail(400, {
                success: false,
                email,
                message: `There was an issue, Please contact support.`,
            })
        }

        return {
            success: true,
            message: 'Please check your email for a magic link to log into the website.',
        }
    },
}