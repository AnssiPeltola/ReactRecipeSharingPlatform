CREATE TABLE profile_pictures (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id),
  name VARCHAR(255) NOT NULL,
  type VARCHAR(255) NOT NULL,
  data BYTEA NOT NULL
);