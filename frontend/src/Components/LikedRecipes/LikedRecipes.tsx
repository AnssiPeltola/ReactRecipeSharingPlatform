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

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h2>Liked Recipes</h2>
      {likedRecipes.length > 0 ? (
        <ul>
          {likedRecipes.map((recipe) => (
            <li key={recipe.id}>
              <Link to={`/recipe/${recipe.id}`}>
                {recipe.title} - {recipe.category}
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p>No liked recipes found.</p>
      )}
    </div>
  );
};

export default LikedRecipes;
