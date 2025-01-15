DROP VIEW IF EXISTS images_by_stadium_view;

CREATE VIEW images_by_stadium_view AS
SELECT
  stadium_id AS stadium_id,
  COUNT(*) AS images_by_stadium
FROM
  teams_view
GROUP BY
  stadium_id;