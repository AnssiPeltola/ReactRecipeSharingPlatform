import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { User } from "../../../Types/types";

const ProfileView = () => {
  const [userDetails, setUserDetails] = useState<User | null>(null);
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

  // TODO: Fetch user recipes

  return (
    <div>
      <h1>Profile Page</h1>
      {userDetails && (
        <div>
          <p>Nickname: {userDetails.nickname}</p>
          <p>Location: {userDetails.location}</p>
          <p>Bio: {userDetails.bio}</p>
          <p>Instagram: {userDetails.instagram}</p>
          <p>TikTok: {userDetails.tiktok}</p>
          <p>Experience Level: {userDetails.experience_level}</p>
          <p>Email: {userDetails.email}</p>
        </div>
      )}
      <button onClick={() => navigate("/profile/modify")}>
        Modify User Info
      </button>
      <h2>Your Recipes</h2>
    </div>
  );
};

export default ProfileView;
