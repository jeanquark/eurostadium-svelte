import { json } from '@sveltejs/kit';
import { promises as fs } from "fs";

export async function GET({ request }) {

    const file1 = './static/json/countries.json';
    const countriesFile = await fs.readFile(file1, "utf8");
    let countriesArray = []
    if (countriesFile.length > 0) {
        countriesArray = JSON.parse(countriesFile)
    }
    // console.log('countriesArray: ', countriesArray);
    let values = ''
    let count = 0
    for (let i = 0; i < countriesArray.length; i++) {
        let countryTeams = []
        const file = `./static/json/teams/${countriesArray[i].slug}.json`;
        const teamsFile = await fs.readFile(file, "utf8");
        if (teamsFile.length > 0) {
            countryTeams = JSON.parse(teamsFile)
        }

        // console.log('countryTeams: ', countryTeams);
        // console.log('countryTeams[0]: ', countryTeams[0]?.venue?.api_football_id);
        for (let j = 0; j < countryTeams.length; j++) {
            if (countryTeams[i] && countryTeams[i].venue && countryTeams[i].venue.api_football_id) {
                count++
                values += `(
                    '${countryTeams[i].venue?.api_football_id}',
                    '${countryTeams[i].venue?.name}',
                    '${countryTeams[i].venue?.address}',
                    '${countryTeams[i].venue?.city}',
                    '${countryTeams[i].venue?.capacity}',
                    '${countryTeams[i].venue?.surface}',
                    '${countryTeams[i].venue?.lat}',
                    '${countryTeams[i].venue?.lng}',
                    '${countryTeams[i].venue?.x}',
                    '${countryTeams[i].venue?.y}',
                    '${countryTeams[i].venue?.url}',
                    TRUE
                    )${i < countryTeams.length - 1 ? ', ' : ' '}`
            }
        }
    }

    // console.log('values: ', values);

    const sqlQuery = `INSERT INTO stadiums ("api_football_id",
    "name",
    "address",
    "city",
    "capacity",
    "surface",
    "lat",
    "lng",
    "x",
    "y",
    "wiki",
    "is_active") VALUES ${values}`;
    console.log('sqlQuery: ', sqlQuery);

    return json({
        success: true,
        count,
        query: sqlQuery
    });
}