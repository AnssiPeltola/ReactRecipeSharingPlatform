import Recipe from "../models/Recipe";
import RecipeRepository from "../repositories/RecipeRepository";

class RecipeService {
  private recipeRepository: RecipeRepository;

  constructor(recipeRepository: RecipeRepository) {
    this.recipeRepository = recipeRepository;
  }

  async createRecipe(recipeData: any) {
    // Validate the incoming data
    if (
      !recipeData.title ||
      !recipeData.category ||
      !recipeData.mainIngredient ||
      !recipeData.instructions ||
      !recipeData.user_id
    ) {
      throw new Error("Missing required fields");
    }

    try {
      const recipe = await this.recipeRepository.createRecipe(recipeData);
      return recipe;
    } catch (error) {
      console.error("Error in RecipeService.createRecipe:", error);
      throw error;
    }
  }

  async updateRecipe(recipeId: number, recipeData: any) {
    // Validate the incoming data
    if (
      !recipeData.title ||
      !recipeData.category ||
      !recipeData.mainIngredient ||
      !recipeData.instructions ||
      !recipeData.user_id
    ) {
      throw new Error("Missing required fields");
    }

    try {
      const recipe = await this.recipeRepository.updateRecipe(
        recipeId,
        recipeData
      );
      return recipe;
    } catch (error) {
      console.error("Error in RecipeService.updateRecipe:", error);
      throw error;
    }
  }

  async deleteRecipe(recipeId: number, userId: number) {
    return this.recipeRepository.deleteRecipe(recipeId, userId);
  }

  async uploadFile(
    file: Express.Multer.File,
    recipeId: number
  ): Promise<number> {
    try {
      const fileId = await this.recipeRepository.uploadFile(file, recipeId);
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

  async getRecipes(
    searchTerm: string,
    page: number,
    limit: number,
    sortBy: string
  ): Promise<Recipe[]> {
    return this.recipeRepository.getRecipes(searchTerm, page, limit, sortBy);
  }

  async getTotalRecipes(searchTerm: string) {
    return this.recipeRepository.getTotalRecipes(searchTerm);
  }

  async getRecipeById(id: number): Promise<Recipe | null> {
    return this.recipeRepository.getRecipeById(id);
  }

  async getRandomRecipeId(): Promise<number | null> {
    return this.recipeRepository.getRandomRecipeId();
  }

  async getUserRecipes(
    userId: number,
    page: number,
    limit: number,
    sortBy: string
  ) {
    return this.recipeRepository.getUserRecipes(userId, page, limit, sortBy);
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

  async getComments(recipeId: number, page: number, limit: number) {
    return this.recipeRepository.getComments(recipeId, page, limit);
  }

  async getTotalComments(recipeId: number) {
    return this.recipeRepository.getTotalComments(recipeId);
  }

  async deleteComment(commentId: number, userId: number) {
    return this.recipeRepository.deleteComment(commentId, userId);
  }

  async getLatestRecipes() {
    return await this.recipeRepository.getLatestRecipes();
  }

  async updateRecipePicture(recipeId: number, pictureUrl: string) {
    try {
      await this.recipeRepository.updateRecipePicture(recipeId, pictureUrl);
    } catch (error) {
      // Handle error
      console.error(error);
      throw error;
    }
  }

  async getTopRecipesWeek() {
    return await this.recipeRepository.getTopRecipesWeek();
  }

  async getUniqueRecipeNamesAndIngredients(
    searchTerm: string
  ): Promise<string[]> {
    return this.recipeRepository.getUniqueRecipeNamesAndIngredients(searchTerm);
  }

  async getUnlikedRecipes(
    userId: number,
    excludeIds: number[],
    filters: {
      category?: string;
      mainIngredient?: string;
      secondaryCategories?: string[];
    },
    page: number = 1,
    pageSize: number = 20
  ): Promise<Recipe[]> {
    const offset = (page - 1) * pageSize;
    return this.recipeRepository.fetchUnlikedRecipes({
      userId,
      excludeIds,
      ...filters,
      limit: pageSize,
      offset,
    });
  }
}

export default RecipeService;
