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
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Reseptikokoelmasi</h2>
      {recipes.length > 0 ? (
        <ul className="space-y-4">
          {recipes.map((recipe) => (
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
        <p className="text-center text-gray-500">
          Reseptejä ei löydy, vielä...
        </p>
      )}
    </div>
  );
};

export default UserRecipes;
