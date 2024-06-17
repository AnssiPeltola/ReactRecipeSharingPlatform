import React from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../Redux/store";

const RecipeOverview = () => {
  const navigate = useNavigate();
  const recipeState = useSelector((state: RootState) => state.recipe);

  const handleButtonClick = () => {
    navigate("/create-recipe/recipe-created");
  };

  console.log(recipeState);

  return (
    <div>
      <p>Katsaus sivu</p>
      <button onClick={handleButtonClick}>Next</button>
    </div>
  );
};

export default RecipeOverview;
