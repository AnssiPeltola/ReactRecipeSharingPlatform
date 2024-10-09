import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "../../Styles/loadingAnimation.css"; // Import the CSS file

const placeholderImageUrl = "/placeholder-food.png"; // Define the placeholder image URL

const LikedRecipes = () => {
  const [likedRecipes, setLikedRecipes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const recipesPerPage = 6;

  useEffect(() => {
    const fetchLikedRecipes = async () => {
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

    fetchLikedRecipes();
  }, []);

  const loadMoreRecipes = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  const displayedRecipes = likedRecipes.slice(0, currentPage * recipesPerPage);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="loader"></div>
      </div>
    );
  }

  if (error) {
    return <div className="text-center text-red-500">Error: {error}</div>;
  }

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
                    className="w-full h-48 object-contain"
                  />
                  <div className="p-4">
                    <h3 className="text-lg font-semibold">{recipe.title}</h3>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          {likedRecipes.length > displayedRecipes.length && (
            <div className="text-center mt-6">
              <button
                onClick={loadMoreRecipes}
                className="bg-blue-500 text-white rounded px-4 py-2 hover:bg-blue-700"
              >
                Load More
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="text-center text-gray-500">No liked recipes found.</div>
      )}
    </div>
  );
};

export default LikedRecipes;
