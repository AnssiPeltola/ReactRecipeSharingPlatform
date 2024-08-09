import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RecipeState, Ingredient } from "../Types/types";

const initialState: RecipeState = {
  title: "",
  category: "",
  secondary_category: "",
  ingredients: [],
  instructions: "",
  pictureId: "",
  userId: "",
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
    setPictureId: (state, action: PayloadAction<string>) => {
      state.pictureId = action.payload;
    },
    setUserId: (state, action: PayloadAction<string>) => {
      state.userId = action.payload;
    },
    resetState: (state) => {
      state.title = "";
      state.category = "";
      state.secondary_category = "";
      state.ingredients = [];
      state.instructions = "";
      state.pictureId = "";
      state.userId = "";
    },
  },
});

export const {
  setTitle,
  setCategory,
  setsecondary_category,
  setIngredients,
  setInstructions,
  setPictureId,
  setUserId,
  resetState,
} = recipeSlice.actions;

export default recipeSlice.reducer;
