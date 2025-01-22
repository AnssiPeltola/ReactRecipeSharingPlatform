class Recipe {
  id: number;
  user_id: number;
  title: string;
  category: string;
  mainIngredient?: string;
  secondary_categories?: string[];
  ingredients: Ingredient[];
  instructions: string;
  pictureUrl: string;

  constructor(
    id: number,
    user_id: number,
    title: string,
    category: string,
    mainIngredient: string,
    secondary_categories: string[],
    ingredients: Ingredient[],
    instructions: string,
    pictureUrl: string
  ) {
    this.id = id;
    this.user_id = user_id;
    this.title = title;
    this.category = category;
    this.mainIngredient = mainIngredient;
    this.secondary_categories = secondary_categories;
    this.ingredients = ingredients;
    this.instructions = instructions;
    this.pictureUrl = pictureUrl;
  }
}

interface Ingredient {
  id: string;
  quantity: string;
  unit: string;
  name: string;
}

export default Recipe;
