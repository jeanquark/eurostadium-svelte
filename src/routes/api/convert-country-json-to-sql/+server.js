import { json } from '@sveltejs/kit';
import { promises as fs } from "fs";
import { env } from '$env/dynamic/public';

export async function GET({ request }) {

    try {
        const file1 = './static/json/countries.json';
        const countriesFile = await fs.readFile(file1, "utf8");
        let countriesArray = []
        if (countriesFile.length > 0) {
            countriesArray = JSON.parse(countriesFile)
        }
        console.log('countriesArray: ', countriesArray);

        // 1) Generate SQL for DB seed
        let values = ''
        for (let i = 0; i < countriesArray.length; i++) {
            values += `('${countriesArray[i]['name']}', '${countriesArray[i]['slug']}', '${countriesArray[i]['image']}', '', TRUE)${i < countriesArray.length - 1 ? ', ' : ' '}`
        }
        const sqlQuery = `INSERT INTO countries (name, slug, image, code, is_active) VALUES ${values}`;
        console.log('sqlQuery: ', sqlQuery);

        return json({
            success: true,
            query: sqlQuery
        });

    } catch (error) {
        console.log('error: ', error);
        return json(new Response(error, {
            status: 404
        }))
    }
}