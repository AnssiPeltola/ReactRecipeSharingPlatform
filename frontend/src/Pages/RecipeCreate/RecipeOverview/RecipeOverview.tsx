import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../Redux/store";
import {
  resetState,
  setpicture_url,
  setPreviewUrl,
} from "../../../Redux/recipeSlice";
import axios from "axios";
import ProgressBar from "../../../Components/ProgressBar/ProgressBar";

const RecipeOverview = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const recipeState = useSelector((state: RootState) => state.recipe);
  const previewUrl = useSelector((state: RootState) => state.recipe.previewUrl);
  const selectedFile = location.state?.selectedFile;

  useEffect(() => {
    if (selectedFile) {
      dispatch(setPreviewUrl(URL.createObjectURL(selectedFile)));
    }
  }, [selectedFile, dispatch]);

  const handleButtonClick = async () => {
    let pictureUrl = recipeState.picture_url;

    if (selectedFile) {
      const formData = new FormData();
      formData.append("file", selectedFile);

      try {
        const response = await axios.post(
          `${process.env.REACT_APP_API_BASE_URL}/uploadRecipePicture`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        pictureUrl = response.data.fileId;
        dispatch(setpicture_url(pictureUrl));
      } catch (error) {
        console.error("Failed to upload image", error);
        return;
      }
    }

    const recipeFormData = new FormData();
    recipeFormData.append("title", recipeState.title);
    recipeFormData.append("category", recipeState.category);
    recipeFormData.append("secondary_category", recipeState.secondary_category);
    recipeFormData.append("mainIngredient", recipeState.main_ingredient);
    recipeFormData.append("instructions", recipeState.instructions);
    recipeFormData.append("user_id", recipeState.user_id.toString());
    recipeFormData.append("pictureUrl", pictureUrl ?? "");

    recipeState.ingredients.forEach((ingredient, index) => {
      recipeFormData.append(
        `ingredients[${index}][quantity]`,
        ingredient.quantity
      );
      recipeFormData.append(`ingredients[${index}][unit]`, ingredient.unit);
      recipeFormData.append(`ingredients[${index}][name]`, ingredient.name);
    });

    try {
      await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/recipeCreate`,
        recipeFormData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      dispatch(resetState());
      navigate("/create-recipe/recipe-created");
    } catch (error) {
      console.error(error);
    }
  };

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
          <span className="font-semibold">Main Ingredient:</span>{" "}
          {recipeState.main_ingredient}
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
        {previewUrl && (
          <img
            src={previewUrl}
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
