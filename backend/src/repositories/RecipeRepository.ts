import { pool } from "../config/db";
import Recipe from "../models/Recipe";
import { QueryConfig } from "pg";

class RecipeRepository {
  async createRecipe(recipe: Recipe) {
    const client = await pool.connect();
    try {
      const query: QueryConfig<any[]> = {
        text: "INSERT INTO recipes(title, category, ingredients, instructions, picture_url) VALUES($1, $2, $3, $4, $5) RETURNING *",
        values: [
          recipe.title,
          recipe.category,
          JSON.stringify(recipe.ingredients),
          recipe.instructions,
          recipe.pictureUrl,
        ],
      };
      const result = await client.query(query);
      return result.rows[0]; // Return the inserted recipe
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
}

export default RecipeRepository;
