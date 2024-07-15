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
}

export default RecipeService;
