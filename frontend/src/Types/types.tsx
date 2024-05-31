export interface RecipeState {
  title: string;
  category: string;
  ingredients: Ingredient[];
  instructions: string;
  pictureUrl: string;
}

export interface Ingredient {
  quantity: string;
  unit: string;
  name: string;
}