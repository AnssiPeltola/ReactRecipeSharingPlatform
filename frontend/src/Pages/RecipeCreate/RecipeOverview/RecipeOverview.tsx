import React from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../Redux/store";

const RecipeOverview = () => {
  const navigate = useNavigate();
  const recipeState = useSelector((state: RootState) => state.recipe);

  // Dynamically construct the image URL for display using the pictureId
  const imageUrl = recipeState.pictureId
    ? `${process.env.REACT_APP_API_BASE_URL}/recipePicture/${recipeState.pictureId}`
    : null;

  const handleButtonClick = () => {
    navigate("/create-recipe/recipe-created");
  };

  console.log(recipeState);

  return (
    <div>
      <p>Katsaus sivu</p>
      <p>Title: {recipeState.title}</p>
      <p>Category: {recipeState.category}</p>
      <div>
        Ingredients:
        {recipeState.ingredients.map((ingredient, index) => (
          <div
            key={index}
          >{`${ingredient.quantity} ${ingredient.unit} ${ingredient.name}`}</div>
        ))}
      </div>
      <p>Instructions: {recipeState.instructions}</p>
      <p>Picture ID: {recipeState.pictureId}</p>
      {imageUrl && <img src={imageUrl} alt="Recipe" />}

      <button onClick={handleButtonClick}>Next</button>
    </div>
  );
};

export default RecipeOverview;
