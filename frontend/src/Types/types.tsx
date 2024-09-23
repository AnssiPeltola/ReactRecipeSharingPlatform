export interface RecipeState {
  id?: string;
  title: string;
  category: string;
  secondary_category: string;
  main_ingredient: string;
  main_ingredient_category: string;
  ingredients: Ingredient[];
  instructions: string;
  user_id: string;
  picture_url: string;
  nickname?: string;
  previewUrl: string | null;
  selectedFile: File | null;
}

export interface Ingredient {
  id: string;
  quantity: string;
  unit: string;
  name: string;
}

export interface User {
  email: string;
  id?: number;
  nickname: string;
  bio: string;
  location: string;
  instagram: string;
  tiktok: string;
  experience_level: string;
  profilePictureId?: number;
  profilePictureType?: string;
  profilePictureData?: Buffer;
}

export interface Comment {
  id: number;
  content: string;
  timestamp: string;
  nickname: string;
  profile_picture_url: string;
  user_id: number;
}

export type MainIngredientsType = {
  Liha: string[];
  Siipikarja: string[];
  "Kala ja merenelävät": string[];
  Kasvispohjaiset: string[];
  "Viljat ja pastat": string[];
  "Maitotuotteet ja kananmunat": string[];
  Muut: string[];
};

export const mainIngredients: MainIngredientsType = {
  Liha: ["Naudanliha", "Sianliha", "Lampaanliha", "Riista"],
  Siipikarja: ["Kana", "Kalkkuna", "Ankka"],
  "Kala ja merenelävät": [
    "Lohi",
    "Tonnikala",
    "Katkarapu",
    "Simpukat",
    "Muu kala",
  ],
  Kasvispohjaiset: [
    "Tofu",
    "Herneet",
    "Linssit",
    "Pavut",
    "Sienet",
    "Soijatuotteet",
    "Peruna",
  ],
  "Viljat ja pastat": ["Riisi", "Pasta", "Quinoa", "Bulgur"],
  "Maitotuotteet ja kananmunat": ["Juusto", "Maito", "Kananmuna"],
  Muut: ["Pähkinät ja siemenet", "Muu"],
};
