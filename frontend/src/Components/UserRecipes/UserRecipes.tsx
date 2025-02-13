import React, { useState, useEffect } from "react";
import axios from "axios";
import { RecipeState } from "../../Types/types";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "../../Styles/loadingAnimation.css";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";

const placeholderImageUrl = "/placeholder-food.png";

interface UserRecipesProps {
  userId: string;
}

const UserRecipes: React.FC<UserRecipesProps> = ({ userId }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const [recipes, setRecipes] = useState<RecipeState[]>([]);
  const [totalRecipes, setTotalRecipes] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [sortBy, setSortBy] = useState<string>("created_at");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const recipesPerPage = 9;

  useEffect(() => {
    if (userId) {
      fetchUserRecipes(currentPage, sortBy);
    }
  }, [userId, currentPage, sortBy]);

  const fetchUserRecipes = async (page: number, sortBy: string) => {
    if (!userId) return;

    try {
      setIsLoading(true);
      const response = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/user/${userId}/recipes`,
        {
          params: {
            page,
            limit: recipesPerPage,
            sortBy,
          },
        }
      );
      setRecipes(response.data.recipes || []);
      setTotalRecipes(response.data.totalRecipes || 0);
    } catch (error) {
      console.error("Error fetching user recipes:", error);
      setRecipes([]);
      setTotalRecipes(0);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    page: number
  ) => {
    setCurrentPage(page);
    navigate(location.pathname, {
      state: { currentPage: page, sortBy },
    });
  };

  const handleSortChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newSortBy = event.target.value;
    setSortBy(newSortBy);
    setCurrentPage(1);
    navigate(location.pathname, {
      state: { currentPage: 1, sortBy: newSortBy },
    });
  };

  if (isLoading || !userId) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="loader"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Reseptikokoelma</h2>
        <div className="flex items-center">
          <label htmlFor="sort" className="mr-2">
            Järjestä:
          </label>
          <select
            id="sort"
            value={sortBy}
            onChange={handleSortChange}
            className="p-2 border rounded"
          >
            <option value="title">Nimen mukaan</option>
            <option value="category">Kategorian mukaan</option>
            <option value="created_at">Uusimmat ensin</option>
            <option value="oldest">Vanhimmat ensin</option>
            <option value="most_liked">Eniten tykätyt</option>
            <option value="most_commented">Eniten kommentoidut</option>
          </select>
        </div>
      </div>

      {recipes.length > 0 ? (
        <>
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
        </>
      ) : (
        <p className="text-center text-gray-500">
          Reseptejä ei löydy, vielä...
        </p>
      )}
    </div>
  );
};

export default UserRecipes;
