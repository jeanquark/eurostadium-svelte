export default function (stadiumObj, stadiums, newElement2) {
    const circleRadius = 10
    let leagueColors = ['#FF0000', '#FFFF00']
    const circleColors = stadiumObj.getAttribute('data-circle-colors').split(',')
    if (circleColors && circleColors.length == 2) {
        leagueColors[0] = circleColors[0]
        leagueColors[1] = circleColors[1]
    }
    const leagues = [78, 79]

    for (let i = 0; i < stadiums.length; i++) {
        let newElement = document.createElementNS('http://www.w3.org/2000/svg', 'circle')
        newElement.setAttribute('cx', stadiums[i]['venue']['x'])
        newElement.setAttribute('cy', stadiums[i]['venue']['y'] + 0)
        newElement.setAttribute('r', circleRadius)
        newElement.setAttribute('fill', stadiums[i]['league']['api_football_id'] == leagues[0] ? leagueColors[0] : leagueColors[1])
        newElement.setAttribute('data-city', stadiums[i]['venue']['city'])
        newElement.setAttribute('data-stadium-id', stadiums[i]['venue']['api_football_id'])
        newElement.setAttribute('class', 'stadium')
        newElement.setAttribute('api-football-league-id', stadiums[i]['league']['api_football_id'])
        newElement.setAttribute('capacity', stadiums[i]['venue']['capacity'])
        stadiumObj.appendChild(newElement)
    }
}
