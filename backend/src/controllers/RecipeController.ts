import { Request, Response } from "express";
import RecipeService from "../services/RecipeService";

class RecipeController {
  private recipeService: RecipeService;

  constructor(recipeService: RecipeService) {
    this.recipeService = recipeService;
  }

  async createRecipe(req: Request, res: Response) {
    const recipe = await this.recipeService.createRecipe(req.body);
    res.json(recipe);
  }

  uploadFile = async (req: Request, res: Response) => {
    const file = req.file;
    if (!file) {
      return res.status(400).send("No file uploaded");
    }

    try {
      const fileId = await this.recipeService.uploadFile(file);
      return res.json({ fileId });
    } catch (error) {
      // Handle error
      console.error(error);
      return res.status(500).send("Error uploading file");
    }
  };

  async searchRecipes(req: Request, res: Response) {
    try {
      const { query } = req.query;
      if (!query || typeof query !== "string") {
        return res.status(400).send("Query parameter is required");
      }
      const recipes = await this.recipeService.searchRecipes(query);
      res.json(recipes);
    } catch (error) {
      console.error(error);
      res.status(500).send("An error occurred while searching for recipes");
    }
  }

  async getRecipeById(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        res.status(400).json({ message: "Invalid recipe ID" });
        return;
      }

      const recipe = await this.recipeService.getRecipeById(id);
      if (!recipe) {
        res.status(404).json({ message: "Recipe not found" });
        return;
      }

      res.json(recipe);
    } catch (error) {
      console.error("Error fetching recipe details:", error);
      res.status(500).json({ message: "Error fetching recipe details" });
    }
  }
}

export default RecipeController;
