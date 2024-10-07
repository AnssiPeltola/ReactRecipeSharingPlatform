import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RecipeState, Ingredient } from "../Types/types";
import { v4 as uuidv4 } from "uuid";

const initialState: RecipeState = {
  title: "",
  category: "",
  secondary_category: "",
  main_ingredient: "",
  main_ingredient_category: "",
  ingredients: [],
  instructions: "",
  picture_url: "",
  user_id: "",
  previewUrl: null,
  selectedFile: null,
};

const recipeSlice = createSlice({
  name: "recipe",
  initialState,
  reducers: {
    setTitle: (state, action: PayloadAction<string>) => {
      state.title = action.payload;
    },
    setCategory: (state, action: PayloadAction<string>) => {
      state.category = action.payload;
    },
    setsecondary_category: (state, action: PayloadAction<string>) => {
      state.secondary_category = action.payload;
    },
    setMainIngredient: (state, action: PayloadAction<string>) => {
      state.main_ingredient = action.payload;
    },
    setMainIngredientCategory: (state, action: PayloadAction<string>) => {
      state.main_ingredient_category = action.payload;
    },
    setIngredients: (state, action: PayloadAction<Ingredient[]>) => {
      state.ingredients = action.payload;
    },
    setInstructions: (state, action: PayloadAction<string>) => {
      state.instructions = action.payload;
    },
    setpicture_url: (state, action: PayloadAction<string>) => {
      state.picture_url = action.payload;
    },
    setuser_id: (state, action: PayloadAction<string>) => {
      state.user_id = action.payload;
    },
    setPreviewUrl: (state, action: PayloadAction<string | null>) => {
      state.previewUrl = action.payload;
    },
    setSelectedFile: (state, action: PayloadAction<File | null>) => {
      state.selectedFile = action.payload;
    },
    resetState: (state) => {
      state.title = "";
      state.category = "";
      state.secondary_category = "";
      state.main_ingredient = "";
      state.main_ingredient_category = "";
      state.ingredients = [];
      state.instructions = "";
      state.picture_url = "";
      state.user_id = "";
      state.previewUrl = null;
      state.selectedFile = null;
    },
    setRecipeState: (state, action: PayloadAction<RecipeState>) => {
      const newState = { ...state, ...action.payload };
      newState.ingredients = newState.ingredients.map((ingredient) => ({
        ...ingredient,
        id: ingredient.id || uuidv4(),
      }));
      return newState;
    },
  },
});

export const {
  setTitle,
  setCategory,
  setsecondary_category,
  setMainIngredient,
  setMainIngredientCategory,
  setIngredients,
  setInstructions,
  setpicture_url,
  setuser_id,
  setPreviewUrl,
  setSelectedFile,
  resetState,
  setRecipeState,
} = recipeSlice.actions;

export default recipeSlice.reducer;
