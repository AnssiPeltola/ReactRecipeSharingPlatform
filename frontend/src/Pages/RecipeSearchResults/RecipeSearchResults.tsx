import React, { useState } from "react";
import { useLocation, Link } from "react-router-dom";
import { RecipeState } from "../../Types/types";
import RecipeSearch from "../../Components/RecipeSearch/RecipeSearch";
import { LANDING } from "../../Constants/routes";

const placeholderImageUrl = "/placeholder-food.png";

const SearchResultsPage = () => {
  const location = useLocation();
  const state = location.state as { recipes: RecipeState[] } | undefined;

  const [currentPage, setCurrentPage] = useState(1);
  const recipesPerPage = 9;

  if (!state || !state.recipes || state.recipes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-screen px-4">
        <p className="text-xl font-semibold mb-4 text-center">
          Reseptejä ei löytynyt! Koitappa etsiä toisella hakusanalla!
        </p>
        <div className="w-full max-w-md mb-4 flex justify-center">
          <RecipeSearch />
        </div>
        <Link to={LANDING}>
          <button className="px-6 py-3 bg-blue-500 text-white rounded-lg text-lg hover:bg-blue-600 transition duration-200">
            Palaa etusivulle
          </button>
        </Link>
      </div>
    );
  }

  const loadMoreRecipes = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  const displayedRecipes = state.recipes.slice(0, currentPage * recipesPerPage);

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Hakutulokset</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayedRecipes.map((recipe) => (
          <Link to={`/recipe/${recipe.id}`} key={recipe.id} className="block">
            <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200">
              <img
                src={
                  recipe.picture_url
                    ? `${process.env.REACT_APP_API_BASE_URL}/recipePicture/${recipe.picture_url}`
                    : placeholderImageUrl
                }
                alt={recipe.title}
                className="w-full h-48 object-contain"
              />
              <div className="p-4">
                <h3 className="text-lg font-semibold">{recipe.title}</h3>
              </div>
            </div>
          </Link>
        ))}
      </div>
      {displayedRecipes.length < state.recipes.length && (
        <div className="text-center mt-4">
          <button
            onClick={loadMoreRecipes}
            className="bg-blue-500 text-white p-2 rounded"
          >
            Näytä lisää reseptejä
          </button>
        </div>
      )}
      <div className="mt-8 flex justify-center items-center flex-col">
        <h2 className="text-2xl font-bold mb-4">Etsitkö jotain muuta?</h2>
        <RecipeSearch />
      </div>
    </div>
  );
};

export default SearchResultsPage;
