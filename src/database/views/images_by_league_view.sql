DROP VIEW IF EXISTS images_by_league_view;

CREATE VIEW images_by_league_view AS
SELECT
  league_id AS league_id,
  COUNT(*) AS images_by_league
FROM
  teams_view
GROUP BY
  league_id;