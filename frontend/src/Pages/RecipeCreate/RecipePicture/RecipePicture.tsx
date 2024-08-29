import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../Redux/store";
import { setPreviewUrl } from "../../../Redux/recipeSlice";
import ProgressBar from "../../../Components/ProgressBar/ProgressBar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

const RecipePicture = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const previewUrl = useSelector((state: RootState) => state.recipe.previewUrl);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleButtonClick = () => {
    navigate("/create-recipe/recipe-overview", { state: { selectedFile } });
  };

  const handleBackButton = () => {
    navigate("/create-recipe/recipe-ingredients");
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setSelectedFile(file);
      dispatch(setPreviewUrl(URL.createObjectURL(file)));
    }
  };

  const handleRemovePicture = () => {
    setSelectedFile(null);
    dispatch(setPreviewUrl(null));
    const fileInput = document.getElementById("fileInput") as HTMLInputElement;
    if (fileInput) {
      fileInput.value = "";
    }
  };

  const handleImageBoxClick = (event: React.MouseEvent<HTMLLabelElement>) => {
    if (previewUrl) {
      handleRemovePicture();
      event.preventDefault();
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-xl">
        <ProgressBar currentStep={3} maxStep={4} />
        <p className="text-xl font-bold mb-4">Lisää kuva luomuksellesi</p>

        <input
          type="file"
          id="fileInput"
          onChange={handleFileChange}
          className="hidden"
        />
        <label
          htmlFor="fileInput"
          className="w-full h-96 border-2 border-collapse border-gray-200 rounded flex items-center justify-center cursor-pointer mb-4 relative group"
          onClick={handleImageBoxClick}
        >
          {previewUrl ? (
            <>
              <img
                src={previewUrl}
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

        <div className="flex justify-between">
          <button
            onClick={handleBackButton}
            className="bg-red-500 text-white rounded flex-1 mx-2"
          >
            Askel taaksepäin!
          </button>
          <button
            onClick={handleButtonClick}
            className="bg-green-500 text-white p-2 rounded flex-1 mx-2"
          >
            Mennäänpäs eteenpäin!
          </button>
        </div>
      </div>
    </div>
  );
};

export default RecipePicture;
