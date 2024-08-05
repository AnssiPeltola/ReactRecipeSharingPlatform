import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import axios from "axios";
import ProfileView from "./ProfileView/ProfileView";
import ModifyUserInfo from "./ModifyUserInfo/ModifyUserInfo";

const ProfilePage = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("sessionToken");

    if (!token) {
      setIsLoggedIn(false);
      setLoading(false);
      return;
    }

    axios
      .get("/checkAuthentication", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((_response) => {
        setIsLoggedIn(true);
      })
      .catch((_error) => {
        setIsLoggedIn(false);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  // Animation for loading (TODO)
  if (loading) {
    return <p>Loading...</p>;
  }

  if (!isLoggedIn) {
    return (
      <div>
        <p>You need to log in to view your profile.</p>
        <button onClick={() => navigate("/")}>Go to Homepage</button>
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
