# Eurostadium

Showcase football stadiums across Europe.

## Calculate SVG Coord for stadiums

Update country name on line 4 of file calculateSVGCoord.js. Then run

```bash
node calculateSVGCoord
```

## Update data

* Fetch all teams by country

    Specify values for year, start index as well as end index. Then visite url `/api/api-football/fetch-api-football-teams`

* Calculate x and y coordinates for each stadium (Svg map)

    Call `/api/calculate-svg-coord?country=[COUNTRY_SLUG]`
    It will update x & y values for each stadium.

* Retrieve supabase url for each image

## Developer

Jean-Marc Kleger
