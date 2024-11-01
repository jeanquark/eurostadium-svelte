--------------------------
--      Seed data       --
--------------------------

INSERT INTO leagues(api_football_id, country_id, name, slug, image, is_active)
VALUES 
(207, 1, 'Super League', 'super_league', '/images/leagues/switzerland/207.jpg', TRUE),
(208, 1, 'Challenge League', 'challenge_league', '/images/leagues/switzerland/208.jpg', TRUE),
(61, 2, 'Ligue 1', 'ligue_1', '/images/leagues/france/61.jpg', TRUE),
(62, 2, 'Ligue 2', 'ligue_2', '/images/leagues/france/62.jpg', TRUE),
(78, 3, 'Bundesliga', 'bundesliga', '/images/leagues/france/78.jpg', TRUE),
(79, 3, '2. Bundesliga', '2_bundesliga', '/images/leagues/france/79.jpg', TRUE);