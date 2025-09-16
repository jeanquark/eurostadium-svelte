-- CREATE OR REPLACE VIEW stadiums_with_images_view AS
-- SELECT
--   s.id,
--   s.name AS stadium_name,
--   s.capacity AS stadium_capacity,
--   s.city AS stadium_city,
--   s.wiki AS stadium_wiki,
--   s.api_football_id AS api_football_venue_id,
--   s.x AS stadium_x,
--   s.y AS stadium_y,
--   -- Subquery to get the aggregated images for this stadium
--   (
--     SELECT COALESCE(json_agg(
--       json_build_object(
--         'name', img.name,
--         'url', img.url,
--         'src', img.source
--       )
--     ), '[]'::json)
--     FROM images img
--     WHERE img.api_football_venue_id = s.api_football_id
--   ) AS images,
--   -- Subquery to get the aggregated teams for this stadium
--   (
--     SELECT COALESCE(json_agg(
--       json_build_object(
--         'id', t.id,
--         'name', t.name,
--         'image', t.image,
--         'wiki', t.wiki
--         -- 'league', json_build_object(
--         --   'id', l.id,
--         --   'name', l.name,
--         --   'image', l.image,
--         --   'country', json_build_object(
--         --     'id', c.id,
--         --     'name', c.name,
--         --     'image', c.image
--         --   )
--         -- )
--       )
--     ), '[]'::json)
--     FROM teams t
--     -- Join the leagues table inside the teams subquery
--     LEFT JOIN leagues l ON l.api_football_id = t.api_football_league_id
--     LEFT JOIN countries c ON c.id = l.country_id
--     WHERE t.api_football_venue_id = s.api_football_id
--   ) AS teams,
--   leagues.name AS league_name,
--   leagues.api_football_id AS api_football_league_id,
--   countries.name AS country_name
-- FROM stadiums s
-- LEFT JOIN teams ON teams.api_football_venue_id = s.api_football_id
-- LEFT JOIN leagues ON leagues.api_football_id = teams.api_football_league_id
-- LEFT JOIN countries ON countries.id = leagues.country_id
-- ORDER BY s.name;


DROP VIEW IF EXISTS stadiums_with_images_view;
CREATE OR REPLACE VIEW stadiums_with_images_view AS
SELECT DISTINCT ON (s.api_football_id)
  s.id,
  s.name AS stadium_name,
  s.capacity AS stadium_capacity,
  s.city AS stadium_city,
  s.wiki AS stadium_wiki,
  s.api_football_id AS api_football_venue_id,
  s.x AS stadium_x,
  s.y AS stadium_y,
  -- Subquery to get the aggregated images for this stadium
  (
    SELECT COALESCE(json_agg(
      json_build_object(
        'name', img.name,
        'url', img.url,
        'src', img.source
      )
    ), '[]'::json)
    FROM images img
    WHERE img.api_football_venue_id = s.api_football_id
  ) AS images,
  -- Subquery to get the aggregated teams for this stadium
  (
    SELECT COALESCE(json_agg(
      json_build_object(
        'id', t.id,
        'name', t.name,
        'image', t.image,
        'wiki', t.wiki
        -- 'league', json_build_object(
        --   'id', l.id,
        --   'name', l.name,
        --   'image', l.image,
        --   'country', json_build_object(
        --     'id', c.id,
        --     'name', c.name,
        --     'image', c.image
        --   )
        -- )
      )
    ), '[]'::json)
    FROM teams t
    -- Join the leagues table inside the teams subquery
    LEFT JOIN leagues l ON l.api_football_id = t.api_football_league_id
    LEFT JOIN countries c ON c.id = l.country_id
    WHERE t.api_football_venue_id = s.api_football_id
  ) AS teams,
  leagues.name AS league_name,
  leagues.api_football_id AS api_football_league_id,
  countries.name AS country_name,
  countries.id AS country_id
FROM stadiums s
LEFT JOIN teams ON teams.api_football_venue_id = s.api_football_id
LEFT JOIN leagues ON leagues.api_football_id = teams.api_football_league_id
LEFT JOIN countries ON countries.id = leagues.country_id
ORDER BY s.api_football_id;