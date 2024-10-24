export interface RecipeState {
  id?: string;
  title: string;
  category: string;
  created_at: string;
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
  Kasvikset: string[];
  Kasviproteiinit: string[];
  "Viljat ja pastat": string[];
  "Maitotuotteet ja kananmunat": string[];
  "Pähkinät ja siemenet": string[];
  "Marjat ja hedelmät": string[];
  Muut: string[];
};

export const mainIngredients: MainIngredientsType = {
  Liha: ["Naudanliha", "Sianliha", "Lampaanliha", "Riista", "Muu liha"],
  Siipikarja: ["Kana", "Kalkkuna", "Ankka", "Muu siipikarja"],
  "Kala ja merenelävät": [
    "Lohi",
    "Tonnikala",
    "Katkarapu",
    "Simpukat",
    "Muu kala",
  ],
  Kasvikset: [
    "Parsakaali",
    "Kesäkurpitsa",
    "Bataatti",
    "Pinaatti",
    "Peruna",
    "Porkkana",
    "Sipuli",
    "Paprika",
    "Tomaatti",
    "Kukkakaali",
    "Kurkku",
    "Salaatti",
    "Muu kasvis",
  ],
  Kasviproteiinit: [
    "Tofu",
    "Herneet",
    "Linssit",
    "Pavut",
    "Sienet",
    "Soijatuotteet",
    "Seitan",
    "Härkis",
    "Nyhtökaura",
    "Muu kasviproteiini",
  ],
  "Viljat ja pastat": [
    "Riisi",
    "Pasta",
    "Quinoa",
    "Bulgur",
    "Ohrasuurimot",
    "Kaurahiutaleet",
    "Muu vilja",
  ],
  "Maitotuotteet ja kananmunat": [
    "Juusto",
    "Maito",
    "Kananmuna",
    "Kerma",
    "Raejuusto",
    "Muu maitotuote",
  ],
  "Pähkinät ja siemenet": [
    "Mantelit",
    "Cashew-pähkinät",
    "Auringonkukansiemenet",
    "Kurpitsansiemenet",
    "Pellavansiemenet",
    "Chiansiemenet",
    "Sesaminsiemenet",
    "Maapähkinät",
    "Pistaasipähkinät",
    "Saksanpähkinät",
    "Muu pähkinä tai siemen",
  ],
  "Marjat ja hedelmät": [
    "Mansikat",
    "Mustikat",
    "Omenat",
    "Banaanit",
    "Kuivatut hedelmät",
    "Appelsiinit",
    "Sitruuna",
    "Lime",
    "Vadelmat",
    "Mustaherukat",
    "Karviaiset",
    "Karpalot",
    "Vesimeloni",
    "Ananas",
    "Mango",
    "Kiivi",
    "Muu marja tai hedelmä",
  ],
  Muut: ["Muu", "Mausteet", "Hunaja"],
};
