import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../Redux/store";
import { setpicture_url } from "../../../Redux/recipeSlice";
import axios from "axios";
import ProgressBar from "../../../Components/ProgressBar/ProgressBar";

const RecipePicture = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const recipeState = useSelector((state: RootState) => state.recipe);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const imageUrl = recipeState.picture_url
    ? `${process.env.REACT_APP_API_BASE_URL}/recipePicture/${recipeState.picture_url}`
    : null;

  useEffect(() => {
    if (!selectedFile) {
      return;
    }

    handleUpload(selectedFile);
  }, [selectedFile]);

  const handleButtonClick = () => {
    navigate("/create-recipe/recipe-overview");
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const handleUpload = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);

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

      dispatch(setpicture_url(response.data.fileId));
    } catch (error) {
      console.error("Failed to upload image", error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <ProgressBar currentStep={3} maxStep={4} />
        <p className="text-xl font-bold mb-4">Kuva sivu</p>
        <input
          type="file"
          onChange={handleFileChange}
          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border file:border-gray-400 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 mb-4"
        />
        <button
          onClick={handleButtonClick}
          className="bg-green-500 text-white p-2 rounded mb-4"
        >
          Next
        </button>
        {imageUrl && (
          <img
            src={imageUrl}
            alt="Recipe"
            className="w-full h-auto rounded shadow"
          />
        )}
      </div>
    </div>
  );
};

export default RecipePicture;
