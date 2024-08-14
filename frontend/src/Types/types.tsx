export interface RecipeState {
  id?: string;
  title: string;
  category: string;
  secondary_category: string;
  ingredients: Ingredient[];
  instructions: string;
  user_id: string;
  picture_url: string;
  nickname?: string;
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

export interface Comment {
  id: number;
  content: string;
  timestamp: string;
  nickname: string;
  profile_picture_url: string;
  user_id: number;
}
