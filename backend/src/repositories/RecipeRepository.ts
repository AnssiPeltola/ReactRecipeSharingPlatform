import { pool } from "../config/db";
import Recipe from "../models/Recipe";
import { QueryConfig } from "pg";

class RecipeRepository {
  async createRecipe(recipe: Recipe) {
    const client = await pool.connect();
    try {
      await client.query("BEGIN");

      // Check if user exists (unchanged)
      const userCheckQuery: QueryConfig = {
        text: "SELECT id FROM users WHERE id = $1",
        values: [recipe.user_id],
      };
      const userCheckResult = await client.query(userCheckQuery);

      if (userCheckResult.rowCount === 0) {
        throw new Error(`User with id ${recipe.user_id} does not exist`);
      }

      // Insert the recipe (removed secondary_category)
      const recipeInsertQuery: QueryConfig = {
        text: `
          INSERT INTO recipes(user_id, title, category, main_ingredient, instructions, picture_url)
          VALUES($1, $2, $3, $4, $5, $6)
          RETURNING id
        `,
        values: [
          recipe.user_id,
          recipe.title,
          recipe.category,
          recipe.mainIngredient,
          recipe.instructions,
          recipe.pictureUrl,
        ],
      };
      const recipeResult = await client.query(recipeInsertQuery);
      const recipeId = recipeResult.rows[0].id;

      // Handle secondary categories
      if (
        recipe.secondary_categories &&
        recipe.secondary_categories.length > 0
      ) {
        for (const categoryName of recipe.secondary_categories) {
          // Insert or get category ID
          const categoryQuery: QueryConfig = {
            text: `
              INSERT INTO secondary_categories (name)
              VALUES ($1)
              ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name
              RETURNING id
            `,
            values: [categoryName],
          };
          const categoryResult = await client.query(categoryQuery);
          const categoryId = categoryResult.rows[0].id;

          // Link category to recipe
          await client.query({
            text: `
              INSERT INTO recipe_secondary_categories (recipe_id, category_id)
              VALUES ($1, $2)
            `,
            values: [recipeId, categoryId],
          });
        }
      }

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

      await client.query("COMMIT");
      return { ...recipe, id: recipeId };
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  }

  async updateRecipe(recipeId: number, recipe: Recipe) {
    const client = await pool.connect();
    try {
      await client.query("BEGIN");

      // Check if the user exists (unchanged)
      const userCheckQuery: QueryConfig = {
        text: "SELECT id FROM users WHERE id = $1",
        values: [recipe.user_id],
      };
      const userCheckResult = await client.query(userCheckQuery);

      if (userCheckResult.rowCount === 0) {
        throw new Error(`User with id ${recipe.user_id} does not exist`);
      }

      // Update the recipe (removed secondary_category)
      const recipeUpdateQuery: QueryConfig = {
        text: `
          UPDATE recipes
          SET title = $1, category = $2, main_ingredient = $3, instructions = $4, picture_url = $5
          WHERE id = $6
        `,
        values: [
          recipe.title,
          recipe.category,
          recipe.mainIngredient,
          recipe.instructions,
          recipe.pictureUrl,
          recipeId,
        ],
      };
      await client.query(recipeUpdateQuery);

      // Handle secondary categories
      await client.query({
        text: "DELETE FROM recipe_secondary_categories WHERE recipe_id = $1",
        values: [recipeId],
      });

      if (
        recipe.secondary_categories &&
        recipe.secondary_categories.length > 0
      ) {
        for (const categoryName of recipe.secondary_categories) {
          // Insert or get category ID
          const categoryQuery: QueryConfig = {
            text: `
              INSERT INTO secondary_categories (name)
              VALUES ($1)
              ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name
              RETURNING id
            `,
            values: [categoryName],
          };
          const categoryResult = await client.query(categoryQuery);
          const categoryId = categoryResult.rows[0].id;

          // Link category to recipe
          await client.query({
            text: `
              INSERT INTO recipe_secondary_categories (recipe_id, category_id)
              VALUES ($1, $2)
            `,
            values: [recipeId, categoryId],
          });
        }
      }

      // Delete existing ingredients
      await client.query({
        text: "DELETE FROM recipe_ingredients WHERE recipe_id = $1",
        values: [recipeId],
      });

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

      await client.query("COMMIT");
      return { ...recipe, id: recipeId };
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
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
      SELECT DISTINCT r.*, 
        STRING_AGG(DISTINCT sc.name, ', ') as secondary_categories
      FROM recipes r
      LEFT JOIN recipe_ingredients ri ON r.id = ri.recipe_id
      LEFT JOIN ingredients i ON ri.ingredient_id = i.id
      LEFT JOIN recipe_secondary_categories rsc ON r.id = rsc.recipe_id
      LEFT JOIN secondary_categories sc ON rsc.category_id = sc.id
      WHERE r.title ILIKE $1 
        OR i.name ILIKE $1
        OR r.category ILIKE $1
        OR sc.name ILIKE $1
      GROUP BY r.id
    `;
    const result = await pool.query(query, [`%${searchTerm}%`]);

    // Transform the results to include secondary_categories as an array
    return result.rows.map((row) => ({
      ...row,
      secondary_categories: row.secondary_categories
        ? row.secondary_categories.split(", ")
        : [],
    }));
  }

  async getRecipeById(id: number): Promise<Recipe | null> {
    const query = {
      text: `
        WITH recipe_basics AS (
          SELECT 
            r.*,
            u.nickname,
            STRING_AGG(DISTINCT sc.name, ', ') as secondary_categories
          FROM recipes r
          INNER JOIN users u ON r.user_id = u.id
          LEFT JOIN recipe_secondary_categories rsc ON r.id = rsc.recipe_id
          LEFT JOIN secondary_categories sc ON rsc.category_id = sc.id
          WHERE r.id = $1
          GROUP BY r.id, u.nickname
        )
        SELECT 
          rb.*,
          ri.quantity,
          ri.unit,
          i.name AS ingredient_name
        FROM recipe_basics rb
        LEFT JOIN recipe_ingredients ri ON rb.id = ri.recipe_id
        LEFT JOIN ingredients i ON ri.ingredient_id = i.id
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
        nickname: rows[0].nickname,
        secondary_categories: rows[0].secondary_categories
          ? rows[0].secondary_categories.split(", ")
          : [],
      };

      return recipe;
    } catch (error) {
      console.error("Error querying the database", error);
      throw error;
    }
  }

  async getRecipes(
    searchTerm: string,
    page: number,
    limit: number,
    sortBy: string
  ): Promise<Recipe[]> {
    const offset = (page - 1) * limit;
    let orderByClause = "";
    let additionalSelectClause = "";

    switch (sortBy) {
      case "title":
        orderByClause = "ORDER BY r.title";
        break;
      case "category":
        orderByClause = "ORDER BY r.category";
        break;
      case "created_at":
        orderByClause = "ORDER BY r.created_at DESC";
        break;
      case "oldest":
        orderByClause = "ORDER BY r.created_at ASC";
        break;
      case "most_liked":
        additionalSelectClause =
          ", (SELECT COUNT(*) FROM recipe_likes rl WHERE rl.recipe_id = r.id) AS like_count";
        orderByClause = "ORDER BY like_count DESC";
        break;
      case "most_commented":
        additionalSelectClause =
          ", (SELECT COUNT(*) FROM recipe_comments rc WHERE rc.recipe_id = r.id) AS comment_count";
        orderByClause = "ORDER BY comment_count DESC";
        break;
      default:
        orderByClause = "ORDER BY r.created_at DESC";
    }

    const query: QueryConfig = {
      text: `
        SELECT DISTINCT 
          r.id, 
          r.title, 
          r.picture_url, 
          r.created_at, 
          r.category,
          STRING_AGG(DISTINCT sc.name, ', ') as secondary_categories
          ${additionalSelectClause}
        FROM recipes r
        LEFT JOIN recipe_ingredients ri ON r.id = ri.recipe_id
        LEFT JOIN ingredients i ON ri.ingredient_id = i.id
        LEFT JOIN recipe_secondary_categories rsc ON r.id = rsc.recipe_id
        LEFT JOIN secondary_categories sc ON rsc.category_id = sc.id
        WHERE r.title ILIKE $1
          OR r.category ILIKE $1
          OR i.name ILIKE $1
          OR sc.name ILIKE $1
        GROUP BY 
          r.id, 
          r.title, 
          r.picture_url, 
          r.created_at, 
          r.category
        ${orderByClause}
        LIMIT $2 OFFSET $3
      `,
      values: [`%${searchTerm}%`, limit, offset],
    };
    const result = await pool.query(query);

    // Transform the results to include secondary_categories as an array
    return result.rows.map((row) => ({
      ...row,
      secondary_categories: row.secondary_categories
        ? row.secondary_categories.split(", ")
        : [],
    }));
  }

  async getTotalRecipes(searchTerm: string) {
    const query: QueryConfig = {
      text: `
        SELECT COUNT(DISTINCT r.id) 
        FROM recipes r
        LEFT JOIN recipe_ingredients ri ON r.id = ri.recipe_id
        LEFT JOIN ingredients i ON ri.ingredient_id = i.id
        LEFT JOIN recipe_secondary_categories rsc ON r.id = rsc.recipe_id
        LEFT JOIN secondary_categories sc ON rsc.category_id = sc.id
        WHERE r.title ILIKE $1
          OR r.category ILIKE $1
          OR i.name ILIKE $1
          OR sc.name ILIKE $1
      `,
      values: [`%${searchTerm}%`],
    };
    const result = await pool.query(query);
    return parseInt(result.rows[0].count, 10);
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

  async getComments(recipeId: number, page: number, limit: number) {
    const offset = (page - 1) * limit;
    const query: QueryConfig = {
      text: `
        SELECT c.id, c.content, c.timestamp, c.user_id, u.nickname, pp.id AS profile_picture_id
        FROM recipe_comments c
        JOIN users u ON c.user_id = u.id
        LEFT JOIN profile_pictures pp ON u.id = pp.user_id
        WHERE c.recipe_id = $1
        ORDER BY c.timestamp DESC
        LIMIT $2 OFFSET $3
      `,
      values: [recipeId, limit, offset],
    };
    const result = await pool.query(query);
    return result.rows.map((row) => ({
      ...row,
      profile_picture_url: row.profile_picture_id
        ? `/profile_picture/${row.profile_picture_id}`
        : null,
    }));
  }

  async getTotalComments(recipeId: number) {
    const query: QueryConfig = {
      text: `SELECT COUNT(*) FROM recipe_comments WHERE recipe_id = $1`,
      values: [recipeId],
    };
    const result = await pool.query(query);
    return parseInt(result.rows[0].count, 10);
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

  async getUniqueRecipeNamesAndIngredients(
    searchTerm: string
  ): Promise<string[]> {
    const query: QueryConfig = {
      text: `
        SELECT name, priority FROM (
          SELECT r.title AS name, 
                 CASE 
                   WHEN r.title ILIKE $1 THEN 1
                   ELSE 2
                 END AS priority
          FROM recipes r
          WHERE r.title ILIKE $2
          UNION
          SELECT i.name AS name, 
                 CASE 
                   WHEN i.name ILIKE $1 THEN 3
                   ELSE 4
                 END AS priority
          FROM ingredients i
          WHERE i.name ILIKE $2
        ) AS combined
        ORDER BY priority, name
      `,
      values: [searchTerm, `%${searchTerm}%`],
    };
    const result = await pool.query(query);
    return result.rows.map((row) => row.name);
  }

  async fetchUnlikedRecipes({
    userId,
    excludeIds,
    category,
    mainIngredient,
    secondaryCategories,
    limit,
    offset,
  }: {
    userId: number;
    excludeIds: number[];
    category?: string;
    mainIngredient?: string;
    secondaryCategories?: string[];
    limit: number;
    offset: number;
  }): Promise<Recipe[]> {
    const client = await pool.connect();
    try {
      await client.query("BEGIN");

      const query: QueryConfig = {
        text: `
          WITH available_recipes AS (
            SELECT r.id
            FROM recipes r
            LEFT JOIN recipe_likes rl ON r.id = rl.recipe_id AND rl.user_id = $1
            WHERE rl.id IS NULL
            AND NOT r.id = ANY($2::int[])
            AND ($3::VARCHAR IS NULL OR r.category = $3)
            AND ($4::VARCHAR IS NULL OR r.main_ingredient = $4)
            AND ($5::VARCHAR[] IS NULL OR r.id IN (
              SELECT recipe_id 
              FROM recipe_secondary_categories rsc
              JOIN secondary_categories sc ON rsc.category_id = sc.id
              WHERE sc.name = ANY($5)
            ))
          ),
          randomized_recipes AS (
            SELECT id
            FROM available_recipes
            ORDER BY random() * (SELECT count(*) FROM available_recipes)  -- More random distribution
            LIMIT $6
            OFFSET $7
          )
          SELECT 
            r.*,
            u.nickname,
            STRING_AGG(DISTINCT sc.name, ', ') as secondary_categories
          FROM recipes r
          INNER JOIN users u ON r.user_id = u.id
          LEFT JOIN recipe_secondary_categories rsc ON r.id = rsc.recipe_id
          LEFT JOIN secondary_categories sc ON rsc.category_id = sc.id
          WHERE r.id IN (SELECT id FROM randomized_recipes)
          GROUP BY r.id, u.nickname
          ORDER BY random();  -- Additional randomization
        `,
        values: [
          userId,
          excludeIds.length > 0 ? excludeIds : [0],
          category || null,
          mainIngredient || null,
          secondaryCategories || null,
          limit,
          offset,
        ],
      };
      const { rows } = await client.query(query);
      await client.query("COMMIT");
      return rows.map((row) => ({
        ...row,
        secondary_categories: row.secondary_categories
          ? row.secondary_categories.split(", ")
          : [],
      }));
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  }
}

export default RecipeRepository;
