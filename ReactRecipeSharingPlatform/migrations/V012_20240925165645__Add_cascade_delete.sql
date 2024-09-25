-- Add recipe_id column to recipe_pictures table
ALTER TABLE recipe_pictures
  ADD COLUMN recipe_id INTEGER;

-- Add ON DELETE CASCADE to existing foreign key constraints

ALTER TABLE recipes
  DROP CONSTRAINT recipes_user_id_fkey,
  ADD CONSTRAINT recipes_user_id_fkey FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;

ALTER TABLE recipe_ingredients
  DROP CONSTRAINT recipe_ingredients_recipe_id_fkey,
  ADD CONSTRAINT recipe_ingredients_recipe_id_fkey FOREIGN KEY (recipe_id) REFERENCES recipes(id) ON DELETE CASCADE;

ALTER TABLE recipe_pictures
  ADD CONSTRAINT recipe_pictures_recipe_id_fkey FOREIGN KEY (recipe_id) REFERENCES recipes(id) ON DELETE CASCADE;

ALTER TABLE recipe_likes
  DROP CONSTRAINT recipe_likes_user_id_fkey,
  DROP CONSTRAINT recipe_likes_recipe_id_fkey,
  ADD CONSTRAINT recipe_likes_user_id_fkey FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  ADD CONSTRAINT recipe_likes_recipe_id_fkey FOREIGN KEY (recipe_id) REFERENCES recipes(id) ON DELETE CASCADE;

ALTER TABLE profile_pictures
  DROP CONSTRAINT profile_pictures_user_id_fkey,
  ADD CONSTRAINT profile_pictures_user_id_fkey FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;

ALTER TABLE recipe_comments
  DROP CONSTRAINT recipe_comments_recipe_id_fkey,
  DROP CONSTRAINT recipe_comments_user_id_fkey,
  ADD CONSTRAINT recipe_comments_recipe_id_fkey FOREIGN KEY (recipe_id) REFERENCES recipes(id) ON DELETE CASCADE,
  ADD CONSTRAINT recipe_comments_user_id_fkey FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;