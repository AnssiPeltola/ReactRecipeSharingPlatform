import React, { useState, useEffect } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

const ProfilePictureModal = ({
  isOpen,
  onClose,
  onUpload,
}: {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (fileId: number) => void;
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [hasProfilePicture, setHasProfilePicture] = useState<boolean>(false);

  useEffect(() => {
    if (isOpen) {
      checkProfilePicture();
    }
  }, [isOpen]);

  const checkProfilePicture = async () => {
    const token = localStorage.getItem("sessionToken");
    if (!token) {
      console.error("No token found in localStorage");
      return;
    }

    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/hasProfilePicture`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setHasProfilePicture(response.data.hasProfilePicture);
    } catch (error) {
      console.error("Error checking profile picture:", error);
    }
  };

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

  const handleUpload = async () => {
    if (!selectedFile) return;

    const token = localStorage.getItem("sessionToken");
    if (!token) {
      console.error("No token found in localStorage");
      return;
    }

    if (hasProfilePicture) {
      try {
        await axios.delete(
          `${process.env.REACT_APP_API_BASE_URL}/deleteProfilePicture`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
      } catch (error) {
        console.error("Error deleting profile picture:", error);
        return;
      }
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
      onClose();
    } catch (error) {
      console.error("Error uploading profile picture:", error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">
          Muuta profiilikuvaasi
        </h2>
        <input
          type="file"
          id="fileInput"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
        <label
          htmlFor="fileInput"
          className="w-full h-64 border-2 border-collapse border-gray-200 rounded flex items-center justify-center cursor-pointer mb-4 relative group"
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
            <span className="text-gray-500">
              Lisää kuva klikkaamalla tästä!
            </span>
          )}
        </label>

        {errorMessage && (
          <div className="text-red-500 text-center mb-4">{errorMessage}</div>
        )}

        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition duration-200 mr-2"
          >
            Peruuta
          </button>
          <button
            onClick={handleUpload}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-200"
          >
            Tallenna
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePictureModal;
