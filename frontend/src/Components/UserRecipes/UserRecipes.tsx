import React, { useState, useEffect } from "react";
import axios from "axios";
import { RecipeState } from "../../Types/types";
import { Link } from "react-router-dom";

const UserRecipes = () => {
  const [recipes, setRecipes] = useState<RecipeState[]>([]);

  useEffect(() => {
    fetchUserRecipes();
  }, []);

  const fetchUserRecipes = async () => {
    try {
      const token = localStorage.getItem("sessionToken");
      if (!token) {
        throw new Error("No token found");
      }
      const response = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/getUserRecipes`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setRecipes(response.data);
    } catch (error) {
      console.error("Error fetching user recipes:", error);
    }
  };

  return (
    <div>
      <h2>Your Recipes</h2>
      {recipes.length > 0 ? (
        <ul>
          {recipes.map((recipe) => (
            <li key={recipe.id}>
              <Link to={`/recipe/${recipe.id}`}>
                {recipe.title} - {recipe.category}
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p>No recipes found.</p>
      )}
    </div>
  );
};

export default UserRecipes;
