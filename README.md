# Eurostadium

Showcase football stadiums across Europe.

## Calculate SVG Coord for stadiums

Update country name on line 4 of file calculateSVGCoord.js. Then run

```bash
node calculateSVGCoord
```

## Data management

* Fetch all teams by country

    Specify values for year, start index as well as end index. Then visite url `/api/api-football/fetch-api-football-teams`

* Calculate x and y coordinates for each stadium (Svg map)

    Call `/api/calculate-svg-coord?country=[COUNTRY_SLUG]`
    It will update x & y values for the specified country.
    To update all countries, set value to 'all'

* Update stadiums

    Call `/api/supabase/update-stadium?country=[COUNTRY_SLUG]`
    It will update stadiums table with data retrieved from the specified country json file located at `/static/json/teams/[COUNTRY_SLUG].json`.

* Update teams (dependant on stadiums)

    Call `/api/supabase/update-teams?country=[COUNTRY_SLUG]`
    It will update teams table with data retrieved from the specified country json file located at `/static/json/teams/[COUNTRY_SLUG].json`.

* Update images (dependant on stadiums)

    Call `/api/supabase/update-images?country=[COUNTRY_SLUG]`
    It will update images table with data retrieved from the specified country json file located at `/static/json/teams/[COUNTRY_SLUG].json`.

* Update supabase storage url for each image

    Call `/api/supabase/set-images-public-url?country=[COUNTRY_SLUG]`
    It will update image public url for each image stored in specified country folder of supabase storage.


## Developer

Jean-Marc Kleger
