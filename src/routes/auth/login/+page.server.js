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