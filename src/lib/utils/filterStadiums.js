export default function filterStadiums(stadiums, leagueIds, filter) {
    console.log('filterStadiums: ', stadiums, leagueIds, filter)
    switch (filter) {
        case 'all':
            return stadiums
        case 'top_league':
            return stadiums.filter((team) => team.league.api_football_id == leagueIds[0])
        // return abc1.length;
        case 'second_league':
            return stadiums.filter((team) => team.league.api_football_id == leagueIds[1])
        case 'stadium_sm':
            return [...new Set(stadiums.filter((team) => team.venue.capacity < 20000).map((team) => team.venue.api_football_id))]
        case 'stadium_md':
            return [...new Set(stadiums.filter((team) => team.venue.capacity >= 20000 && team.venue.capacity < 40000).map((team) => team.venue.api_football_id))]
        case 'stadium_lg':
            return [...new Set(stadiums.filter((team) => team.venue.capacity >= 40000 && team.venue.capacity < 60000).map((team) => team.venue.api_football_id))]
        case 'stadium_xl':
            return [...new Set(stadiums.filter((team) => team.venue.capacity >= 60000).map((team) => team.venue.api_football_id))]
    }
}
