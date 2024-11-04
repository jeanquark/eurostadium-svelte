DROP VIEW IF EXISTS teams_view;

create view teams_view as
  select
    stadiums.id as stadium_id,
    stadiums.name as stadium_name,
    leagues.id as league_id,
    leagues.name as league_name,
    teams.id as team_id,
    teams.name as team_name,
    countries.id as country_id,
    countries.name as country_name,
    countries.slug as country_slug
  from
    teams
    left join stadiums on teams.api_football_venue_id = stadiums.api_football_id
    left join leagues on teams.api_football_league_id = leagues.api_football_id
    left join countries on leagues.country_id = countries.id
    left join images on stadiums.api_football_id = images.api_football_venue_id;
