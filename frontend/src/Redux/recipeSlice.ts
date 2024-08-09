import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RecipeState, Ingredient } from "../Types/types";

const initialState: RecipeState = {
  title: "",
  category: "",
  secondary_category: "",
  ingredients: [],
  instructions: "",
  picture_url: "",
  user_id: "",
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
    resetState: (state) => {
      state.title = "";
      state.category = "";
      state.secondary_category = "";
      state.ingredients = [];
      state.instructions = "";
      state.picture_url = "";
      state.user_id = "";
    },
  },
});

export const {
  setTitle,
  setCategory,
  setsecondary_category,
  setIngredients,
  setInstructions,
  setpicture_url,
  setuser_id,
  resetState,
} = recipeSlice.actions;

export default recipeSlice.reducer;
