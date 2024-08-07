import React, { useState, useEffect } from "react";
import axios from "axios";
import { User } from "../../../Types/types";
import { useNavigate } from "react-router-dom";

const ModifyUserInfo = () => {
  const [userDetails, setUserDetails] = useState<Partial<User> | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUserDetails();
  }, []);

  const fetchUserDetails = async () => {
    try {
      const token = localStorage.getItem("sessionToken");
      const response = await axios.get("/getUserDetails", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUserDetails(response.data);
    } catch (error) {
      console.error("Error fetching user details:", error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem("sessionToken");
      await axios.post("/register-details", userDetails, {
        headers: { Authorization: `Bearer ${token}` },
      });
      navigate(-1);
    } catch (error) {
      console.error("Error updating user details:", error);
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div>
      <h1>Modify User Info</h1>
      {userDetails && (
        <div>
          <label>
            Bio:
            <input
              type="text"
              name="bio"
              value={userDetails.bio || ""}
              onChange={handleChange}
            />
          </label>
          <label>
            Location:
            <input
              type="text"
              name="location"
              value={userDetails.location || ""}
              onChange={handleChange}
            />
          </label>
          <label>
            Instagram:
            <input
              type="text"
              name="instagram"
              value={userDetails.instagram || ""}
              onChange={handleChange}
            />
          </label>
          <label>
            TikTok:
            <input
              type="text"
              name="tiktok"
              value={userDetails.tiktok || ""}
              onChange={handleChange}
            />
          </label>
          <label>
            Experience Level:
            <input
              type="text"
              name="experience_level"
              value={userDetails.experience_level || ""}
              onChange={handleChange}
            />
          </label>
          <button onClick={handleSubmit}>Submit</button>
          <button onClick={handleBack}>Back</button>
        </div>
      )}
    </div>
  );
};

export default ModifyUserInfo;
