CREATE TABLE IF NOT EXISTS Users (
    id VARCHAR ( 255 ) PRIMARY KEY,
	login VARCHAR ( 255 ) UNIQUE NOT NULL,
	password VARCHAR ( 255 ) NOT NULL,
	age INTEGER NOT NULL,
	isDeleted BOOLEAN DEFAULT FALSE,
	createdAt TIMESTAMP WITH TIME ZONE NOT NULL,
    updatedAt TIMESTAMP WITH TIME ZONE NOT NULL,
	CHECK(password ~ '^[A-Za-z0-9]+$'),
	CHECK (age >= 4 AND age <= 130)
);

INSERT INTO Users(login, password, age)
SELECT
  'user_' || seq || (RANDOM() * seq) AS login,
  md5(RANDOM()::TEXT) AS password,
  (seq + 4) AS age
FROM GENERATE_SERIES(1, 10) seq;

SELECT * FROM Users;
