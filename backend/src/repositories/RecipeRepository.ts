import { pool } from "../config/db";
import Recipe from "../models/Recipe";
import { QueryConfig } from "pg";

class RecipeRepository {
  async createRecipe(recipe: Recipe) {
    const client = await pool.connect();
    try {
      await client.query("BEGIN"); // Start transaction

      // Insert the recipe
      const recipeInsertQuery: QueryConfig = {
        text: "INSERT INTO recipes(user_id, title, category, instructions, picture_url) VALUES($1, $2, $3, $4, $5) RETURNING id",
        values: [
          recipe.userId,
          recipe.title,
          recipe.category,
          recipe.instructions,
          recipe.pictureUrl,
        ],
      };
      const recipeResult = await client.query(recipeInsertQuery);
      const recipeId = recipeResult.rows[0].id; // Get the inserted recipe ID

      // Handle ingredients
      for (const ingredient of recipe.ingredients) {
        let ingredientId;

        // Check if ingredient exists
        const ingredientCheckQuery: QueryConfig = {
          text: "SELECT id FROM ingredients WHERE name = $1",
          values: [ingredient.name],
        };
        const ingredientCheckResult = await client.query(ingredientCheckQuery);

        if (ingredientCheckResult.rows.length > 0) {
          // Ingredient exists
          ingredientId = ingredientCheckResult.rows[0].id;
        } else {
          // Insert new ingredient
          const ingredientInsertQuery: QueryConfig = {
            text: "INSERT INTO ingredients(name) VALUES($1) RETURNING id",
            values: [ingredient.name],
          };
          const ingredientInsertResult = await client.query(
            ingredientInsertQuery
          );
          ingredientId = ingredientInsertResult.rows[0].id;
        }

        // Insert into recipe_ingredients
        const recipeIngredientsInsertQuery: QueryConfig = {
          text: "INSERT INTO recipe_ingredients(recipe_id, ingredient_id, quantity, unit) VALUES($1, $2, $3, $4)",
          values: [
            recipeId,
            ingredientId,
            ingredient.quantity,
            ingredient.unit,
          ],
        };
        await client.query(recipeIngredientsInsertQuery);
      }

      await client.query("COMMIT"); // Commit transaction
      return { ...recipe, id: recipeId }; // Return the inserted recipe with ID
    } catch (error) {
      await client.query("ROLLBACK"); // Rollback transaction on error
      throw error; // Rethrow the error
    } finally {
      client.release();
    }
  }

  async uploadFile(file: Express.Multer.File): Promise<number> {
    const { originalname: name, mimetype: type, buffer: data } = file;

    const query: QueryConfig = {
      text: "INSERT INTO recipe_pictures (name, type, data) VALUES ($1, $2, $3) RETURNING id",
      values: [name, type, data],
    };

    const result = await pool.query(query);

    return result.rows[0].id;
  }

  async getRecipePicture(id: number) {
    const query: QueryConfig = {
      text: "SELECT * FROM recipe_pictures WHERE id = $1",
      values: [id],
    };

    const result = await pool.query(query);

    return result.rows[0];
  }

  async searchByIngredientOrName(searchTerm: string): Promise<Recipe[]> {
    const query = `
      SELECT DISTINCT recipes.* FROM recipes
      LEFT JOIN recipe_ingredients ON recipes.id = recipe_ingredients.recipe_id
      LEFT JOIN ingredients ON recipe_ingredients.ingredient_id = ingredients.id
      WHERE recipes.title ILIKE $1 OR ingredients.name ILIKE $1
    `;
    const result = await pool.query(query, [`%${searchTerm}%`]);
    return result.rows;
  }
}

export default RecipeRepository;
