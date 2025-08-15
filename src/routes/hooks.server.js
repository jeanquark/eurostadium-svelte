// src/hooks.server.ts
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public'
import { createServerClient } from '@supabase/ssr'

export const handle = async ({ event, resolve }) => {
    try {
        console.log('[hooks.server.js]')
        event.locals.supabase = createServerClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY, {
            cookies: {
                getAll: () => event.cookies.getAll(),
                /**
                 * SvelteKit's cookies API requires `path` to be explicitly set in
                 * the cookie options. Setting `path` to `/` replicates previous/
                 * standard behavior.
                 */
                setAll: (cookiesToSet) => {
                    cookiesToSet.forEach(({ name, value, options }) => {
                        event.cookies.set(name, value, { ...options, path: '/', secure: false })
                    })
                },
            },
        })

        /**
         * Unlike `supabase.auth.getSession()`, which returns the session _without_
         * validating the JWT, this function also calls `getUser()` to validate the
         * JWT before returning the session.
         */
        event.locals.safeGetSession = async () => {
            const {
                data: { session },
            } = await event.locals.supabase.auth.getSession()
            console.log('[hooks] session: ', session)
            if (!session) {
                return { session: null, user: null }
            }

            const {
                data: { user },
                error,
            } = await event.locals.supabase.auth.getUser()
            if (error) {
                // JWT validation has failed
                return { session: null, user: null }
            }

            return { session, user }
        }

        const response = await resolve(event, {
            filterSerializedResponseHeaders(name) {
                return name === 'content-range' || name === 'x-supabase-api-version'
            },
        })

        return response;
    } catch (error) {
        console.log('error: ', error);
    }
}