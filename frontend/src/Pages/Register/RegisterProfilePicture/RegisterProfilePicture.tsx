import React from "react";
import ProgressBar from "../../../Components/ProgressBar/ProgressBar";
import RegisterProfilePictureUpload from "../../../Components/RegisterProfilePictureUpload/RegisterProfilePictureUpload";

const RegisterProfilePicture = () => {
  const handleProfilePictureUpload = (fileId: number) => {
    console.log("Uploaded file ID:", fileId);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <ProgressBar currentStep={3} maxStep={3} />
        <h2 className="text-2xl font-semibold text-gray-700 mb-6">
          Näytä kokin kasvot!
        </h2>
        <RegisterProfilePictureUpload onUpload={handleProfilePictureUpload} />
      </div>
    </div>
  );
};

export default RegisterProfilePicture;
