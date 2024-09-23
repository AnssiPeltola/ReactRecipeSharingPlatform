import React, { useState, useEffect } from "react";
import axios from "axios";
import { RecipeState } from "../../Types/types";
import { Link } from "react-router-dom";

const placeholderImageUrl = "https://via.placeholder.com/150";

const LikedRecipes = () => {
  const [likedRecipes, setLikedRecipes] = useState<RecipeState[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const recipesPerPage = 9;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchLikedRecipes();
  }, []);

  const fetchLikedRecipes = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("sessionToken");
      if (!token) {
        throw new Error("No token found");
      }
      const response = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/likedRecipes`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setLikedRecipes(response.data);
    } catch (err) {
      setError("Failed to fetch liked recipes.");
    } finally {
      setLoading(false);
    }
  };

  const loadMoreRecipes = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  const displayedRecipes = likedRecipes.slice(0, currentPage * recipesPerPage);

  if (loading)
    return <div className="text-center text-gray-500">Loading...</div>;
  if (error)
    return <div className="text-center text-red-500">Error: {error}</div>;

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Hyväksihavaitut herkut</h2>
      {likedRecipes.length > 0 ? (
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
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="text-lg font-semibold">{recipe.title}</h3>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          {displayedRecipes.length < likedRecipes.length && (
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

export default LikedRecipes;
