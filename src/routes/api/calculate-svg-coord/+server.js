import { json } from '@sveltejs/kit';
import { promises as fs } from "fs";
import { env } from '$env/dynamic/public';
import { createServerClient } from '@supabase/ssr'
import calculateSvgCoord from '../../../utils/calculateSvgCoord';

export async function GET({ url }) {
    try {
        const country = url.searchParams.get('country')
        console.log('country: ', country)

        if (country) {
            const abc = calculateSvgCoord(country)
            console.log('abc: ', abc);
        } else {
            return json({
                success: false,
                message: 'Specify country in url params: /api/calculate-svg-coord?country=[COUNTRY_SLUG]'
            });
        }
        
        return json({
            success: true
        });

    } catch (error) {
        console.log('error: ', error);
        return json(new Response(error, {
            status: 404
        }))
    }
}