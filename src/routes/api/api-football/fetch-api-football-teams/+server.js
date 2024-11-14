import { json } from '@sveltejs/kit';
import { promises as fs } from "fs";
import { API_FOOTBALL_KEY } from '$env/static/private';

export async function GET() {
    console.log('[api/api-football/fetch-eurostadium-teams]', new Date())

    const SEASON = 2024;
    const TOTAL_COUNTRIES = 1

    // const countryObj = {
    //     name: 'Switzerland',
    //     slug: 'switzerland'
    // }
    const file1 = './static/json/countries.json';
    const file2 = './static/json/leagues.json';

    const countriesFile = await fs.readFile(file1, "binary");
    const leaguesFile = await fs.readFile(file2, "binary");
    // const teamsFile = await fs.readFile(file3, "binary");
    // console.log('countriesFile: ', countriesFile);
    // console.log('leaguesFile: ', leaguesFile);
    // console.log('teamsFile: ', teamsFile);

    let countriesArray = []
    let leaguesArray = []
    if (countriesFile.length > 0) {
        countriesArray = JSON.parse(countriesFile)
    }
    if (leaguesFile.length > 0) {
        leaguesArray = JSON.parse(leaguesFile)
    }

    let filesUpdated = 0
    for (let i = 0; i < TOTAL_COUNTRIES; i++) {
        let countryLeagues = []
        let countryTeams = []
        let teamsArray = []

        countryLeagues = leaguesArray.filter((league) => league.country == countriesArray[i]['name'])

        const file = `./static/json/teams/${countriesArray[i].slug}.json`;
        // const teamsFile = await fs.readFile(file, "binary");
        const teamsFile = await fs.readFile(file, "utf8");
        if (teamsFile.length > 0) {
            countryTeams = JSON.parse(teamsFile)
        }

        // 1) Reset league object for all teams
        for (let j = 0; j < countryTeams.length; j++) {
            countryTeams[j]['league'] = {}
        }

        // 2) Fetch teams for all leagues
        let apiFootballTeams = []
        for (let j = 0; j < countryLeagues.length; j++) {
            // 2.1) Request data from API Football
            const teams = await fetch(`https://v3.football.api-sports.io/teams?league=${countryLeagues[j]['api_football_id']}&season=${SEASON}`, {
                "method": "GET",
                "headers": {
                    "x-rapidapi-key": API_FOOTBALL_KEY,
                    "x-rapidapi-host": 'v3.football.api-sports.io'
                }
            })
            const { response } = await teams.json()
            // console.log('response: ', response);
            // let teamObj = {}

            for (let k = 0; k < response.length; k++) {
                let data = { league: {}, ...response[k] }
                data['league']['api_football_id'] = countryLeagues[j]['api_football_id']
                data['league']['name'] = countryLeagues[j]['name']
                data['league']['country'] = countryLeagues[j]['country']
                data['league']['api_football_country_id'] = countryLeagues[j]['api_football_country_id']
                apiFootballTeams.push(data)
            }
        }

        // console.log('apiFootballTeams: ', apiFootballTeams);

        // 3) Add all API Football teams
        let n = 0;
        for (let j = 0; j < apiFootballTeams.length; j++) {
            let obj = { team: {}, venue: {}, league: {} }
            const team = countryTeams.find((el) => el.team.api_football_id == apiFootballTeams[j]['team']['id'])
            // console.log('team: ', team);

            obj['team']['api_football_id'] = apiFootballTeams[j]['team']['id']
            obj['team']['name'] = apiFootballTeams[j]['team']['name']
            obj['team']['code'] = apiFootballTeams[j]['team']['code']
            obj['team']['country'] = apiFootballTeams[j]['team']['country']
            obj['team']['founded'] = apiFootballTeams[j]['team']['founded']

            obj['venue']['api_football_id'] = apiFootballTeams[j]['venue']['id']
            obj['venue']['name'] = apiFootballTeams[j]['venue']['name']
            obj['venue']['address'] = apiFootballTeams[j]['venue']['address']
            obj['venue']['city'] = apiFootballTeams[j]['venue']['city']
            obj['venue']['capacity'] = apiFootballTeams[j]['venue']['capacity']
            obj['venue']['surface'] = apiFootballTeams[j]['venue']['surface']
            obj['venue']['lat'] = team && team.venue.lat ? team.venue.lat : 0.0
            obj['venue']['lng'] = team && team.venue.lng ? team.venue.lng : 0.0
            obj['venue']['x'] = team && team.venue.x ? team.venue.x : 0
            obj['venue']['y'] = team && team.venue.y ? team.venue.y : 0
            obj['venue']['url'] = team && team.venue.url ? team.venue.url : ""

            obj['league']['api_football_id'] = apiFootballTeams[j]['league']['api_football_id']
            obj['league']['name'] = apiFootballTeams[j]['league']['name']
            obj['league']['country'] = apiFootballTeams[j]['league']['country']
            obj['league']['api_football_country_id'] = apiFootballTeams[j]['league']['api_football_country_id']

            obj['images'] = team && team.images

            obj['no'] = j + 1
            n++

            teamsArray.push(obj)
        }

        // 4) Add teams that are no more part of the leagues
        for (let j = 0; j < countryTeams.length; j++) {
            if (!teamsArray.find((team) => team['team']['api_football_id'] == countryTeams[j]['team']['api_football_id'])) {
                n++
                countryTeams[j]['no'] = n;
                console.log('countryTeams[j]: ', countryTeams[j])
                teamsArray.push(countryTeams[j])
            }
        }

        if (teamsArray.length > 0) {
            const data2 = await fs.writeFile(file, JSON.stringify(teamsArray, null, "\t"), 'utf8');
            filesUpdated++
        }
    }

    return json({
        success: true,
        number_of_files_updated: filesUpdated
    })
}
