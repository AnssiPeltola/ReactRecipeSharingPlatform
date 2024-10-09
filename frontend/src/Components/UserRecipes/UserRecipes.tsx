import React, { useState, useEffect } from "react";
import axios from "axios";
import { RecipeState } from "../../Types/types";
import { Link } from "react-router-dom";

const placeholderImageUrl = "https://via.placeholder.com/150";

interface UserRecipesProps {
  userId: string;
}

const UserRecipes: React.FC<UserRecipesProps> = ({ userId }) => {
  const [recipes, setRecipes] = useState<RecipeState[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const recipesPerPage = 9;

  useEffect(() => {
    fetchUserRecipes();
  }, [userId]);

  const fetchUserRecipes = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/user/${userId}/recipes`
      );
      setRecipes(response.data);
    } catch (error) {
      console.error("Error fetching user recipes:", error);
    }
  };

  const loadMoreRecipes = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  const displayedRecipes = recipes.slice(0, currentPage * recipesPerPage);

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Reseptikokoelma</h2>
      {recipes.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayedRecipes.map((recipe) => (
              <Link
                to={`/recipe/${recipe.id}`}
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
          {displayedRecipes.length < recipes.length && (
            <div className="text-center mt-4">
              <button
                onClick={loadMoreRecipes}
                className="bg-blue-500 text-white p-2 rounded"
              >
                Näytä lisää reseptejä
              </button>
            </div>
          )}
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
