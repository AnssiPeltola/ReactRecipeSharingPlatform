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
}

const initialState: RecipeSwiperState = {
  recipes: [],
  currentIndex: 0,
  loading: false,
  error: null,
  filters: {},
  noMoreRecipes: false,
  seenRecipeIds: [],
};

const recipeSwiperSlice = createSlice({
  name: "recipeSwiper",
  initialState,
  reducers: {
    setRecipes: (state, action: PayloadAction<Recipe[]>) => {
      if (action.payload.length === 0) {
        state.noMoreRecipes = true;
        state.recipes = [];
        state.currentIndex = 0;
      } else {
        state.recipes = action.payload;
        state.currentIndex = 0;
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
    },
    setNoMoreRecipes: (state, action: PayloadAction<boolean>) => {
      state.noMoreRecipes = action.payload;
    },
    addSeenRecipe: (state, action: PayloadAction<number>) => {
      if (!state.seenRecipeIds.includes(action.payload)) {
        state.seenRecipeIds.push(action.payload);
      }
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
} = recipeSwiperSlice.actions;

export default recipeSwiperSlice.reducer;
