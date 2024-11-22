import { json } from '@sveltejs/kit';
import { promises as fs } from "fs";
import calculateSvgCoord from '../../../utils/calculateSvgCoord';

export async function GET({ url }) {
    try {
        const country = url.searchParams.get('country')
        console.log('country: ', country)
        let message

        if (!country) {
            return json({
                success: false,
                message: 'Specify country in url params: "/api/calculate-svg-coord?country=[COUNTRY_SLUG]" or set the slug value to "all"'
            });
        }

        // 1) Update all countries
        if (country == 'all') {
            const file1 = './static/json/countries.json';
            const countriesFile = await fs.readFile(file1, "utf8");
            let countriesArray = []
            if (countriesFile.length > 0) {
                countriesArray = JSON.parse(countriesFile)
            }
            console.log('countriesArray: ', countriesArray);
    
            for (let i = 0; i < countriesArray.length; i++) {
            // for (let i = 0; i < 20; i++) {
                const abc = calculateSvgCoord(countriesArray[i]['slug'])
                console.log('abc: ', abc);
            }

            message = `Updated all countries.`
        } else {
            const response = calculateSvgCoord(country)
            message = response
        }

        return json({
            success: true,
            message
        });

    } catch (error) {
        console.log('error: ', error);
        console.log('error.message: ', error.message);
        return json({
            success: false,
            message: error.message
        });
    }
}