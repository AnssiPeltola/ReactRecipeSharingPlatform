class Recipe {
  id: number;
  userId: number;
  title: string;
  category: string;
  secondary_category?: string;
  ingredients: Ingredient[];
  instructions: string;
  pictureUrl: string;

  constructor(
    id: number,
    userId: number,
    title: string,
    category: string,
    ingredients: Ingredient[],
    instructions: string,
    pictureUrl: string
  ) {
    this.id = id;
    this.userId = userId;
    this.title = title;
    this.category = category;
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
