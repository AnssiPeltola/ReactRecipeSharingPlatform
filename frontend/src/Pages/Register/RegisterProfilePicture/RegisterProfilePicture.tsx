import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ProfilePictureUpload from "../../../Components/ProfilePictureUpload/ProfilePictureUpload";

const RegisterProfilePicture = () => {
  const navigate = useNavigate();
  const [fileId, setFileId] = useState<number | null>(null);

  const handleProfilePictureUpload = (uploadedFileId: number) => {
    setFileId(uploadedFileId);
  };

  const handleCompleteRegistration = () => {
    // You can add any additional logic here if needed
    navigate("/profile"); // Navigate to the profile page after completing registration
  };

  return (
    <div>
      <h2>Upload Profile Picture</h2>
      <ProfilePictureUpload onUpload={handleProfilePictureUpload} />
      <button onClick={handleCompleteRegistration}>
        Complete Registration
      </button>
    </div>
  );
};

export default RegisterProfilePicture;
