export interface RecipeState {
  id?: string;
  title: string;
  category: string;
  secondaryCategory: string;
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

export interface User {
  email: string;
  nickname: string;
  bio: string;
  location: string;
  instagram: string;
  tiktok: string;
  experience_level: string;
}
