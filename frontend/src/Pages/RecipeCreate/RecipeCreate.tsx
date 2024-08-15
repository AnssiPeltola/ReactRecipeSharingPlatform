import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
  useNavigate,
} from "react-router-dom";
import axios from "axios";
import RecipeTitle from "./RecipeTitle/RecipeTitle";
import RecipeIngredients from "./RecipeIngredients/RecipeIngredients";
import RecipePicture from "./RecipePicture/RecipePicture";
import RecipeOverview from "./RecipeOverview/RecipeOverview";
import RecipeCreated from "./RecipeCreated/RecipeCreated";

const CreateRecipe = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("sessionToken");

    if (!token) {
      setIsLoggedIn(false);
      return;
    }

    axios
      .get("/checkAuthentication", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((_response) => {
        setIsLoggedIn(true);
      })
      .catch((_error) => {
        setIsLoggedIn(false);
      });
  }, []);

  if (!isLoggedIn) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <p className="mb-4 text-lg text-gray-700">
          Sinun on kirjauduttava sisään luodaksesi reseptin.
        </p>
        <button
          onClick={() => navigate("/")}
          className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-700"
        >
          Siirry etusivulle!
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-4">
        <Routes>
          <Route path="/" element={<Navigate to="recipe-title" />} />
          <Route path="recipe-title" element={<RecipeTitle />} />
          <Route path="recipe-ingredients" element={<RecipeIngredients />} />
          <Route path="recipe-picture" element={<RecipePicture />} />
          <Route path="recipe-overview" element={<RecipeOverview />} />
          <Route path="recipe-created" element={<RecipeCreated />} />
        </Routes>
      </div>
    </div>
  );
};

export default CreateRecipe;
