import { json } from '@sveltejs/kit';
import { promises as fs } from "fs";
import { env } from '$env/dynamic/public';
import { createServerClient } from '@supabase/ssr'
import calculateSvgCoord from '../../../utils/calculateSvgCoord';
// import countries from '../../../../static/json/countries.json'

export async function GET({ url }) {
    try {
        const country = url.searchParams.get('country')
        console.log('country: ', country)

        // 1) Update one country
        if (country) {
            const abc = calculateSvgCoord(country)
            console.log('abc: ', abc);
        } else {
            return json({
                success: false,
                message: 'Specify country in url params: /api/calculate-svg-coord?country=[COUNTRY_SLUG]'
            });
        }

        // 2) Update all countries
        // const file1 = './static/json/countries.json';
        // const countriesFile = await fs.readFile(file1, "utf8");
        // let countriesArray = []
        // if (countriesFile.length > 0) {
        //     countriesArray = JSON.parse(countriesFile)
        // }
        // console.log('countriesArray: ', countriesArray);

        // // for (let i = 0; i < countriesArray.length; i++) {
        // for (let i = 0; i < 2; i++) {
        //     const abc = calculateSvgCoord(countriesArray[i]['slug'])
        //     console.log('abc: ', abc);
        // }

        
        
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