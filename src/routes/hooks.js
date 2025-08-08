// src/hooks.server.ts
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public'
import { createServerClient } from '@supabase/ssr'
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime'

export const handle = async ({ event, resolve }) => {
    console.log('[hooks.js]')

    return resolve(event);
}