import React from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const RandomRecipeButton = () => {
  const navigate = useNavigate();

  const fetchRandomRecipe = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/random-recipe`
      );
      const randomRecipeId = response.data.id;
      navigate(`/recipe/${randomRecipeId}`);
    } catch (error) {
      console.error("Error fetching random recipe:", error);
    }
  };

  return (
    <button
      onClick={fetchRandomRecipe}
      className="bg-blue-500 text-white rounded p-2 hover:bg-blue-700 focus:outline-none"
    >
      Heitä herkkunoppa ja nappaa resepti!
    </button>
  );
};

export default RandomRecipeButton;
