import * as dotenv from 'dotenv'
dotenv.config()

// Load the env variables per SvelteKit
// https://kit.svelte.dev/docs/modules#$env-dynamic-private 
import { env } from '$env/dynamic/private'

export const fireConfig = {
    projectId: env.FIREBASE_ADMIN_PROJECT_ID,
    privateKey: env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    clientEmail: env.FIREBASE_ADMIN_CLIENT_EMAIL
}