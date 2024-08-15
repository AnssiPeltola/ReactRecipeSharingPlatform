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

  async likeRecipe(userId: number, recipeId: number) {
    await this.recipeRepository.likeRecipe(userId, recipeId);
  }

  async unlikeRecipe(userId: number, recipeId: number) {
    await this.recipeRepository.unlikeRecipe(userId, recipeId);
  }

  async getLikedRecipes(userId: number) {
    return this.recipeRepository.getLikedRecipes(userId);
  }

  async isRecipeLiked(userId: number, recipeId: number): Promise<boolean> {
    return this.recipeRepository.isRecipeLiked(userId, recipeId);
  }

  async getRecipeLikes(recipeId: number) {
    return await this.recipeRepository.getRecipeLikes(recipeId);
  }

  async addComment(recipeId: number, userId: number, content: string) {
    return this.recipeRepository.addComment(recipeId, userId, content);
  }

  async getComments(recipeId: number) {
    return this.recipeRepository.getComments(recipeId);
  }

  async deleteComment(commentId: number, userId: number) {
    return this.recipeRepository.deleteComment(commentId, userId);
  }

  async getLatestRecipes() {
    return await this.recipeRepository.getLatestRecipes();
  }
}

export default RecipeService;
