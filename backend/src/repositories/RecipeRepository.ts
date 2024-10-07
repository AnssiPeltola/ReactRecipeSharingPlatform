import { pool } from "../config/db";
import Recipe from "../models/Recipe";
import { QueryConfig } from "pg";

class RecipeRepository {
  async createRecipe(recipe: Recipe) {
    const client = await pool.connect();
    try {
      await client.query("BEGIN"); // Start transaction

      // Check if the user exists
      const userCheckQuery: QueryConfig = {
        text: "SELECT id FROM users WHERE id = $1",
        values: [recipe.user_id],
      };
      const userCheckResult = await client.query(userCheckQuery);

      if (userCheckResult.rowCount === 0) {
        throw new Error(`User with id ${recipe.user_id} does not exist`);
      }

      // Insert the recipe
      const recipeInsertQuery: QueryConfig = {
        text: `
          INSERT INTO recipes(user_id, title, category, secondary_category, main_ingredient, instructions, picture_url)
          VALUES($1, $2, $3, $4, $5, $6, $7)
          RETURNING id
        `,
        values: [
          recipe.user_id,
          recipe.title,
          recipe.category,
          recipe.secondary_category || null,
          recipe.mainIngredient,
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

  async updateRecipe(recipeId: number, recipe: Recipe) {
    const client = await pool.connect();
    try {
      await client.query("BEGIN"); // Start transaction

      // Check if the user exists
      const userCheckQuery: QueryConfig = {
        text: "SELECT id FROM users WHERE id = $1",
        values: [recipe.user_id],
      };
      const userCheckResult = await client.query(userCheckQuery);

      if (userCheckResult.rowCount === 0) {
        throw new Error(`User with id ${recipe.user_id} does not exist`);
      }

      // Update the recipe
      const recipeUpdateQuery: QueryConfig = {
        text: `
          UPDATE recipes
          SET title = $1, category = $2, secondary_category = $3, main_ingredient = $4, instructions = $5, picture_url = $6
          WHERE id = $7
        `,
        values: [
          recipe.title,
          recipe.category,
          recipe.secondary_category || null,
          recipe.mainIngredient,
          recipe.instructions,
          recipe.pictureUrl,
          recipeId,
        ],
      };
      await client.query(recipeUpdateQuery);

      // Delete existing ingredients
      const deleteIngredientsQuery: QueryConfig = {
        text: "DELETE FROM recipe_ingredients WHERE recipe_id = $1",
        values: [recipeId],
      };
      await client.query(deleteIngredientsQuery);

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
      return { ...recipe, id: recipeId }; // Return the updated recipe with ID
    } catch (error) {
      await client.query("ROLLBACK"); // Rollback transaction on error
      throw error; // Rethrow the error
    } finally {
      client.release();
    }
  }

  async deleteRecipe(recipeId: number, userId: number) {
    const client = await pool.connect();
    try {
      await client.query("BEGIN"); // Start transaction

      // Check if the recipe belongs to the user
      const recipeCheckQuery: QueryConfig = {
        text: "SELECT id FROM recipes WHERE id = $1 AND user_id = $2",
        values: [recipeId, userId],
      };
      const recipeCheckResult = await client.query(recipeCheckQuery);

      if (recipeCheckResult.rowCount === 0) {
        throw new Error("You do not have permission to delete this recipe");
      }

      // Delete the recipe
      const deleteRecipeQuery: QueryConfig = {
        text: "DELETE FROM recipes WHERE id = $1",
        values: [recipeId],
      };
      await client.query(deleteRecipeQuery);

      await client.query("COMMIT"); // Commit transaction
      return true;
    } catch (error) {
      await client.query("ROLLBACK"); // Rollback transaction on error
      console.error("Error deleting recipe:", error);
      return false;
    } finally {
      client.release();
    }
  }

  async uploadFile(
    file: Express.Multer.File,
    recipeId: number
  ): Promise<number> {
    const { originalname: name, mimetype: type, buffer: data } = file;

    const query: QueryConfig = {
      text: "INSERT INTO recipe_pictures (recipe_id, name, type, data) VALUES ($1, $2, $3, $4) RETURNING id",
      values: [recipeId, name, type, data],
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
      WHERE recipes.title ILIKE $1 
        OR ingredients.name ILIKE $1
        OR recipes.category ILIKE $1
        OR recipes.secondary_category ILIKE $1
    `;
    const result = await pool.query(query, [`%${searchTerm}%`]);
    return result.rows;
  }

  async getRecipeById(id: number): Promise<Recipe | null> {
    const query = {
      text: `
        SELECT r.*, ri.quantity, ri.unit, i.name AS ingredient_name, u.nickname
        FROM recipes r
        INNER JOIN recipe_ingredients ri ON r.id = ri.recipe_id
        INNER JOIN ingredients i ON ri.ingredient_id = i.id
        INNER JOIN users u ON r.user_id = u.id
        WHERE r.id = $1
      `,
      values: [id],
    };

    try {
      const { rows } = await pool.query(query);
      if (rows.length === 0) {
        return null;
      }

      // Transform rows into a structured recipe object
      const recipe = {
        ...rows[0],
        ingredients: rows.map((row) => ({
          name: row.ingredient_name,
          quantity: row.quantity,
          unit: row.unit,
        })),
        nickname: rows[0].nickname, // Include the nickname
      };

      return recipe;
    } catch (error) {
      console.error("Error querying the database", error);
      throw error;
    }
  }

  async getRandomRecipeId(): Promise<number | null> {
    const query = {
      text: "SELECT id FROM recipes ORDER BY RANDOM() LIMIT 1",
    };

    try {
      const { rows } = await pool.query(query);
      if (rows.length === 0) {
        return null;
      }
      return rows[0].id;
    } catch (error) {
      console.error("Error querying the database", error);
      throw error;
    }
  }

  async getUserRecipes(user_id: number): Promise<Recipe[]> {
    const query: QueryConfig = {
      text: "SELECT * FROM recipes WHERE user_id = $1",
      values: [user_id],
    };

    try {
      const { rows } = await pool.query(query);
      return rows;
    } catch (error) {
      console.error("Error querying the database", error);
      throw error;
    }
  }

  async likeRecipe(userId: number, recipeId: number) {
    const query = `
      INSERT INTO recipe_likes (user_id, recipe_id)
      VALUES ($1, $2)
      ON CONFLICT (user_id, recipe_id) DO NOTHING
    `;
    await pool.query(query, [userId, recipeId]);
  }

  async unlikeRecipe(userId: number, recipeId: number) {
    const query = `
      DELETE FROM recipe_likes
      WHERE user_id = $1 AND recipe_id = $2
    `;
    await pool.query(query, [userId, recipeId]);
  }

  async getLikedRecipes(userId: number) {
    const query = `
      SELECT r.*
      FROM recipes r
      JOIN recipe_likes rl ON r.id = rl.recipe_id
      WHERE rl.user_id = $1
    `;
    const result = await pool.query(query, [userId]);
    return result.rows;
  }

  async isRecipeLiked(userId: number, recipeId: number): Promise<boolean> {
    const query = {
      text: "SELECT COUNT(*) FROM recipe_likes WHERE user_id = $1 AND recipe_id = $2",
      values: [userId, recipeId],
    };

    try {
      const result = await pool.query(query);
      return result.rows[0].count > 0;
    } catch (error) {
      console.error("Error querying the database", error);
      throw error;
    }
  }

  async getRecipeLikes(recipeId: number) {
    const query = {
      text: "SELECT COUNT(*) FROM recipe_likes WHERE recipe_id = $1",
      values: [recipeId],
    };
    const result = await pool.query(query);
    return result.rows[0].count;
  }

  async addComment(recipeId: number, userId: number, content: string) {
    const query: QueryConfig = {
      text: "INSERT INTO recipe_comments (recipe_id, user_id, content) VALUES ($1, $2, $3) RETURNING *",
      values: [recipeId, userId, content],
    };
    const result = await pool.query(query);
    return result.rows[0];
  }

  async getComments(recipeId: number) {
    const query: QueryConfig = {
      text: `
        SELECT c.id, c.content, c.timestamp, c.user_id, u.nickname, pp.id AS profile_picture_id
        FROM recipe_comments c
        JOIN users u ON c.user_id = u.id
        LEFT JOIN profile_pictures pp ON u.id = pp.user_id
        WHERE c.recipe_id = $1
        ORDER BY c.timestamp DESC
      `,
      values: [recipeId],
    };
    const result = await pool.query(query);
    return result.rows.map((row) => ({
      ...row,
      profile_picture_url: row.profile_picture_id
        ? `/profile_picture/${row.profile_picture_id}`
        : null,
    }));
  }

  async deleteComment(commentId: number, userId: number) {
    const query: QueryConfig = {
      text: "DELETE FROM recipe_comments WHERE id = $1 AND user_id = $2 RETURNING *",
      values: [commentId, userId],
    };
    const result = await pool.query(query);
    return (result.rowCount ?? 0) > 0;
  }

  async getLatestRecipes(): Promise<Recipe[]> {
    const query = {
      text: "SELECT * FROM recipes ORDER BY created_at DESC LIMIT 6",
    };

    try {
      const { rows } = await pool.query(query);
      return rows;
    } catch (error) {
      console.error("Error querying the database", error);
      throw error;
    }
  }

  async updateRecipePicture(recipeId: number, pictureUrl: string) {
    const query: QueryConfig = {
      text: "UPDATE recipe_pictures SET recipe_id = $1 WHERE id = $2",
      values: [recipeId, pictureUrl],
    };

    await pool.query(query);
  }

  async getTopRecipesWeek(): Promise<Recipe[]> {
    const query = {
      text: `
        SELECT r.id AS recipe_id, r.title, r.picture_url, COUNT(rl.id) AS like_count
        FROM recipe_likes rl
        JOIN recipes r ON rl.recipe_id = r.id
        WHERE rl.created_at >= NOW() - INTERVAL '1 week'
        GROUP BY r.id
        ORDER BY like_count DESC
        LIMIT 6;
      `,
    };

    try {
      const { rows } = await pool.query(query);
      return rows;
    } catch (error) {
      console.error("Error querying the database", error);
      throw error;
    }
  }
}

export default RecipeRepository;
