DROP VIEW IF EXISTS images_by_team_view;

CREATE VIEW images_by_team_view AS
SELECT
  team_id AS team_id,
  COUNT(*) AS images_by_team
FROM
  teams_view
GROUP BY
  team_id;