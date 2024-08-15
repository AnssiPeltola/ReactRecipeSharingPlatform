import React, { useState, useEffect } from "react";
import axios from "axios";

const ProfilePictureUpload = ({
  onUpload,
}: {
  onUpload: (fileId: number) => void;
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [hasProfilePicture, setHasProfilePicture] = useState<boolean>(false);

  useEffect(() => {
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

    checkProfilePicture();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

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
    formData.append("file", file);

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/uploadProfilePicture`,
        formData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      onUpload(response.data.fileId);
    } catch (error) {
      console.error("Error uploading profile picture:", error);
    }
  };

  return (
    <div className="flex items-center bg-white rounded">
      <label className="p-2 cursor-pointer bg-gray-100 hover:bg-gray-200 rounded">
        Valitse tiedosto
        <input type="file" onChange={handleFileChange} className="hidden" />
      </label>
      <button
        onClick={handleUpload}
        className="ml-auto px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-700"
      >
        Upload Profile Picture
      </button>
    </div>
  );
};

export default ProfilePictureUpload;
