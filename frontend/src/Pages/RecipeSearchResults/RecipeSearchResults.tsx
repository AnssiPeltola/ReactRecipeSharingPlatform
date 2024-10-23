import React, { useState, useEffect } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import { RecipeState } from "../../Types/types";
import RecipeSearch from "../../Components/RecipeSearch/RecipeSearch";
import { LANDING } from "../../Constants/routes";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import axios from "axios";

const placeholderImageUrl = "/placeholder-food.png";

const SearchResultsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as
    | { recipes: RecipeState[]; totalRecipes: number; searchTerm: string }
    | undefined;

  const [recipes, setRecipes] = useState<RecipeState[]>(state?.recipes || []);
  const [totalRecipes, setTotalRecipes] = useState<number>(
    state?.totalRecipes || 0
  );
  const [currentPage, setCurrentPage] = useState<number>(
    location.state?.currentPage || 1
  );
  const recipesPerPage = 9;

  useEffect(() => {
    if (state) {
      setRecipes(state.recipes);
      setTotalRecipes(state.totalRecipes);
    }
  }, [state]);

  useEffect(() => {
    if (currentPage !== 1) {
      fetchRecipes(currentPage);
    }
  }, [currentPage]);

  const fetchRecipes = async (page: number) => {
    try {
      const response = await axios.get(
        `/search?query=${encodeURIComponent(
          state?.searchTerm || ""
        )}&page=${page}&limit=${recipesPerPage}`
      );
      setRecipes(response.data.recipes);
      setTotalRecipes(response.data.totalRecipes);
    } catch (err) {
      console.error("Failed to fetch recipes", err);
    }
  };

  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    page: number
  ) => {
    setCurrentPage(page);
    fetchRecipes(page);
    navigate(location.pathname, {
      state: { ...location.state, currentPage: page },
    });
  };

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

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Hakutulokset</h2>
      <p className="text-lg mb-4">
        Löydettiin {totalRecipes} reseptiä hakusanalla "{state?.searchTerm}"
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {recipes.map((recipe) => (
          <Link
            to={`/recipe/${recipe.id}`}
            state={{ currentPage }}
            key={recipe.id}
            className="block"
          >
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
      <Stack spacing={2} className="mt-4" alignItems="center">
        <Pagination
          count={Math.ceil(totalRecipes / recipesPerPage)}
          page={currentPage}
          onChange={handlePageChange}
          color="primary"
        />
      </Stack>
      <div className="mt-8 flex justify-center items-center flex-col">
        <h2 className="text-2xl font-bold mb-4">Etsitkö jotain muuta?</h2>
        <RecipeSearch />
      </div>
    </div>
  );
};

export default SearchResultsPage;
