# Eurostadium

Showcase football stadiums across Europe.

![homepage](/static/images/homepage.jpg)

## Local development

Application built with Svelte 2.8

To run development server

```bash
npm run dev
```

## Database seed

-   Get all countries

    Call `/api/supabase/update-countries`

-   Get all leagues

    Call `/api/supabase/update-leagues`

-   Fetch all teams by country (to be run once a year)

    Call
    `/api/api-football/fetch-teams?season=[SEASON]&countryStartIndex=[COUNTRY_START_INDEX]&countryEndIndex=[COUNTRY_END_INDEX]`
    It will update all teams for the active leagues in the specified countries
    json files (refer to `/static/json/countries.json` file).

-   Calculate x and y coordinates for each stadium (SVG map)

    Call `/api/calculate-svg-coord?country=[COUNTRY_SLUG]` It will update x & y
    values for the specified country json file. To update all countries, set value
    to 'all'

-   Update stadiums

    Call `/api/supabase/update-stadiums?country=[COUNTRY_SLUG]` It will update
    supabase stadiums table with data retrieved from the specified country json
    file located at `/static/json/teams/[COUNTRY_SLUG].json`.

-   Update teams (dependant on stadiums)

    Call `/api/supabase/update-teams?country=[COUNTRY_SLUG]` It will update
    supabase teams table with data retrieved from the specified country json file
    located at `/static/json/teams/[COUNTRY_SLUG].json`.

-   Update images (dependant on stadiums)

    Call `/api/supabase/update-images?country=[COUNTRY_SLUG]` It will update
    supabase images table with data retrieved from the specified country json file
    located at `/static/json/teams/[COUNTRY_SLUG].json`.

-   Update supabase storage url for each image

    Call `/api/supabase/set-images-public-url?country=[COUNTRY_SLUG]` It will
    update url field in supabase images table for each image stored in specified
    country folder of supabase storage.

## Supabase RLS (Row Level Security)

```sql
-- Enable RLS on teams table
ALTER TABLE public.teams ENABLE ROW LEVEL SECURITY;

-- Policy for admin insert
CREATE POLICY "Admins can insert teams" ON public.teams
FOR INSERT TO authenticated
WITH CHECK ('admin' = ANY((auth.jwt() ->> 'user_roles')::text[]));

--Policy for admin update
CREATE POLICY "Admins can update teams" ON public.teams
FOR UPDATE TO authenticated
USING ('admin' = ANY((auth.jwt() ->> 'user_roles')::text[]))
WITH CHECK ('admin' = ANY((auth.jwt() ->> 'user_roles')::text[]));


-- Enable RLS on stadiums table
ALTER TABLE public.stadiums ENABLE ROW LEVEL SECURITY;

-- Policy for admin insert
CREATE POLICY "Admins can insert stadiums" ON public.stadiums
FOR INSERT TO authenticated
WITH CHECK ('admin' = ANY((auth.jwt() ->> 'user_roles')::text[]));

--Policy for admin update
CREATE POLICY "Admins can update stadiums" ON public.stadiums
FOR UPDATE TO authenticated
USING ('admin' = ANY((auth.jwt() ->> 'user_roles')::text[]))
WITH CHECK ('admin' = ANY((auth.jwt() ->> 'user_roles')::text[]));


-- Enable RLS on images table
ALTER TABLE public.images ENABLE ROW LEVEL SECURITY;

-- Policy for admin insert
CREATE POLICY "Admins can insert images" ON public.images
FOR INSERT TO authenticated
WITH CHECK ('admin' = ANY((auth.jwt() ->> 'user_roles')::text[]));

--Policy for admin update
CREATE POLICY "Admins can update images" ON public.images
FOR UPDATE TO authenticated
USING ('admin' = ANY((auth.jwt() ->> 'user_roles')::text[]))
WITH CHECK ('admin' = ANY((auth.jwt() ->> 'user_roles')::text[]));
```

## Connect to the website's admin console

-   From the `database` folder, run sql trigger "create_user" and functions "auth_hooks" and "is_admin".

-   Set up Custom Claims & Role-based Access Control (RBAC):

    Enable authentication hook to retrieve user role. More info
    [here](https://supabase.com/docs/guides/database/postgres/custom-claims-and-role-based-access-control-rbac?queryGroups=language&language=plpgsql).
    ![enable_authentication_hook](/static/images/enable_authentication_hook.jpg)

-   Register/login user on page `/auth/login` (needs signup confirmation by email).

## Upload image

Visit `/upload-image` and upload an image (you need to be logged in). It will be
saved in `image_uploads` supabase storage.

## Deployment

## Developer

Jean-Marc Kleger
