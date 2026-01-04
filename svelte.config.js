// import adapter from '@sveltejs/adapter-auto';
import path from 'path'
import adapter from '@sveltejs/adapter-static'
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte'

/** @type {import('@sveltejs/kit').Config} */
const config = {
    preprocess: vitePreprocess(),
    kit: {
        // adapter-auto only supports some environments, see https://svelte.dev/docs/kit/adapter-auto for a list.
        // If your environment is not supported, or you settled on a specific environment, switch out the adapter.
        // See https://svelte.dev/docs/kit/adapters for more information about adapters.
        // adapter: adapter(),
        adapter: adapter({
            pages: 'build',
            assets: 'build',
            fallback: '404.html',
            precompress: false,
            strict: true,
        }),
        paths: {
            // base: process.argv.includes('dev') ? '' : process.env.BASE_PATH
            // base: ''
        },
        alias: {
            // these are the aliases and paths to them
            '@components': path.resolve('./src/lib/components'),
            '@lib': path.resolve('./src/lib'),
            '@utils': path.resolve('./src/lib/utils'),
            '@store': path.resolve('./src/store'),
            '@styles': path.resolve('./src/styles'),
        },
        // prerender: {
        // 	handleHttpError: 'fail'
        // }
        prerender: {
            entries: ['*'], // Prerender all pages
        },
        env: {
            publicPrefix: 'PUBLIC_',
        },
    },
}

export default config
