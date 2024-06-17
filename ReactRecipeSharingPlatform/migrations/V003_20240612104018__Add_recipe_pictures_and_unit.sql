CREATE TABLE recipe_pictures (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255),
  type VARCHAR(50),
  data BYTEA
);

ALTER TABLE recipe_ingredients
ADD COLUMN unit VARCHAR(255) NOT NULL;