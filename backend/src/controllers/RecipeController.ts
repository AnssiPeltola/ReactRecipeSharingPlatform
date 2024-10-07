import { Request, Response } from "express";
import RecipeService from "../services/RecipeService";
import Recipe from "../models/Recipe";
import User from "../models/User";

interface AuthenticatedUser extends Express.User {
  id: number;
}

class RecipeController {
  private recipeService: RecipeService;

  constructor(recipeService: RecipeService) {
    this.recipeService = recipeService;
  }

  async createRecipe(req: Request, res: Response) {
    try {
      const recipe = await this.recipeService.createRecipe(req.body);
      res.status(201).json(recipe);
    } catch (error) {
      console.error("Error creating recipe:", error);
      if ((error as Error).message.includes("User with id")) {
        res.status(400).json({ message: (error as Error).message });
      } else {
        res.status(500).json({ message: "Error creating recipe" });
      }
    }
  }

  async updateRecipe(req: Request, res: Response) {
    try {
      const recipeId = parseInt(req.params.recipeId, 10);
      if (isNaN(recipeId)) {
        throw new Error("Invalid recipe ID");
      }
      const recipe = await this.recipeService.updateRecipe(recipeId, req.body);
      res.status(200).json(recipe);
    } catch (error) {
      console.error("Error updating recipe:", error);
      if ((error as Error).message.includes("User with id")) {
        res.status(400).json({ message: (error as Error).message });
      } else {
        res.status(500).json({ message: "Error updating recipe" });
      }
    }
  }

  async deleteRecipe(req: Request, res: Response) {
    const user = req.user as AuthenticatedUser;
    const userId = user.id;
    const recipeId = parseInt(req.params.recipeId, 10);

    try {
      const success = await this.recipeService.deleteRecipe(recipeId, userId);
      if (!success) {
        return res
          .status(403)
          .json({
            message: "You do not have permission to delete this recipe",
          });
      }
      res.status(200).json({ message: "Recipe deleted successfully" });
    } catch (error) {
      console.error("Error deleting recipe:", error);
      res.status(500).json({ message: "Error deleting recipe" });
    }
  }

  uploadFile = async (req: Request, res: Response) => {
    const file = req.file;
    const { recipeId } = req.body; // Assuming recipeId is sent in the request body

    if (!file) {
      return res.status(400).send("No file uploaded");
    }

    try {
      const fileId = await this.recipeService.uploadFile(file, recipeId);
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

  async getRandomRecipeId(req: Request, res: Response): Promise<void> {
    try {
      const randomRecipeId = await this.recipeService.getRandomRecipeId();
      if (randomRecipeId === null) {
        res.status(404).json({ message: "No recipes found" });
        return;
      }
      res.json({ id: randomRecipeId });
    } catch (error) {
      console.error("Error fetching random recipe ID:", error);
      res.status(500).json({ message: "Error fetching random recipe ID" });
    }
  }

  async getUserRecipes(user_id: number): Promise<Recipe[]> {
    return this.recipeService.getUserRecipes(user_id);
  }

  async likeRecipe(req: Request, res: Response) {
    const user = req.user as AuthenticatedUser;
    if (!user || !user.id) {
      return res.status(401).send("Unauthorized");
    }
    const userId = user.id;
    const recipeId = Number(req.params.id);

    if (isNaN(recipeId)) {
      return res.status(400).send("Invalid recipe ID");
    }

    try {
      await this.recipeService.likeRecipe(userId, recipeId);
      res.status(200).send("Recipe liked");
    } catch (error) {
      console.error("Error liking recipe:", error);
      res.status(500).send("Error liking recipe");
    }
  }

  async unlikeRecipe(req: Request, res: Response) {
    const user = req.user as AuthenticatedUser;
    const userId = user.id;
    const recipeId = Number(req.params.id);

    if (isNaN(recipeId)) {
      return res.status(400).send("Invalid recipe ID");
    }

    try {
      await this.recipeService.unlikeRecipe(userId, recipeId);
      res.status(200).send("Recipe unliked");
    } catch (error) {
      console.error("Error unliking recipe:", error);
      res.status(500).send("Error unliking recipe");
    }
  }

  async getLikedRecipes(req: Request, res: Response) {
    const user = req.user as AuthenticatedUser;
    if (!user || !user.id) {
      return res.status(401).send("Unauthorized");
    }
    const userId = user.id;

    try {
      const likedRecipes = await this.recipeService.getLikedRecipes(userId);
      res.status(200).json(likedRecipes);
    } catch (error) {
      console.error("Error fetching liked recipes:", error);
      res.status(500).send("Error fetching liked recipes");
    }
  }

  async isRecipeLiked(req: Request, res: Response) {
    const user = req.user as AuthenticatedUser;
    if (!user || !user.id) {
      return res.status(401).send("Unauthorized");
    }
    const userId = user.id;
    const recipeId = Number(req.params.recipeId);

    if (isNaN(recipeId)) {
      return res.status(400).send("Invalid recipe ID");
    }

    try {
      const liked = await this.recipeService.isRecipeLiked(userId, recipeId);
      res.json({ liked });
    } catch (error) {
      console.error("Error checking if recipe is liked:", error);
      res.status(500).send("Error checking if recipe is liked");
    }
  }

  async getRecipeLikes(req: Request, res: Response) {
    const recipeId = Number(req.params.recipeId);
    const likes = await this.recipeService.getRecipeLikes(recipeId);
    res.status(200).json({ likes });
  }

  async addComment(req: Request, res: Response) {
    const { recipeId } = req.params;
    const { content } = req.body;
    const user = req.user as AuthenticatedUser;
    const userId = user.id;

    try {
      const comment = await this.recipeService.addComment(
        Number(recipeId),
        userId,
        content
      );
      res.status(201).json(comment);
    } catch (error) {
      console.error("Error adding comment:", error);
      res.status(500).json({ message: "Error adding comment" });
    }
  }

  async getComments(req: Request, res: Response) {
    const { recipeId } = req.params;

    try {
      const comments = await this.recipeService.getComments(Number(recipeId));
      res.status(200).json(comments);
    } catch (error) {
      console.error("Error fetching comments:", error);
      res.status(500).json({ message: "Error fetching comments" });
    }
  }

  async deleteComment(req: Request, res: Response) {
    const { commentId } = req.params;
    const user = req.user as AuthenticatedUser;
    const userId = user.id;

    try {
      const success = await this.recipeService.deleteComment(
        Number(commentId),
        userId
      );
      if (!success) {
        return res
          .status(404)
          .json({ message: "Comment not found or not authorized" });
      }
      res.status(200).json({ message: "Comment deleted" });
    } catch (error) {
      console.error("Error deleting comment:", error);
      res.status(500).json({ message: "Error deleting comment" });
    }
  }

  async getLatestRecipes(req: Request, res: Response) {
    try {
      const latestRecipes = await this.recipeService.getLatestRecipes();
      res.json(latestRecipes);
    } catch (error) {
      res.status(500).json({ message: "Error fetching latest recipes" });
    }
  }

  async updateRecipePicture(req: Request, res: Response) {
    const { recipeId, pictureUrl } = req.body;

    try {
      await this.recipeService.updateRecipePicture(recipeId, pictureUrl);
      res.status(200).json({ message: "Recipe picture updated successfully" });
    } catch (error) {
      console.error("Error updating recipe picture:", error);
      res.status(500).json({ message: "Error updating recipe picture" });
    }
  }

  async getTopRecipesWeek(req: Request, res: Response) {
    try {
      const topRecipes = await this.recipeService.getTopRecipesWeek();
      res.json(topRecipes);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error fetching top recipes of the week" });
    }
  }
}

export default RecipeController;
