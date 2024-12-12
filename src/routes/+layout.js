// src/routes/+layout.ts
import { createBrowserClient, createServerClient, isBrowser } from '@supabase/ssr'
import { PUBLIC_SUPABASE_ANON_KEY, PUBLIC_SUPABASE_URL } from '$env/static/public'
import { supabase as supabaseClient } from '@lib/supabase/supabaseClient'

export const load = async ({ fetch, data, depends }) => {
    depends('supabase:auth')

    // const supabase = isBrowser()
    //     ? createBrowserClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY, {
    //         global: {
    //             fetch,
    //         },
    //     })
    //     : createServerClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY, {
    //         global: {
    //             fetch,
    //         },
    //         cookies: {
    //             getAll() {
    //                 return data.cookies
    //             },
    //         },
    //     })

    const supabase = isBrowser()
        ? supabaseClient
        : createServerClient('https://ybfeookvrzkbcgobnzez.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InliZmVvb2t2cnprYmNnb2JuemV6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzAzODI4MjksImV4cCI6MjA0NTk1ODgyOX0.r6-gvODFMUtUMKanKEuBchKsaLoxp0p9Km4VIse87GY', {
            global: {
                fetch,
            },
            cookies: {
                getAll() {
                    return data.cookies
                },
            },
        })

    /**
     * It's fine to use `getSession` here, because on the client, `getSession` is
     * safe, and on the server, it reads `session` from the `LayoutData`, which
     * safely checked the session using `safeGetSession`.
     */
    const {
        data: { session },
    } = await supabase.auth.getSession()

    return { supabase, session }
}