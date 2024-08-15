import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { User } from "../../../Types/types";
import UserRecipes from "../../../Components/UserRecipes/UserRecipes";
import LikedRecipes from "../../../Components/LikedRecipes/LikedRecipes";

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
    <div className="max-w-4xl mx-auto p-4">
      {profilePicture && (
        <img
          src={profilePicture}
          alt="Profile"
          className="w-32 h-32 rounded-full mx-auto mb-6 border-4 border-gray-300"
        />
      )}
      {userDetails && (
        <div className="bg-white shadow-md rounded-lg p-6 mb-6">
          <p className="text-lg font-semibold mb-2">
            Nickname: {userDetails.nickname}
          </p>
          <p className="text-lg mb-2">Location: {userDetails.location}</p>
          <p className="text-lg mb-2">Bio: {userDetails.bio}</p>
          <p className="text-lg mb-2">Instagram: {userDetails.instagram}</p>
          <p className="text-lg mb-2">TikTok: {userDetails.tiktok}</p>
          <p className="text-lg mb-2">
            Experience Level: {userDetails.experience_level}
          </p>
          <p className="text-lg mb-2">Email: {userDetails.email}</p>
        </div>
      )}
      <button
        onClick={() => navigate("/profile/modify")}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-200 mb-6"
      >
        Modify Profile
      </button>
      <UserRecipes />
      <LikedRecipes />
    </div>
  );
};

export default ProfileView;
