import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import {
  setRecipes,
  setLoading,
  setError,
  setNoMoreRecipes,
} from "../Reducers/recipeSwiperSlice";
import { RootState } from "../store";

export const fetchMoreRecipes = createAsyncThunk(
  "recipeSwiper/fetchMore",
  async (_, { getState, dispatch }) => {
    const state = getState() as RootState;
    const { filters, seenRecipeIds, recipes, loading, noMoreRecipes } =
      state.recipeSwiper;

    // Don't fetch if we're already loading or have no more recipes
    if (loading || noMoreRecipes) return;

    try {
      dispatch(setLoading(true));

      // Get all IDs we want to exclude (both seen and currently in recipes)
      const currentRecipeIds = recipes.map((recipe) => recipe.id);
      const allExcludedIds = [
        ...new Set([...seenRecipeIds, ...currentRecipeIds]),
      ];

      const params = new URLSearchParams();
      if (filters.category) params.append("category", filters.category);
      if (filters.mainIngredient)
        params.append("mainIngredient", filters.mainIngredient);
      if (filters.secondaryCategories?.length) {
        params.append(
          "secondaryCategories",
          filters.secondaryCategories.join(",")
        );
      }
      params.append("excludeIds", JSON.stringify(allExcludedIds));
      params.append("pageSize", "20");

      console.log("Fetching recipes with excludeIds:", allExcludedIds);

      const response = await axios.get(
        `${
          process.env.REACT_APP_API_BASE_URL
        }/recipes/unliked?${params.toString()}`,
        {
          headers: {
            Authorization: `Bearer ${state.auth?.sessionToken || ""}`,
          },
        }
      );

      console.log("Received recipes:", response.data.length);

      if (response.data.length === 0) {
        dispatch(setNoMoreRecipes(true));
      } else {
        dispatch(setRecipes(response.data));
      }
    } catch (error) {
      console.error("Error fetching recipes:", error);
      dispatch(setError("Failed to fetch recipes"));
    } finally {
      dispatch(setLoading(false));
    }
  }
);
