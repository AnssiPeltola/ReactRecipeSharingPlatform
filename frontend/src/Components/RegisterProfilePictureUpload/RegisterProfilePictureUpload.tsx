import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { useDispatch } from "react-redux";
import { fetchUserData } from "../../Redux/authSlice";
import { AppDispatch } from "../../Redux/store";

const RegisterProfilePictureUpload = ({
  onUpload,
}: {
  onUpload: (fileId: number) => void;
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      if (file.type.startsWith("image/")) {
        setSelectedFile(file);
        setPreviewUrl(URL.createObjectURL(file));
        setErrorMessage(null);
      } else {
        setErrorMessage("Valitse kelvollinen kuvatiedosto.");
      }
    }
  };

  const handleRemovePicture = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    const fileInput = document.getElementById("fileInput") as HTMLInputElement;
    if (fileInput) {
      fileInput.value = "";
    }
  };

  const handleCompleteRegistration = async () => {
    if (!selectedFile) {
      navigate("/profile");
      return;
    }

    const token = localStorage.getItem("sessionToken");
    if (!token) {
      console.error("No token found in localStorage");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/uploadProfilePicture`,
        formData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      onUpload(response.data.fileId);

      // Fetch user details and dispatch to Redux store
      const userDetailsResponse = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/getUserDetails`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      dispatch(fetchUserData(userDetailsResponse.data));

      navigate("/profile");
    } catch (error) {
      console.error("Error uploading profile picture:", error);
    }
  };

  return (
    <div className="flex flex-col items-center">
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
        onClick={(event) => {
          if (previewUrl) {
            handleRemovePicture();
            event.preventDefault();
          }
        }}
      >
        {previewUrl ? (
          <>
            <img
              src={previewUrl}
              alt="Profile"
              className="w-full h-full object-contain rounded group-hover:opacity-50"
            />
            <FontAwesomeIcon
              icon={faTrash}
              className="absolute text-red-500 text-4xl opacity-0 group-hover:opacity-100"
            />
          </>
        ) : (
          <span className="text-gray-500">Lisää kuva klikkaamalla tästä!</span>
        )}
      </label>

      {errorMessage && (
        <div className="text-red-500 text-center mb-4">{errorMessage}</div>
      )}

      <button
        onClick={handleCompleteRegistration}
        className="w-full py-2 mt-4 text-white bg-blue-500 rounded hover:bg-blue-700"
      >
        Valmista tuli!
      </button>
    </div>
  );
};

export default RegisterProfilePictureUpload;
