-- CREATE OR REPLACE VIEW stadiums_with_countries_view AS
-- SELECT
--   stadiums.id,
--   stadiums.name AS stadium_name,
--   stadiums.capacity AS stadium_capacity,
--   stadiums.wiki AS stadium_wiki,
--   images.name as image_name,
--   images.url as image_url,
--   images.source as image_src,
--   teams.name AS team_name,
--   leagues.name AS league_name,
--   countries.name AS country_name
-- FROM stadiums
-- LEFT JOIN teams ON teams.api_football_venue_id = stadiums.api_football_id
-- LEFT JOIN leagues ON leagues.api_football_id = teams.api_football_league_id
-- LEFT JOIN countries ON countries.id = leagues.country_id
-- LEFT JOIN images ON images.api_football_venue_id = stadiums.api_football_id;



-- CREATE OR REPLACE VIEW stadiums_with_images_view AS
-- SELECT
--   s.id,
--   s.name AS stadium_name,
--   s.capacity AS stadium_capacity,
--   s.wiki AS stadium_wiki,
--   teams.name AS team_name,
--   COALESCE(
--     json_agg(
--       json_build_object(
--         'name', i.name,
--         'url', i.url,
--         'src', i.source
--         -- Add any other image fields you need here, e.g.:
--         -- 'is_primary', i.is_primary,
--         -- 'id', i.id
--       )
--       -- This filter removes null rows created by the LEFT JOIN
--       -- for stadiums with no images
--     ) FILTER (WHERE i.id IS NOT NULL),
--     '[]'::json -- Return an empty JSON array if there are no images
--   ) AS images
-- FROM stadiums s
-- LEFT JOIN teams ON teams.api_football_venue_id = s.api_football_id
-- LEFT JOIN images i ON s.api_football_id = i.api_football_venue_id
-- GROUP BY s.id
-- ORDER BY s.name;



-- CREATE OR REPLACE VIEW stadiums_with_images_view4 AS
-- SELECT
--   s.*,
--   -- Subquery to get the aggregated images for this stadium
--   (
--     SELECT COALESCE(json_agg(
--       json_build_object(
--         'name', img.name,
--         'url', img.url
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
--         'name', t.name
--       )
--     ), '[]'::json)
--     FROM teams t
--     WHERE t.api_football_venue_id = s.api_football_id
--   ) AS teams
-- FROM stadiums s
-- ORDER BY s.name;





-- CREATE OR REPLACE VIEW stadiums_with_images_view4 AS
-- SELECT
--   s.*,
--   -- Subquery to get the aggregated images for this stadium
--   (
--     SELECT COALESCE(json_agg(
--       json_build_object(
--         'name', img.name,
--         'url', img.url
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
--         'league', json_build_object(
--           'id', l.id,
--           'name', l.name
--         )
--       )
--     ), '[]'::json)
--     FROM teams t
--     -- Join the leagues table inside the teams subquery
--     LEFT JOIN leagues l ON l.api_football_id = t.api_football_league_id
--     WHERE t.api_football_venue_id = s.api_football_id
--   ) AS teams
-- FROM stadiums s
-- ORDER BY s.name;



-- CREATE OR REPLACE VIEW stadiums_with_images_view4 AS
-- SELECT
--   s.*,
--   -- Subquery to get the aggregated images for this stadium
--   (
--     SELECT COALESCE(json_agg(
--       json_build_object(
--         'name', img.name,
--         'url', img.url
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
--         'league', json_build_object(
--           'id', l.id,
--           'name', l.name,
--           'country', json_build_object(
--             'id', c.id,
--             'name', c.name
--           )
--         )
--       )
--     ), '[]'::json)
--     FROM teams t
--     -- Join the leagues table inside the teams subquery
--     LEFT JOIN leagues l ON l.api_football_id = t.api_football_league_id
--     LEFT JOIN countries c ON c.id = l.country_id
--     WHERE t.api_football_venue_id = s.api_football_id
--   ) AS teams
-- FROM stadiums s
-- ORDER BY s.name;




-- CREATE OR REPLACE VIEW stadiums_with_images_view AS
-- SELECT
--   s.id,
--   s.name AS stadium_name,
--   s.capacity AS stadium_capacity,
--   s.wiki AS stadium_wiki,
--   -- Subquery to get the aggregated images for this stadium
--   (
--     SELECT COALESCE(json_agg(
--       json_build_object(
--         'name', img.name,
--         'url', img.url
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
--         'league', json_build_object(
--           'id', l.id,
--           'name', l.name,
--           'image', l.image,
--           'country', json_build_object(
--             'id', c.id,
--             'name', c.name,
--             'image', c.image
--           )
--         )
--       )
--     ), '[]'::json)
--     FROM teams t
--     -- Join the leagues table inside the teams subquery
--     LEFT JOIN leagues l ON l.api_football_id = t.api_football_league_id
--     LEFT JOIN countries c ON c.id = l.country_id
--     WHERE t.api_football_venue_id = s.api_football_id
--   ) AS teams
-- FROM stadiums s
-- ORDER BY s.name;



CREATE OR REPLACE VIEW stadiums_with_images_view AS
SELECT
  s.id,
  s.name AS stadium_name,
  s.capacity AS stadium_capacity,
  s.city AS stadium_city,
  s.wiki AS stadium_wiki,
  -- Subquery to get the aggregated images for this stadium
  (
    SELECT COALESCE(json_agg(
      json_build_object(
        'name', img.name,
        'url', img.url
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
        'image', t.image
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
  countries.name AS country_name
FROM stadiums s
LEFT JOIN teams ON teams.api_football_venue_id = s.api_football_id
LEFT JOIN leagues ON leagues.api_football_id = teams.api_football_league_id
LEFT JOIN countries ON countries.id = leagues.country_id
ORDER BY s.name;