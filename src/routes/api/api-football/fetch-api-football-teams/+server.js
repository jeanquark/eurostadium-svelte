import { json } from '@sveltejs/kit';
import { promises as fs } from "fs";

export async function GET() {
    console.log('[api/api-football/fetch-eurostadium-teams]', new Date())

    const season = 2023;
    const country = 'ukraine'
    const file = `./public/eurostadium/${country}.json`;

    

    // 1) Get leagues
    const leagues = [
        {
            "name": "Premier League",
            "slug": "premier_league",
            "api_football_id": 333,
            "country": "Ukraine",
            "api_football_country_id": 0
        },
        {
            "name": "Persha Liga",
            "slug": "persha_liga",
            "api_football_id": 334,
            "country": "Ukraine",
            "api_football_country_id": 0
        },
    ]

    // 1) Reset league object for all teams
    const currentFile = await fs.readFile(file, "binary");
    let currentTeams = []
    if (currentFile.length > 0) {
        currentTeams = JSON.parse(currentFile);
    }

    for (let i = 0; i < currentTeams.length; i++) {
        currentTeams[i]['league'] = {}
    }

    // console.log('currentTeams: ', currentTeams);

    // return

    // 2) Fetch teams for all leagues
    let apiFootballTeams = [];
    for (let i = 0; i < leagues.length - 0; i++) {

        // 2.1) Request data from API Football
        const teams = await fetch(`https://v3.football.api-sports.io/teams?league=${leagues[i]['api_football_id']}&season=${season}`, {
            "method": "GET",
            "headers": {
                "x-rapidapi-key": '[PUT_API_KEY_HERE]',
                "x-rapidapi-host": 'v3.football.api-sports.io'
            }
        })
        const { response } = await teams.json()
        // console.log('response: ', response);
        // let teamObj = {}
        for (let j = 0; j < response.length; j++) {
            let data = { league: {}, ...response[j]}
            data['league']['api_football_id'] = leagues[i]['api_football_id']
            data['league']['name'] = leagues[i]['name']
            data['league']['country'] = leagues[i]['country']
            data['league']['api_football_country_id'] = leagues[i]['api_football_country_id']
            apiFootballTeams.push(data)
        }
    }

    // console.log("currentFile: ", currentFile);
    // console.log("stadiums[0][api_football_id]: ", stadiums[0]['api_football_id']);

    // 3) Add all API Football teams
    let teams = []
    let i;
    for (i = 0; i < apiFootballTeams.length; i++) {
        let obj = { team: {}, venue: {}, league: {} }
        const team = currentTeams.find((el) => el.team.api_football_id == apiFootballTeams[i]['team']['id'])
        // console.log('team: ', team);

        obj['no'] = i + 1

        obj['team']['api_football_id'] = apiFootballTeams[i]['team']['id']
        obj['team']['name'] = apiFootballTeams[i]['team']['name']
        obj['team']['code'] = apiFootballTeams[i]['team']['code']
        obj['team']['country'] = apiFootballTeams[i]['team']['country']
        obj['team']['founded'] = apiFootballTeams[i]['team']['founded']

        obj['venue']['api_football_id'] = apiFootballTeams[i]['venue']['id']
        obj['venue']['name'] = apiFootballTeams[i]['venue']['name']
        obj['venue']['address'] = apiFootballTeams[i]['venue']['address']
        obj['venue']['city'] = apiFootballTeams[i]['venue']['city']
        obj['venue']['capacity'] = apiFootballTeams[i]['venue']['capacity']
        obj['venue']['surface'] = apiFootballTeams[i]['venue']['surface']
        obj['venue']['lat'] = team && team.venue.lat ? team.venue.lat : 0.0
        obj['venue']['lng'] = team && team.venue.lng ? team.venue.lng : 0.0
        obj['venue']['x'] = team && team.venue.x ? team.venue.x : 0
        obj['venue']['y'] = team && team.venue.y ? team.venue.y : 0
        obj['venue']['url'] = ''
        
        obj['league']['api_football_id'] = apiFootballTeams[i]['league']['api_football_id']
        obj['league']['name'] = apiFootballTeams[i]['league']['name']
        obj['league']['country'] = apiFootballTeams[i]['league']['country']
        obj['league']['api_football_country_id'] = apiFootballTeams[i]['league']['api_football_country_id']

        teams.push(obj)
    }

    // 4) Add teams that are no more part of the leagues
    for (let j = 0; j < currentTeams.length; j++) {
        if (!teams.find((team) => team['team']['api_football_id'] == currentTeams[j]['team']['api_football_id'])) {
            i++
            currentTeams[j]['no'] = i + 1;
            teams.push(currentTeams[j])
        }
    }


    const newContent = [
        {
            "team": {
                "id": 529,
                "name": "Barcelona",
                "code": "BAR",
                "country": "Spain",
                "founded": 1899,
                "national": false,
                "logo": "https://media.api-sports.io/football/teams/529.png"
            },
            "venue": {
                "id": 19939,
                "name": "Estadi Olímpic Lluís Companys",
                "address": "Carrer de l&apos;Estadi",
                "city": "Barcelona",
                "capacity": 55926,
                "surface": "grass",
                "image": "https://media.api-sports.io/football/venues/19939.png"
            }
        }
    ]

    if (teams.length > 0) {
        const data2 = await fs.writeFile(file, JSON.stringify(teams, null, "\t"));

    }
    // console.log('array: ', array);
    // console.log('dsts2: ', data2);



    return json(number);
}
