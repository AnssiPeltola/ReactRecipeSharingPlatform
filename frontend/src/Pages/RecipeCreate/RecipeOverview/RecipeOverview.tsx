import React from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../Redux/store";
import { resetState } from "../../../Redux/recipeSlice";
import axios from "axios";
import ProgressBar from "../../../Components/ProgressBar/ProgressBar";

const RecipeOverview = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const recipeState = useSelector((state: RootState) => state.recipe);

  const imageUrl = recipeState.picture_url
    ? `${process.env.REACT_APP_API_BASE_URL}/recipePicture/${recipeState.picture_url}`
    : null;

  const handleButtonClick = async () => {
    const formData = new FormData();
    formData.append("title", recipeState.title);
    formData.append("category", recipeState.category);
    formData.append("secondary_category", recipeState.secondary_category);
    formData.append("instructions", recipeState.instructions);
    formData.append("user_id", recipeState.user_id.toString());
    formData.append("pictureUrl", recipeState.picture_url ?? "");

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
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <ProgressBar currentStep={4} maxStep={4} />
        <p className="text-2xl font-bold mb-4">Katsaus sivu</p>
        <p className="mb-2">
          <span className="font-semibold">Title:</span> {recipeState.title}
        </p>
        <p className="mb-2">
          <span className="font-semibold">Category:</span>{" "}
          {recipeState.category}
        </p>
        <p className="mb-2">
          <span className="font-semibold">Secondary Category:</span>{" "}
          {recipeState.secondary_category}
        </p>
        <div className="mb-4">
          <p className="font-semibold">Ingredients:</p>
          {recipeState.ingredients.map((ingredient, index) => (
            <div
              key={index}
              className="ml-4"
            >{`${ingredient.quantity} ${ingredient.unit} ${ingredient.name}`}</div>
          ))}
        </div>
        <p className="mb-2">
          <span className="font-semibold">Instructions:</span>{" "}
          {recipeState.instructions}
        </p>
        {imageUrl && (
          <img
            src={imageUrl}
            alt="Recipe"
            className="w-full h-auto rounded shadow mb-4"
          />
        )}
        <button
          onClick={handleButtonClick}
          className="bg-green-500 text-white p-2 rounded"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default RecipeOverview;
