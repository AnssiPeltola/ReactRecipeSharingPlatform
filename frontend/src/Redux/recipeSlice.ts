import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RecipeState, Ingredient } from "../Types/types";

const initialState: RecipeState = {
  title: "",
  category: "",
  ingredients: [],
  instructions: "",
  pictureId: "",
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
    setIngredients: (state, action: PayloadAction<Ingredient[]>) => {
      state.ingredients = action.payload;
    },
    setInstructions: (state, action: PayloadAction<string>) => {
      state.instructions = action.payload;
    },
    setPictureId: (state, action: PayloadAction<string>) => {
      state.pictureId = action.payload;
    },
  },
});

export const {
  setTitle,
  setCategory,
  setIngredients,
  setInstructions,
  setPictureId,
} = recipeSlice.actions;

export default recipeSlice.reducer;
