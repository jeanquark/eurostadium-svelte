export default function (stadiumObj, stadiums, leagues) {
    console.log('call to addStadiumToSvgMap function')
    // let circleRadius = 10
    const circleRadius = stadiumObj.getAttribute('data-circle-radius') || 10
    let leagueColors = ['#FF0000', '#FFFF00']
    const circleColors = stadiumObj.getAttribute('data-circle-colors').split(',')
    const strokeWidth = stadiumObj.getAttribute('data-circle-stroke-width')
    const strokeColor = stadiumObj.getAttribute('data-circle-stroke-color')
    // console.log('circleColors: ', circleColors);
    // console.log('leagues: ', leagues);
    if (leagues.length < 1) {
        alert('No leagues to add stadiums to!')
        return
    }
    // console.log('[addStadiumsToSvgMap] stadiums: ', stadiums);
    if (circleColors && circleColors.length == 2) {
        leagueColors[0] = circleColors[0]
        leagueColors[1] = circleColors[1]
    }
    stadiumObj.innerHTML = ''

    for (let i = stadiums.length - 1; i >= 0; i--) {
        // Create transparent circle for mobile
        // let newElement2 = document.createElementNS('http://www.w3.org/2000/svg', 'circle')
        // newElement2.setAttribute('r', circleRadius * 2)
        // newElement2.setAttribute('fill', '#FF0000')
        // newElement2.setAttribute('cx', stadiums[i]['stadium']['x'])
        // newElement2.setAttribute('cy', stadiums[i]['stadium']['y'])
        // newElement2.setAttribute('class', 'stadium2')
        // stadiumObj.appendChild(newElement2)

        // Create circle for desktop
        let newElement = document.createElementNS('http://www.w3.org/2000/svg', 'circle')
        newElement.setAttribute('r', circleRadius)
        newElement.setAttribute('fill', stadiums[i]['leagues'][0]['api_football_id'] == leagues[0]['api_football_id'] ? leagueColors[0] : leagueColors[1])
        newElement.setAttribute('stroke', strokeColor)
        newElement.setAttribute('stroke-width', strokeWidth)
        newElement.setAttribute('data-leagues', stadiums[i]['leagues'])
        newElement.setAttribute('data-api-football-stadium-id', stadiums[i]['stadium']['id'])
        newElement.setAttribute('cx', stadiums[i]['stadium']['x'])
        newElement.setAttribute('cy', stadiums[i]['stadium']['y'])
        newElement.setAttribute('data-city', stadiums[i]['stadium']['city'])
        newElement.setAttribute('data-capacity', stadiums[i]['stadium']['capacity'])
        newElement.setAttribute('class', 'stadium')
        stadiumObj.appendChild(newElement)
    }
}
