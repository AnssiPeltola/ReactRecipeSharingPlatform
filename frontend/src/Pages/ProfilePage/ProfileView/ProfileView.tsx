import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { User } from "../../../Types/types";
import UserRecipes from "../../../Components/UserRecipes/UserRecipes";

const ProfileView = () => {
  const [userDetails, setUserDetails] = useState<User | null>(null);
  const [profilePicture, setProfilePicture] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUserDetails();
    fetchProfilePicture();
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

  const fetchProfilePicture = async () => {
    try {
      const token = localStorage.getItem("sessionToken");
      const response = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/getProfilePicture`,
        {
          headers: { Authorization: `Bearer ${token}` },
          responseType: "arraybuffer",
        }
      );
      const base64 = btoa(
        new Uint8Array(response.data).reduce(
          (data, byte) => data + String.fromCharCode(byte),
          ""
        )
      );
      const mimeType = response.headers["content-type"];
      setProfilePicture(`data:${mimeType};base64,${base64}`);
    } catch (error) {
      console.error("Error fetching profile picture:", error);
    }
  };

  return (
    <div>
      <h1>Profile Page</h1>
      {profilePicture && <img src={profilePicture} alt="Profile" />}
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
        Modify Profile
      </button>
      <UserRecipes />
    </div>
  );
};

export default ProfileView;
