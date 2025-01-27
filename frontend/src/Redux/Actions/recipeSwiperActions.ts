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
    const { filters, seenRecipeIds } = state.recipeSwiper;
    console.log("Fetching more recipes with seenRecipeIds:", seenRecipeIds);
    const token = state.auth?.sessionToken || "";

    try {
      dispatch(setLoading(true));

      // Build query parameters
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
      params.append("excludeIds", JSON.stringify(seenRecipeIds));

      console.log("Request URL params:", params.toString());

      const response = await axios.get(
        `${
          process.env.REACT_APP_API_BASE_URL
        }/recipes/unliked?${params.toString()}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Received recipes:", response.data);
      console.log("Number of recipes received:", response.data.length);

      // If no recipes returned, set noMoreRecipes flag
      if (response.data.length === 0) {
        console.log("No more recipes available");
        dispatch(setNoMoreRecipes(true));
      } else {
        dispatch(setRecipes(response.data));
      }
      dispatch(setError(null));
    } catch (error) {
      console.error("Error details:", error);
      dispatch(setError("Failed to fetch recipes"));
    } finally {
      dispatch(setLoading(false));
    }
  }
);
