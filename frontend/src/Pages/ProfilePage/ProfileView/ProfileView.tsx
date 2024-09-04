import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { fetchUserData, setUser } from "../../../Redux/authSlice";
import { RootState } from "../../../Redux/store";
import { useNavigate } from "react-router-dom";
import UserRecipes from "../../../Components/UserRecipes/UserRecipes";
import LikedRecipes from "../../../Components/LikedRecipes/LikedRecipes";
import { AppDispatch } from "../../../Redux/store";

const ProfileView = () => {
  const [profilePicture, setProfilePicture] = useState<string | null>(null);
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: RootState) => state.auth.user);

  useEffect(() => {
    if (!user) {
      const token = localStorage.getItem("sessionToken");
      if (token) {
        dispatch(fetchUserData(token));
      }
    }
    fetchProfilePicture();
    console.log("User:", user);
  }, [user, dispatch]);

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
      {user && (
        <div className="bg-white shadow-md rounded-lg p-6 mb-6">
          <p className="text-lg font-semibold mb-2">
            Nickname: {user.nickname}
          </p>
          <p className="text-lg mb-2">Location: {user.location}</p>
          <p className="text-lg mb-2">Bio: {user.bio}</p>
          <p className="text-lg mb-2">Instagram: {user.instagram}</p>
          <p className="text-lg mb-2">TikTok: {user.tiktok}</p>
          <p className="text-lg mb-2">
            Experience Level: {user.experience_level}
          </p>
          <p className="text-lg mb-2">Email: {user.email}</p>
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
