import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { RootState } from "../../Redux/store";

const RecipeSwiper = () => {
  const navigate = useNavigate();
  const auth = useSelector((state: RootState) => state.auth);

  if (!auth.isLoggedIn) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <p className="mb-4 text-lg text-gray-700">
          Sinun täytyy kirjautua sisään käyttääksesi tätä ominaisuutta.
        </p>
        <button
          onClick={() => navigate("/")}
          className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-700"
        >
          Takaisin etusivulle
        </button>
      </div>
    );
  }

  return (
    <div>
      <h1>Recipe Swiper</h1>
    </div>
  );
};

export default RecipeSwiper;
