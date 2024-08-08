import React, { useState } from "react";
import axios from "axios";

const ProfilePictureUpload = ({
  onUpload,
}: {
  onUpload: (fileId: number) => void;
}) => {
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const token = localStorage.getItem("sessionToken");
      if (!token) {
        console.error("No token found in localStorage");
        return;
      }

      const response = await axios.post(
        "http://localhost:3000/uploadProfilePicture",
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
    <div>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload Profile Picture</button>
    </div>
  );
};

export default ProfilePictureUpload;
