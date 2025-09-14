import { readFileSync, writeFile } from 'fs'

// const calculateSVGCoord = async () => {
export default function (countrySlug) {
    // const countrySlug = 'austria'
    const data1 = readFileSync(`./static/json/countriesSvgMapCoord.json`)
    const coordData = JSON.parse(data1)
    console.log('countrySlug: ', countrySlug)
    const data2 = readFileSync(`./static/json/teams/${countrySlug}.json`)
    const teams = JSON.parse(data2)
    const array = []

    const lng_min = coordData[countrySlug]['leftLongitude']
    const lng_max = coordData[countrySlug]['rightLongitude']
    const lat_min = coordData[countrySlug]['bottomLatitude']
    const lat_max = coordData[countrySlug]['topLatitude']
    const x_max = coordData[countrySlug]['xMax']
    const y_max = coordData[countrySlug]['yMax']
    const x_translate = coordData[countrySlug]['xTranslate']
    const y_translate = coordData[countrySlug]['yTranslate']
    console.log('x_translate: ', x_translate)
    console.log('y_translate: ', y_translate)
    console.log('lng_min: ', lng_min)
    console.log('lng_max: ', lng_max)

    // Some stadiums in Spain and Portugal should not have their x & y coordinates updated because they are on an island:
    const exclude = [1481 /*Las Palmas*/, 1496 /*Tenerife*/, 21117 /*Maritimo*/, 1281 /*Nacional*/, 1289 /*Santa Clara*/, 3969 /*Ceuta*/]

    for (let i = 0; i < teams.length; i++) {
        let obj = {}
        obj = teams[i]
        // if (exclude.includes(teams[i]['venue']['api_football_id'])) {

        if (teams[i]['venue']['lng'] == 0 && teams[i]['venue']['lat'] == 0) {
            // Do not account for stadiums which coordinates are 0
            console.log(`Lat and Lng coordinates of stadium "${teams[i]['venue']['name']}" are 0.`)
            obj['venue']['x'] = 0
            obj['venue']['y'] = 0
        } else if (teams[i]['venue']['lng'] > lng_max || teams[i]['venue']['lng'] < lng_min || teams[i]['venue']['lat'] > lat_max || teams[i]['venue']['lat'] < lat_min) {
            // Prevent stadiums which coordinates are outside of svg map frame from being updated
            console.log(`Location of stadium "${teams[i]['venue']['name']}" is outside coordinates of svg map. Let's skip updating its x & y values.`)
            obj['venue']['x'] = teams[i]['venue']['x']
            obj['venue']['y'] = teams[i]['venue']['y']
        } else {
            obj['venue']['x'] = (teams[i]['venue']['lng'] + 180) * (x_max / 360)
            const latRad = (teams[i]['venue']['lat'] * Math.PI) / 180
            const mercN = Math.log(Math.tan(Math.PI / 4 + latRad / 2))
            obj['venue']['y'] = y_max / 2 - (x_max * mercN) / (2 * Math.PI)

        }
        // obj['venue']['x'] = x_translate + parseFloat((((teams[i]['venue']['lng'] - lng_min) * x_max) / (lng_max - lng_min)).toFixed(1))
        // obj['venue']['y'] = y_translate + parseFloat((((lat_max - teams[i]['venue']['lat']) * y_max) / (lat_max - lat_min)).toFixed(1))
        array.push(obj)
    }

    const leftLng = (parseFloat(lng_min) + 180) * (x_max / 360)
    const rightLng = (parseFloat(lng_max) + 180) * (x_max / 360)
    console.log('leftLng: ', leftLng)
    console.log('rightLng: ', rightLng)

    const latRadTop = (lat_max * Math.PI) / 180
    const latRadBottom = (lat_min * Math.PI) / 180
    const mercNTop = Math.log(Math.tan(Math.PI / 4 + latRadTop / 2))
    const mercNBottom = Math.log(Math.tan(Math.PI / 4 + latRadBottom / 2))

    const topLat = y_max / 2 - (x_max * mercNTop) / (2 * Math.PI)
    const bottomLat = y_max / 2 - (x_max * mercNBottom) / (2 * Math.PI)
    console.log('topLat: ', topLat)
    console.log('bottomLat: ', bottomLat)

    for (let i = 0; i < array.length; i++) {
        if (array[i]['venue']['lng'] > lng_max || array[i]['venue']['lng'] < lng_min || array[i]['venue']['lat'] > lat_max || array[i]['venue']['lat'] < lat_min) {
            console.log(`Location of stadium "${array[i]['venue']['name']}" is outside coordinates of svg map. Let's skip updating its x & y values.`)
            continue
        } else {
            array[i]['venue']['x'] = Math.round(parseInt(x_translate) + (parseFloat(array[i]['venue']['x']) - leftLng) * (x_max / Math.abs(rightLng - leftLng)))
            array[i]['venue']['y'] = Math.round(parseInt(y_translate) + (parseFloat(array[i]['venue']['y']) - topLat) * (y_max / Math.abs(bottomLat - topLat)))
        }
    }

    writeFile(`./static/json/teams/${countrySlug}.json`, JSON.stringify(array, null, '\t'), function (err) {
        if (err) throw err
        console.log('write complete!')
    })

    return `Stadium x & y coordinates for country ${countrySlug} successfully updated.`
}
