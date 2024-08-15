import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ProfilePictureUpload from "../../../Components/ProfilePictureUpload/ProfilePictureUpload";
import ProgressBar from "../../../Components/ProgressBar/ProgressBar";

const RegisterProfilePicture = () => {
  const navigate = useNavigate();
  const [fileId, setFileId] = useState<number | null>(null);

  const handleProfilePictureUpload = (uploadedFileId: number) => {
    setFileId(uploadedFileId);
  };

  const handleCompleteRegistration = () => {
    navigate("/profile");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <ProgressBar currentStep={3} maxStep={3} />
        <h2 className="text-2xl font-semibold text-gray-700 mb-6">
          Upload Profile Picture
        </h2>
        <ProfilePictureUpload onUpload={handleProfilePictureUpload} />
        <button
          onClick={handleCompleteRegistration}
          className="w-full py-2 mt-4 text-white bg-blue-500 rounded hover:bg-blue-700"
        >
          Complete Registration
        </button>
      </div>
    </div>
  );
};

export default RegisterProfilePicture;
