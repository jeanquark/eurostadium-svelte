import { json } from '@sveltejs/kit';
import { promises as fs } from "fs";

export async function GET({ request }) {

    const file1 = './static/json/leagues.json';
    const leaguesFile = await fs.readFile(file1, "utf8");
    let leaguesArray = []
    if (leaguesFile.length > 0) {
        leaguesArray = JSON.parse(leaguesFile)
    }
    // console.log('leaguesArray: ', leaguesArray);

    let values = ''
    for (let i = 0; i < leaguesArray.length; i++) {
        values += `('${leaguesArray[i]['api_football_id']}', '${leaguesArray[i]['country_id']}', '${leaguesArray[i]['name']}', '${leaguesArray[i]['slug']}', '${leaguesArray[i]['image']}', '', TRUE)${i < leaguesArray.length - 1 ? ', ' : ' '}`
    }
    // console.log('values: ', values);

    const sqlQuery = `INSERT INTO leagues (api_football_id, country_id, name, slug, image, is_active) VALUES ${values}`;
    console.log('sqlQuery: ', sqlQuery);

    return json({
        success: true,
        query: sqlQuery
    });
}