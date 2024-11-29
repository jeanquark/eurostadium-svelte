# Eurostadium

Showcase football stadiums across Europe.

## Calculate SVG Coord for stadiums

Update country name on line 4 of file calculateSVGCoord.js. Then run

```bash
node calculateSVGCoord
```

## Data management

* Fetch all teams by country

    Call `/api/api-football/fetch-teams?season=[SEASON]&countryStartIndex=[COUNTRY_START_INDEX]&countryEndIndex=[COUNTRY_END_INDEX]`
    It will update all teams for the active leagues in the specified countries json files.

* Calculate x and y coordinates for each stadium (Svg map)

    Call `/api/calculate-svg-coord?country=[COUNTRY_SLUG]`
    It will update x & y values for the specified country json file.
    To update all countries, set value to 'all'

* Update stadiums

    Call `/api/supabase/update-stadiums?country=[COUNTRY_SLUG]`
    It will update supabase stadiums table with data retrieved from the specified country json file located at `/static/json/teams/[COUNTRY_SLUG].json`.

* Update teams (dependant on stadiums)

    Call `/api/supabase/update-teams?country=[COUNTRY_SLUG]`
    It will update supabase teams table with data retrieved from the specified country json file located at `/static/json/teams/[COUNTRY_SLUG].json`.

* Update images (dependant on stadiums)

    Call `/api/supabase/update-images?country=[COUNTRY_SLUG]`
    It will update supabase images table with data retrieved from the specified country json file located at `/static/json/teams/[COUNTRY_SLUG].json`.

* Update supabase storage url for each image

    Call `/api/supabase/set-images-public-url?country=[COUNTRY_SLUG]`
    It will update url field in supabase images table for each image stored in specified country folder of supabase storage.


## Developer

Jean-Marc Kleger
