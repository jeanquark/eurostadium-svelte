// import { createClient } from '@supabase/supabase-js'

// export const supabase = createClient('https://ybfeookvrzkbcgobnzez.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InliZmVvb2t2cnprYmNnb2JuemV6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzAzODI4MjksImV4cCI6MjA0NTk1ODgyOX0.r6-gvODFMUtUMKanKEuBchKsaLoxp0p9Km4VIse87GY')

import { createBrowserClient, createServerClient, isBrowser } from '@supabase/ssr'
import { PUBLIC_SUPABASE_ANON_KEY, PUBLIC_SUPABASE_URL } from '$env/static/public'

export const supabase = createBrowserClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY, {
    global: {
        fetch,
    },
})