--------------------------
--      Seed data       --
--------------------------

-- INSERT INTO users(firstname, lastname, username, country_id, )
-- VALUES 
--   ('John', 'Doe', 'john.doe');

INSERT INTO countries(api_football_id, name, slug, image, code, is_active)
VALUES 
  (NULL, 'Switzerland', 'switzerland', 'switzerland.png', 'CH', TRUE),
  (NULL, 'France', 'france', 'france.png', 'FR', TRUE),
  (NULL, 'Germany', 'germany', 'germany.png', 'DE', TRUE),
  (NULL, 'Liechtenstein', 'liechtenstein', 'liechtenstein.png', 'FL', TRUE);