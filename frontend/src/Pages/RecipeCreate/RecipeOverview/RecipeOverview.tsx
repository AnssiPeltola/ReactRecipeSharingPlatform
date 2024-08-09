import React from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../Redux/store";
import { resetState } from "../../../Redux/recipeSlice";
import axios from "axios";

const RecipeOverview = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const recipeState = useSelector((state: RootState) => state.recipe);

  // Dynamically construct the image URL for display using the pictureId
  const imageUrl = recipeState.pictureId
    ? `${process.env.REACT_APP_API_BASE_URL}/recipePicture/${recipeState.pictureId}`
    : null;

  const handleButtonClick = async () => {
    const formData = new FormData();
    formData.append("title", recipeState.title);
    formData.append("category", recipeState.category);
    formData.append("secondary_category", recipeState.secondary_category);
    formData.append("instructions", recipeState.instructions);
    formData.append("userId", recipeState.userId.toString());
    formData.append("pictureUrl", recipeState.pictureId);

    recipeState.ingredients.forEach((ingredient, index) => {
      formData.append(`ingredients[${index}][quantity]`, ingredient.quantity);
      formData.append(`ingredients[${index}][unit]`, ingredient.unit);
      formData.append(`ingredients[${index}][name]`, ingredient.name);
    });

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/recipeCreate`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log(response.data);
      dispatch(resetState());
    } catch (error) {
      console.error(error);
    }
    navigate("/create-recipe/recipe-created");
  };

  console.log(recipeState);

  return (
    <div>
      <p>Katsaus sivu</p>
      <p>Title: {recipeState.title}</p>
      <p>Category: {recipeState.category}</p>
      <p>Secondary Category: {recipeState.secondary_category}</p>
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
