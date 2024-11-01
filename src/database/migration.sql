/* Update table */
-- ALTER TABLE table_name
-- ADD COLUMN new_column_name data_type constraint;

-----------------------
--      Tables       --
-----------------------

CREATE TYPE role AS ENUM ('user', 'moderator', 'admin');

CREATE TABLE countries (
  id INT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
  api_football_id INT,
  name VARCHAR(255),
  slug VARCHAR(255),
  image VARCHAR(255),
  code VARCHAR(6),
  wiki VARCHAR(255),
  is_active BOOLEAN DEFAULT FALSE,
  display_order SMALLINT,
  inserted_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);


CREATE TABLE users (
  id uuid references auth.users NOT NULL PRIMARY KEY,
  country_id INT,
  firstname VARCHAR(60) UNIQUE,
  lastname VARCHAR(60) UNIQUE,
  username VARCHAR(60) UNIQUE,
  image JSON,
  level SMALLINT NOT NULL DEFAULT 1,
  points INT NOT NULL DEFAULT 0,
  role role DEFAULT 'user',
  inserted_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  CONSTRAINT fk_country_id FOREIGN KEY (country_id) REFERENCES countries (id)
);


CREATE TABLE leagues (
  id INT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
  api_football_id INT NOT NULL UNIQUE,
  country_id INT,
  name VARCHAR(255),
  slug VARCHAR(255),
  image VARCHAR(255),
  is_active BOOLEAN DEFAULT FALSE,
  display_order SMALLINT,
  type VARCHAR(255),
  nb_teams SMALLINT,
  wiki VARCHAR(255),
  inserted_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  CONSTRAINT fk_country_id FOREIGN KEY (country_id) REFERENCES countries (id)
);


CREATE TABLE stadiums (
  id INT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
  api_football_id INT NOT NULL UNIQUE,
  name VARCHAR(60),
  slug VARCHAR(60),
  address VARCHAR(60),
  city VARCHAR(60),
  capacity INT,
  surface VARCHAR(60),
  wiki VARCHAR(255),
  is_active BOOLEAN DEFAULT FALSE,
  lat REAL NOT NULL,
  lng REAL NOT NULL,
  x SMALLINT,
  y SMALLINT,
  -- country_id INT,
  inserted_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
  -- CONSTRAINT fk_country_id FOREIGN KEY (country_id) REFERENCES countries (id)
);


CREATE TABLE teams (
  id INT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
  api_football_id INT NOT NULL UNIQUE,
  -- league_id INT,
  api_football_venue_id INT NOT NULL,
  api_football_league_id INT NOT NULL,
  name VARCHAR(60),
  slug VARCHAR(60),
  code VARCHAR(4),
  image VARCHAR(255),
  founded SMALLINT,
  wiki VARCHAR(255),
  is_active BOOLEAN DEFAULT FALSE,
  inserted_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  -- CONSTRAINT fk_country_id FOREIGN KEY (country_id) REFERENCES countries (id),
  CONSTRAINT fk_api_football_venue_id FOREIGN KEY (api_football_venue_id) REFERENCES stadiums (api_football_id),
  CONSTRAINT fk_api_football_league_id FOREIGN KEY (api_football_league_id) REFERENCES leagues (api_football_id) 
);


CREATE TABLE images (
  id INT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
  user_id uuid,
  api_football_venue_id INT NOT NULL,
  name VARCHAR(60),
  slug VARCHAR(60),
  source VARCHAR(511),
  width SMALLINT,
  height SMALLINT,
  size INT,
  is_active BOOLEAN DEFAULT FALSE,
  inserted_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  CONSTRAINT fk_user_id FOREIGN KEY (user_id) REFERENCES users (id),
  CONSTRAINT fk_api_football_venue_id FOREIGN KEY (api_football_venue_id) REFERENCES stadiums (api_football_id)
);
