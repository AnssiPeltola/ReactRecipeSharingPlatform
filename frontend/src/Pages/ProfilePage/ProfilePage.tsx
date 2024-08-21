import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import ProfileView from "./ProfileView/ProfileView";
import ModifyUserInfo from "./ModifyUserInfo/ModifyUserInfo";
import { useSelector } from "react-redux";
import { RootState } from "../../Redux/store";
import "../../Styles/loadingAnimation.css";

const ProfilePage = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const auth = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    const token = localStorage.getItem("sessionToken");

    if (!token) {
      setIsLoggedIn(false);
      setLoading(false);
      // console.log("Authentication status: Not logged in");
      return;
    }

    if (token && auth.isLoggedIn) {
      setIsLoggedIn(true);
      setLoading(false);
      // console.log("Authentication status: Logged in");
      return;
    }
  }, [auth.isLoggedIn]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <div className="loader"></div>
        <p className="mt-4 text-lg text-gray-700">Kokit keittiössä...</p>
      </div>
    );
  }

  if (!isLoggedIn) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <p className="mb-4 text-lg text-gray-700">
          You need to log in to view your profile.
        </p>
        <button
          onClick={() => navigate("/")}
          className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-700"
        >
          Go to Homepage
        </button>
      </div>
    );
  }

  return (
    <div>
      <Routes>
        <Route path="/" element={<Navigate to="view" />} />
        <Route path="view" element={<ProfileView />} />
        <Route path="modify" element={<ModifyUserInfo />} />
      </Routes>
    </div>
  );
};

export default ProfilePage;
