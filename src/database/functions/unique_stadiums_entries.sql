-- Drop the old function if it exists
DROP FUNCTION IF EXISTS get_unique_stadiums;

CREATE OR REPLACE FUNCTION get_unique_stadiums(
  page_number INTEGER DEFAULT 1,
  page_size INTEGER DEFAULT 10,
  country_name2 TEXT DEFAULT NULL
)
RETURNS TABLE (
  id INTEGER,
  stadium_name VARCHAR(60),
  league_name VARCHAR(60),
  country_name VARCHAR(60),
  api_football_venue_id INTEGER
  -- include other columns you need
) AS $$
BEGIN
  RETURN QUERY
  SELECT DISTINCT ON (s.api_football_venue_id)
    s.id,
    s.stadium_name,
    s.league_name,
    s.country_name,
    s.api_football_venue_id
  FROM stadiums_with_images_view s
  WHERE 
    (country_name2 IS NULL OR s.country_name = country_name2)
  ORDER BY api_football_venue_id ASC
  LIMIT page_size
  OFFSET (page_number - 1) * page_size;
END;
$$ LANGUAGE plpgsql;