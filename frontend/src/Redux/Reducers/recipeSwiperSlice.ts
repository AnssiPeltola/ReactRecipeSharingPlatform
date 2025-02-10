import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Recipe {
  id: number;
  title: string;
  category: string;
  main_ingredient: string;
  secondary_categories: string[];
  instructions: string;
  picture_url: string;
  nickname: string;
}

interface Action {
  type: "like" | "dislike";
  recipeId: number;
  recipeIndex: number;
}

interface RecipeSwiperState {
  recipes: Recipe[];
  currentIndex: number;
  loading: boolean;
  error: string | null;
  filters: {
    category?: string;
    mainIngredient?: string;
    secondaryCategories?: string[];
  };
  noMoreRecipes: boolean;
  seenRecipeIds: number[];
  actionHistory: Action[];
}

const initialState: RecipeSwiperState = {
  recipes: [],
  currentIndex: 0,
  loading: false,
  error: null,
  filters: {},
  noMoreRecipes: false,
  seenRecipeIds: [],
  actionHistory: [],
};

const recipeSwiperSlice = createSlice({
  name: "recipeSwiper",
  initialState,
  reducers: {
    setRecipes: (state, action: PayloadAction<Recipe[]>) => {
      if (action.payload.length === 0) {
        state.noMoreRecipes = true;
      } else {
        // Filter out any duplicates based on recipe ID
        const newRecipes = action.payload.filter(
          (newRecipe) =>
            !state.recipes.some(
              (existingRecipe) => existingRecipe.id === newRecipe.id
            ) && !state.seenRecipeIds.includes(newRecipe.id)
        );
        state.recipes = [...state.recipes, ...newRecipes];
      }
    },
    clearRecipes: (state) => {
      state.recipes = [];
      state.currentIndex = 0;
      state.noMoreRecipes = false;
      state.seenRecipeIds = [];
    },
    nextRecipe: (state) => {
      state.currentIndex += 1;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setFilters: (
      state,
      action: PayloadAction<RecipeSwiperState["filters"]>
    ) => {
      state.filters = action.payload;
      // Reset other state when filters change
      state.recipes = [];
      state.currentIndex = 0;
      state.noMoreRecipes = false;
      state.seenRecipeIds = [];
      state.actionHistory = [];
    },
    setNoMoreRecipes: (state, action: PayloadAction<boolean>) => {
      state.noMoreRecipes = action.payload;
    },
    addSeenRecipe: (state, action: PayloadAction<number>) => {
      if (!state.seenRecipeIds.includes(action.payload)) {
        state.seenRecipeIds.push(action.payload);
      }
    },
    addAction: (state, action: PayloadAction<Action>) => {
      state.actionHistory.push(action.payload);
    },

    undoLastAction: (state) => {
      if (state.actionHistory.length === 0) return;

      const lastAction = state.actionHistory[state.actionHistory.length - 1];

      // Remove the recipe ID from seen recipes
      state.seenRecipeIds = state.seenRecipeIds.filter(
        (id) => id !== lastAction.recipeId
      );

      // Adjust current index
      state.currentIndex = lastAction.recipeIndex;

      // Remove the action from history
      state.actionHistory.pop();
    },
    resetState: (state) => {
      return initialState;
    },
  },
});

export const {
  setRecipes,
  clearRecipes,
  nextRecipe,
  setLoading,
  setError,
  setFilters,
  setNoMoreRecipes,
  addSeenRecipe,
  addAction,
  undoLastAction,
  resetState,
} = recipeSwiperSlice.actions;

export default recipeSwiperSlice.reducer;
