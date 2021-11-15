CREATE TABLE IF NOT EXISTS users (
    id serial PRIMARY KEY,
	login VARCHAR ( 50 ) UNIQUE NOT NULL,
	password VARCHAR ( 50 ) NOT NULL,
	age INTEGER NOT NULL,
	isDeleted BOOLEAN NOT NULL DEFAULT FALSE,
	CHECK(password ~ '^[A-Za-z0-9]+$'),
	CHECK (age >= 4 AND age <= 130)
);

INSERT INTO users(login, password, age)
SELECT
  'user_' || seq || (RANDOM() * seq) AS login,
  md5(RANDOM()::TEXT) AS password,
  seq + (RANDOM() * 10)::INT AS age
FROM GENERATE_SERIES(1, 10) seq;

SELECT * FROM users;
