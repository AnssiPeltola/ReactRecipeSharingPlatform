import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../Redux/store";
import { setPictureId } from "../../../Redux/recipeSlice";
import axios from "axios";

const RecipePicture = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const recipeState = useSelector((state: RootState) => state.recipe);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // Dynamically construct the image URL for display using the pictureId
  const imageUrl = recipeState.pictureId
    ? `${process.env.REACT_APP_API_BASE_URL}/recipePicture/${recipeState.pictureId}`
    : null;

  useEffect(() => {
    if (!selectedFile) {
      return;
    }

    // Immediately upload the file after it's selected
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

      dispatch(setPictureId(response.data.fileId)); // Update Redux with the picture ID
    } catch (error) {
      console.error("Failed to upload image", error);
    }
  };

  return (
    <div>
      <p>Kuva sivu</p>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleButtonClick}>Next</button>
      {imageUrl && <img src={imageUrl} alt="Recipe" />}
    </div>
  );
};

export default RecipePicture;
