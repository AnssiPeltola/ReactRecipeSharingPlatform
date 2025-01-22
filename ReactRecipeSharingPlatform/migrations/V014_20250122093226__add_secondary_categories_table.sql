-- Create a new table for secondary categories
CREATE TABLE secondary_categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL UNIQUE
);

-- Create a junction table for recipes and secondary categories
CREATE TABLE recipe_secondary_categories (
  recipe_id INTEGER REFERENCES recipes(id) ON DELETE CASCADE,
  category_id INTEGER REFERENCES secondary_categories(id) ON DELETE CASCADE,
  PRIMARY KEY (recipe_id, category_id)
);

-- Move existing secondary_category data to new table
INSERT INTO secondary_categories (name)
SELECT DISTINCT secondary_category 
FROM recipes 
WHERE secondary_category IS NOT NULL;

-- Copy existing relationships to junction table
INSERT INTO recipe_secondary_categories (recipe_id, category_id)
SELECT r.id, sc.id
FROM recipes r
JOIN secondary_categories sc ON r.secondary_category = sc.name
WHERE r.secondary_category IS NOT NULL;

-- Remove the old column
ALTER TABLE recipes DROP COLUMN secondary_category;