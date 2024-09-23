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
  const dispatch = useDispatch();
  const recipeState = useSelector((state: RootState) => state.recipe);
  const previewUrl = useSelector((state: RootState) => state.recipe.previewUrl);
  const selectedFile = useSelector(
    (state: RootState) => state.recipe.selectedFile
  );

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

  const handleBackButton = () => {
    navigate("/create-recipe/recipe-picture");
  };

  console.log(recipeState);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-lg">
        <ProgressBar currentStep={4} maxStep={4} />
        <p className="mb-4 text-2xl font-semibold text-gray-700">
          Onko kaikki kohdallaan?
        </p>
        <p className="mb-2">
          <span className="font-semibold">Mestariteos:</span>{" "}
          {recipeState.title}
        </p>
        <p className="mb-2">
          <span className="font-semibold">Herkun laji:</span>{" "}
          {recipeState.category}
        </p>
        <p className="mb-2">
          <span className="font-semibold">Pääelementti:</span>{" "}
          {recipeState.main_ingredient}
        </p>
        <p className="mb-2">
          <span className="font-semibold">Ruokavalio:</span>{" "}
          {recipeState.secondary_category}
        </p>
        <div className="mb-2">
          <p className="font-semibold">Makujen rakennuspalikat:</p>
          {recipeState.ingredients.map((ingredient, index) => (
            <div
              key={index}
              className="ml-2"
            >{`• ${ingredient.quantity} ${ingredient.unit} ${ingredient.name}`}</div>
          ))}
        </div>
        <div className="mb-2">
          <p className="font-semibold">Kokin salaiset liikkeet:</p>
          {recipeState.instructions.split("\n").map((step, index) => (
            <div key={index} className="ml-2">{`${index + 1}. ${step}`}</div>
          ))}
        </div>
        {previewUrl && (
          <img
            src={previewUrl}
            alt="Recipe"
            className="w-full h-auto rounded shadow mb-4"
          />
        )}
        <div className="flex justify-between">
          <button
            onClick={handleBackButton}
            className="bg-red-500 hover:bg-red-600 text-white rounded flex-1 mr-2"
          >
            Askel taaksepäin!
          </button>
          <button
            onClick={handleButtonClick}
            className="bg-green-500 hover:bg-green-600 text-white p-1 rounded flex-1 ml-2"
          >
            Lähetä makumatka maailmalle!
          </button>
        </div>
      </div>
    </div>
  );
};

export default RecipeOverview;
