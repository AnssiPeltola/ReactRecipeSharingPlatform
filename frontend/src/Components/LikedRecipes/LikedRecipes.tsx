import React, { useState, useEffect } from "react";
import axios from "axios";
import { RecipeState } from "../../Types/types";
import { Link } from "react-router-dom";

const LikedRecipes = () => {
  const [likedRecipes, setLikedRecipes] = useState<RecipeState[]>([]);
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

  if (loading)
    return <div className="text-center text-gray-500">Loading...</div>;
  if (error)
    return <div className="text-center text-red-500">Error: {error}</div>;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Liked Recipes</h2>
      {likedRecipes.length > 0 ? (
        <ul className="space-y-4">
          {likedRecipes.map((recipe) => (
            <li key={recipe.id} className="bg-white shadow-md rounded-lg p-4">
              <Link
                to={`/recipe/${recipe.id}`}
                className="text-lg font-semibold text-blue-500 hover:underline"
              >
                {recipe.title} - {recipe.category}
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-center text-gray-500">No liked recipes found.</p>
      )}
    </div>
  );
};

export default LikedRecipes;
