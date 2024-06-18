export interface RecipeState {
  title: string;
  category: string;
  ingredients: Ingredient[];
  instructions: string;
  pictureId: string;
  userId: string;
}

export interface Ingredient {
  id: string;
  quantity: string;
  unit: string;
  name: string;
}
