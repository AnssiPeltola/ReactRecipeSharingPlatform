import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../Redux/store";
import {
  setPreviewUrl,
  setSelectedFile,
  setpicture_url,
} from "../../../Redux/recipeSlice";
import ProgressBar from "../../../Components/ProgressBar/ProgressBar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";

const RecipePicture = () => {
  const navigate = useNavigate();
  const { recipeId } = useParams<{ recipeId: string }>();
  const dispatch = useDispatch();
  const previewUrl = useSelector((state: RootState) => state.recipe.previewUrl);
  const recipeState = useSelector((state: RootState) => state.recipe);
  const selectedFile = useSelector(
    (state: RootState) => state.recipe.selectedFile
  );
  const [existingPictureUrl, setExistingPictureUrl] = useState<string | null>(
    null
  );
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (recipeState.picture_url) {
      fetchExistingPicture(recipeState.picture_url);
    }
  }, [recipeState.picture_url]);

  useEffect(() => {
    if (selectedFile) {
      dispatch(setPreviewUrl(URL.createObjectURL(selectedFile)));
    }
  }, [selectedFile, dispatch]);

  const fetchExistingPicture = async (pictureId: string) => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/recipePicture/${pictureId}`,
        { responseType: "blob" }
      );
      const imageUrl = URL.createObjectURL(response.data);
      setExistingPictureUrl(imageUrl);
    } catch (error) {
      console.error("Error fetching existing picture:", error);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      if (file.type.startsWith("image/")) {
        dispatch(setSelectedFile(file));
        dispatch(setPreviewUrl(URL.createObjectURL(file)));
        setExistingPictureUrl(null); // Clear existing picture when a new file is selected
        setErrorMessage(null);
      } else {
        setErrorMessage("Valitse kelvollinen kuvatiedosto.");
      }
    }
  };

  const handleRemovePicture = () => {
    dispatch(setSelectedFile(null));
    dispatch(setPreviewUrl(null));
    dispatch(setpicture_url(""));
    setExistingPictureUrl(null);
    const fileInput = document.getElementById("fileInput") as HTMLInputElement;
    if (fileInput) {
      fileInput.value = "";
    }
  };

  const handleImageBoxClick = (event: React.MouseEvent<HTMLLabelElement>) => {
    if (previewUrl || existingPictureUrl) {
      handleRemovePicture();
      event.preventDefault();
    }
  };

  const handleButtonClick = () => {
    // Ensure the state is updated before navigating
    if (selectedFile) {
      dispatch(setSelectedFile(selectedFile));
      dispatch(setPreviewUrl(previewUrl));
    }
    console.log("Recipe State before navigating to overview:", recipeState);
    navigate(
      recipeId
        ? `/edit-recipe/${recipeId}/recipe-overview`
        : "/create-recipe/recipe-overview"
    );
  };

  const handleBackButton = () => {
    navigate(
      recipeId
        ? `/edit-recipe/${recipeId}/recipe-ingredients`
        : "/create-recipe/recipe-ingredients"
    );
  };

  console.log("Recipe State in RecipePicture:", recipeState);

  return (
    <div className="flex items-center justify-center min-h-fit bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-xl">
        <ProgressBar currentStep={3} maxStep={4} />
        <p className="mb-4 text-2xl font-semibold text-gray-700">
          Lisää kuva luomuksellesi
        </p>

        <input
          type="file"
          id="fileInput"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
        <label
          htmlFor="fileInput"
          className="w-full h-96 border-2 border-collapse border-gray-200 rounded flex items-center justify-center cursor-pointer mb-4 relative group"
          onClick={handleImageBoxClick}
        >
          {previewUrl || existingPictureUrl ? (
            <>
              <img
                src={previewUrl ?? existingPictureUrl ?? undefined}
                alt="Recipe"
                className="w-full h-full object-contain rounded group-hover:opacity-50"
              />
              <FontAwesomeIcon
                icon={faTrash}
                className="absolute text-red-500 text-4xl opacity-0 group-hover:opacity-100"
              />
            </>
          ) : (
            <span className="text-gray-500">
              Lisää kuva klikkaamalla tästä!
            </span>
          )}
        </label>

        {errorMessage && (
          <div className="text-red-500 text-center mb-4">{errorMessage}</div>
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
            className="bg-green-500 hover:bg-green-600 text-white p-2 rounded flex-1 ml-2"
          >
            Mennäänpäs eteenpäin!
          </button>
        </div>
      </div>
    </div>
  );
};

export default RecipePicture;
