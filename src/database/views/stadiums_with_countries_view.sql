CREATE OR REPLACE VIEW stadiums_with_countries_view AS
SELECT
  stadiums.id,
  stadiums.name AS stadium_name,
  stadiums.capacity AS stadium_capacity,
  stadiums.wiki AS stadium_wiki,
  images.name as image_name,
  images.url as image_url,
  images.source as image_src,
  teams.name AS team_name,
  leagues.name AS league_name,
  countries.name AS country_name
FROM stadiums
LEFT JOIN teams ON teams.api_football_venue_id = stadiums.api_football_id
LEFT JOIN leagues ON leagues.api_football_id = teams.api_football_league_id
LEFT JOIN countries ON countries.id = leagues.country_id
LEFT JOIN images ON images.api_football_venue_id = stadiums.api_football_id;