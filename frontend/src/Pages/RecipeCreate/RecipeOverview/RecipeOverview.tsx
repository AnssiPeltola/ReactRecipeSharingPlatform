import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../Redux/store";
import {
  resetState,
  setpicture_url,
  setPreviewUrl,
  setRecipeState,
} from "../../../Redux/recipeSlice";
import axios from "axios";
import ProgressBar from "../../../Components/ProgressBar/ProgressBar";

interface RecipeOverviewProps {
  mode: "create" | "edit";
  recipeId?: string;
}

const RecipeOverview: React.FC<RecipeOverviewProps> = ({ mode, recipeId }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const recipeState = useSelector((state: RootState) => state.recipe);
  const previewUrl = useSelector((state: RootState) => state.recipe.previewUrl);
  const selectedFile = useSelector(
    (state: RootState) => state.recipe.selectedFile
  );
  const user = useSelector((state: RootState) => state.auth.user); // Get user from Redux store
  const token = localStorage.getItem("sessionToken");

  useEffect(() => {
    if (selectedFile) {
      dispatch(setPreviewUrl(URL.createObjectURL(selectedFile)));
    }
  }, [selectedFile, dispatch]);

  useEffect(() => {
    if (mode === "edit" && recipeId) {
      fetchRecipeData(recipeId);
    }
  }, [mode, recipeId, dispatch]);

  const fetchRecipeData = async (id: string) => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/recipes/${id}`
      );
      dispatch(setRecipeState(response.data));
    } catch (error) {
      console.error("Error fetching recipe data:", error);
    }
  };

  const handleButtonClick = async () => {
    let pictureUrl = recipeState.picture_url;

    if (selectedFile) {
      const formData = new FormData();
      formData.append("file", selectedFile);
      if (recipeState.id !== undefined) {
        formData.append("recipeId", recipeState.id.toString());
      }

      try {
        const response = await axios.post(
          `${process.env.REACT_APP_API_BASE_URL}/uploadRecipePicture`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${token}`,
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

    const recipeFormData = {
      title: recipeState.title,
      category: recipeState.category,
      secondary_category: recipeState.secondary_category,
      mainIngredient: recipeState.main_ingredient,
      instructions: recipeState.instructions,
      user_id: user?.id,
      pictureUrl: pictureUrl ?? "",
      ingredients: recipeState.ingredients.map((ingredient) => ({
        quantity: ingredient.quantity,
        unit: ingredient.unit,
        name: ingredient.name,
      })),
    };

    console.log("Sending recipe data:", recipeFormData);

    try {
      const endpoint: string =
        mode === "create"
          ? `${process.env.REACT_APP_API_BASE_URL}/recipeCreate`
          : `${process.env.REACT_APP_API_BASE_URL}/recipeUpdate/${recipeState.id}`;

      const recipeResponse: { data: { id: string } } = await axios.post(
        endpoint,
        recipeFormData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Get the created or updated recipe ID
      const newRecipeId: string = recipeResponse.data.id;

      // If a picture was uploaded, update the picture with the recipe ID
      if (selectedFile && pictureUrl) {
        await axios.post(
          `${process.env.REACT_APP_API_BASE_URL}/updateRecipePicture`,
          { recipeId: newRecipeId, pictureUrl },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
      }

      dispatch(resetState());
      navigate("/create-recipe/recipe-created");
    } catch (error) {
      console.error(
        `Error ${mode === "create" ? "creating" : "updating"} recipe:`,
        error
      );
    }
  };

  const handleBackButton = () => {
    navigate(
      mode === "edit"
        ? `/edit-recipe/${recipeState.id}/recipe-picture`
        : "/create-recipe/recipe-picture"
    );
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
