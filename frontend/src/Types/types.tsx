export interface RecipeState {
  title: string;
  category: string;
  ingredients: Ingredient[];
  instructions: string;
  pictureId: string;
  userId: string;
  picture_url?: string;
}

export interface Ingredient {
  id: string;
  quantity: string;
  unit: string;
  name: string;
}
