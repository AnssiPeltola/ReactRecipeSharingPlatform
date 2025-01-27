import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch, RootState } from "../../Redux/store";
import { fetchMoreRecipes } from "../../Redux/Actions/recipeSwiperActions";
import {
  nextRecipe,
  clearRecipes,
  setNoMoreRecipes,
  addSeenRecipe,
  setFilters,
} from "../../Redux/Reducers/recipeSwiperSlice";
import RecipeSwiperFilters from "../../Components/RecipeSwiperFilters/RecipeSwiperFilters";

const RecipeSwiper = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const {
    recipes,
    currentIndex,
    loading,
    error,
    noMoreRecipes,
    seenRecipeIds,
    filters,
  } = useSelector((state: RootState) => state.recipeSwiper);

  const currentRecipe = recipes[currentIndex];

  const hasActiveFilters = Object.values(filters).some(
    (value) => value && (Array.isArray(value) ? value.length > 0 : true)
  );

  useEffect(() => {
    console.log("Component mounted - clearing and refetching recipes");
    dispatch(clearRecipes());
    dispatch(fetchMoreRecipes());
  }, []);

  useEffect(() => {
    if (recipes.length === 0 && !noMoreRecipes) {
      dispatch(fetchMoreRecipes());
    }
  }, [dispatch, recipes.length, noMoreRecipes]);

  useEffect(() => {
    console.log("Current state:", {
      recipesLength: recipes.length,
      currentIndex,
      seenRecipeIds,
    });
  }, [recipes.length, currentIndex, seenRecipeIds]);

  if (loading) {
    return (
      <div className="flex flex-col items-center min-h-screen p-4">
        <RecipeSwiperFilters />
        <div className="flex justify-center items-center mt-8">
          <p>Ladataan reseptejä...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  if (noMoreRecipes || (!currentRecipe && !loading)) {
    return (
      <div className="flex flex-col items-center min-h-screen p-4">
        <RecipeSwiperFilters />
        {hasActiveFilters ? (
          <div className="text-center mt-8">
            <p className="text-xl text-gray-700 mb-4">
              Valituilla suodattimilla ei löytynyt reseptejä.
            </p>
            <p className="text-gray-600 mb-4">
              Kokeile muuttaa suodattimia tai tyhjennä ne kokonaan.
            </p>
            <button
              onClick={() => {
                dispatch(setFilters({}));
                dispatch(clearRecipes());
                dispatch(fetchMoreRecipes());
              }}
              className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-700"
            >
              Tyhjennä suodattimet
            </button>
          </div>
        ) : (
          <div className="text-center mt-8">
            <p className="text-xl text-gray-700 mb-4">
              Ei enempää reseptejä saatavilla.
            </p>
            <button
              onClick={() => {
                dispatch(setFilters({}));
                dispatch(clearRecipes());
                dispatch(fetchMoreRecipes());
              }}
              className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-700"
            >
              Kokeile uudelleen
            </button>
          </div>
        )}
      </div>
    );
  }

  if (!currentRecipe) {
    return null;
  }

  const handleSwipe = (liked: boolean) => {
    if (currentRecipe) {
      console.log("Adding recipe to seen:", currentRecipe.id);
      dispatch(addSeenRecipe(currentRecipe.id));

      if (currentIndex >= recipes.length - 1 && !noMoreRecipes) {
        console.log("Last recipe in batch, checking for more");
        dispatch(fetchMoreRecipes());
      } else {
        dispatch(nextRecipe());
      }
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen p-4">
      <RecipeSwiperFilters />
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-bold mb-4">{currentRecipe.title}</h2>
        <p className="text-gray-600 mb-2">
          Kategoria: {currentRecipe.category}
        </p>
        <p className="text-gray-600 mb-4">Tekijä: {currentRecipe.nickname}</p>

        <div className="flex justify-center space-x-4 mt-4">
          <button
            onClick={() => handleSwipe(false)}
            className="bg-red-500 text-white px-6 py-2 rounded-full"
          >
            Ohita
          </button>
          <button
            onClick={() => handleSwipe(true)}
            className="bg-green-500 text-white px-6 py-2 rounded-full"
          >
            Tykkää
          </button>
        </div>
      </div>
    </div>
  );
};

export default RecipeSwiper;
