import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RecipeState, Ingredient } from "../Types/types";

const initialState: RecipeState = {
  title: "",
  category: "",
  secondaryCategory: "",
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
    setSecondaryCategory: (state, action: PayloadAction<string>) => {
      state.secondaryCategory = action.payload;
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
      state.secondaryCategory = "";
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
  setSecondaryCategory,
  setIngredients,
  setInstructions,
  setPictureId,
  setUserId,
  resetState,
} = recipeSlice.actions;

export default recipeSlice.reducer;
