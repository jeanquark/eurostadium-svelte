export default function (stadiumObj, stadiums, leagues) {
    // let circleRadius = 10
    const circleRadius = stadiumObj.getAttribute('data-circle-radius') || 10
    let leagueColors = ['#FF0000', '#FFFF00']
    const circleColors = stadiumObj.getAttribute('data-circle-colors').split(',')
    console.log('circleColors: ', circleColors);
    console.log('leagues: ', leagues);
    if (leagues.length < 1) {
        alert('No leagues to add stadiums to!')
        return
    }
    console.log('stadiums: ', stadiums);
    if (circleColors && circleColors.length == 2) {
        leagueColors[0] = circleColors[0]
        leagueColors[1] = circleColors[1]
    }
    stadiumObj.innerHTML = ''

    for (let i = 0; i < stadiums.length; i++) {
        let newElement = document.createElementNS('http://www.w3.org/2000/svg', 'circle')
        // newElement.classList.add('stadium')
        newElement.setAttribute('cx', 0 + stadiums[i]['venue']['x'])
        newElement.setAttribute('cy', stadiums[i]['venue']['y'])
        newElement.setAttribute('r', circleRadius)
        newElement.setAttribute('fill', stadiums[i]['league']['api_football_id'] == leagues[0]['api_football_id'] ? leagueColors[0] : leagueColors[1])
        newElement.setAttribute('data-api-football-league-id', stadiums[i]['league']['api_football_id'])
        newElement.setAttribute('data-api-football-venue-id', stadiums[i]['venue']['api_football_id'])
        newElement.setAttribute('data-city', stadiums[i]['venue']['city'])
        newElement.setAttribute('data-capacity', stadiums[i]['venue']['capacity'])
        newElement.setAttribute('class', 'stadium')
        stadiumObj.appendChild(newElement)
    }
}
