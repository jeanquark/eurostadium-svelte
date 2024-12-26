# Eurostadium

Showcase football stadiums across Europe.

![homepage](/static/images/homepage.jpg)

## Database seed

- Get all countries

  Call `/api/supabase/update-countries`

- Get all leagues

  Call `/api/supabase/update-leagues`

- Fetch all teams by country (to be run once a year)

  Call
  `/api/api-football/fetch-teams?season=[SEASON]&countryStartIndex=[COUNTRY_START_INDEX]&countryEndIndex=[COUNTRY_END_INDEX]`
  It will update all teams for the active leagues in the specified countries
  json files.

- Calculate x and y coordinates for each stadium (Svg map)

  Call `/api/calculate-svg-coord?country=[COUNTRY_SLUG]` It will update x & y
  values for the specified country json file. To update all countries, set value
  to 'all'

- Update stadiums

  Call `/api/supabase/update-stadiums?country=[COUNTRY_SLUG]` It will update
  supabase stadiums table with data retrieved from the specified country json
  file located at `/static/json/teams/[COUNTRY_SLUG].json`.

- Update teams (dependant on stadiums)

  Call `/api/supabase/update-teams?country=[COUNTRY_SLUG]` It will update
  supabase teams table with data retrieved from the specified country json file
  located at `/static/json/teams/[COUNTRY_SLUG].json`.

- Update images (dependant on stadiums)

  Call `/api/supabase/update-images?country=[COUNTRY_SLUG]` It will update
  supabase images table with data retrieved from the specified country json file
  located at `/static/json/teams/[COUNTRY_SLUG].json`.

- Update supabase storage url for each image

  Call `/api/supabase/set-images-public-url?country=[COUNTRY_SLUG]` It will
  update url field in supabase images table for each image stored in specified
  country folder of supabase storage.

## Custom Claims & Role-based Access Control (RBAC)

Enable authentication hook to retrieve user role. More info
[here](https://supabase.com/docs/guides/database/postgres/custom-claims-and-role-based-access-control-rbac?queryGroups=language&language=plpgsql).
![enable_authentication_hook](/static/images/enable_authentication_hook.jpg)

## Upload image

Visit `/upload-image` and upload an image (you have to be logged in). It will be
saved in `image_uploads` supabase storage.

## Developer

Jean-Marc Kleger
