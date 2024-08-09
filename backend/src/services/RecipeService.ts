import Recipe from "../models/Recipe";
import RecipeRepository from "../repositories/RecipeRepository";

class RecipeService {
  private recipeRepository: RecipeRepository;

  constructor(recipeRepository: RecipeRepository) {
    this.recipeRepository = recipeRepository;
  }

  async createRecipe(recipeData: any) {
    const recipe = await this.recipeRepository.createRecipe(recipeData);
    return recipe;
  }

  async uploadFile(file: Express.Multer.File): Promise<number> {
    try {
      const fileId = await this.recipeRepository.uploadFile(file);
      return fileId;
    } catch (error) {
      // Handle error
      console.error(error);
      throw error;
    }
  }

  async searchRecipes(searchTerm: string): Promise<Recipe[]> {
    return this.recipeRepository.searchByIngredientOrName(searchTerm);
  }

  async getRecipeById(id: number): Promise<Recipe | null> {
    return this.recipeRepository.getRecipeById(id);
  }

  async getRandomRecipeId(): Promise<number | null> {
    return this.recipeRepository.getRandomRecipeId();
  }

  async getUserRecipes(user_id: number): Promise<Recipe[]> {
    return this.recipeRepository.getUserRecipes(user_id);
  }
}

export default RecipeService;
