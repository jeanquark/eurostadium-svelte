import { readFileSync, writeFile } from 'fs';

// const calculateSVGCoord = async () => {
export default function (countrySlug) {

    const country = 'austria'
    const data1 = readFileSync(`./static/json/countriesSvgMapCoord.json`)
    const coordData = JSON.parse(data1);
    // for (const country in coordData) {
        console.log('country: ', country)
        const data2 = readFileSync(`./static/json/teams/${country}.json`)
        const teams = JSON.parse(data2);
        const array = []
    
        const lng_min = coordData[country]['leftLongitude']
        const lng_max = coordData[country]['rightLongitude']
        const lat_min = coordData[country]['bottomLatitude']
        const lat_max = coordData[country]['topLatitude']
        const x_max = coordData[country]['xMax']
        const y_max = coordData[country]['yMax']
        const x_translate = coordData[country]['xTranslate']
        // const x_translate = 131
        const y_translate = coordData[country]['yTranslate']
        console.log('x_translate: ', x_translate);
        console.log('y_translate: ', y_translate);
        // const mapWidth = 739.34473;
        console.log('lng_min: ', lng_min);
        console.log('lng_max: ', lng_max);
    
        for (let i = 0; i < teams.length; i++) {
            let obj = {}
            obj = teams[i]
            // obj['venue']['x'] = x_translate + parseFloat((((teams[i]['venue']['lng'] - lng_min) * x_max) / (lng_max - lng_min)).toFixed(1))
            // obj['venue']['y'] = y_translate + parseFloat((((lat_max - teams[i]['venue']['lat']) * y_max) / (lat_max - lat_min)).toFixed(1))
            obj['venue']['x'] = (teams[i]['venue']['lng']+180)*(x_max/360);
            const latRad = teams[i]['venue']['lat']*Math.PI/180;
            const mercN = Math.log(Math.tan((Math.PI/4)+(latRad/2)));
            obj['venue']['y'] = (y_max/2)-(x_max*mercN/(2*Math.PI));
            array.push(obj)
        }
        
        const leftLng = (parseFloat(lng_min) + 180) * (x_max/360)
        const rightLng = (parseFloat(lng_max) + 180) * (x_max/360)
        console.log('leftLng: ', leftLng)
        console.log('rightLng: ', rightLng)

        const latRadTop = lat_max*Math.PI/180;
        const latRadBottom = lat_min*Math.PI/180;
        const mercNTop = Math.log(Math.tan((Math.PI/4)+(latRadTop/2)));
        const mercNBottom = Math.log(Math.tan((Math.PI/4)+(latRadBottom/2)));

        const topLat = (y_max/2)-(x_max*mercNTop/(2*Math.PI))
        const bottomLat = (y_max/2)-(x_max*mercNBottom/(2*Math.PI))
        console.log('topLat: ', topLat)
        console.log('bottomLat: ', bottomLat)
        
        for (let i = 0; i < array.length; i++) {
            array[i]['venue']['x'] = Math.round(parseInt(x_translate) + (parseFloat(array[i]['venue']['x']) - leftLng)*(x_max/Math.abs(rightLng-leftLng)));
            array[i]['venue']['y'] = Math.round(parseInt(y_translate) + ((parseFloat(array[i]['venue']['y']) - topLat)*(y_max/Math.abs(bottomLat-topLat))));
        }
    
        writeFile(`./static/json/teams/${country}.json`, JSON.stringify(array, null, "\t"), function (err) {
            if (err) throw err;
            console.log('write complete!');
        });
    // }
}
// calculateSVGCoord()