import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
  useNavigate,
} from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../../../Redux/store";
import Register from "../Register/Register";
import RegisterDetails from "../RegisterDetails/RegisterDetails";
import RegisterProfilePicture from "../RegisterProfilePicture/RegisterProfilePicture";
import "../../../Styles/loadingAnimation.css";

const RegisterRoute = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const auth = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    const token = localStorage.getItem("sessionToken");

    if (!token) {
      setIsLoggedIn(false);
      setIsLoading(false);
      return;
    }

    if (token && auth.isLoggedIn) {
      setIsLoggedIn(true);
      setIsLoading(false);
      return;
    }
  }, [auth.isLoggedIn]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <div className="loader"></div>
        <p className="mt-4 text-lg text-gray-700">Kokit keittiössä...</p>
      </div>
    );
  }

  if (isLoggedIn) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <p className="mb-4 text-lg text-gray-700">
          Olet jo kirjautunut sisään. Ei pääsyä rekisteröintisivuille.
        </p>
        <button
          onClick={() => navigate("/")}
          className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-700"
        >
          Palaa etusivulle
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-4xl p-4">
        <Routes>
          <Route path="/" element={<Navigate to="register" />} />
          <Route path="register" element={<Register />} />
          <Route path="register-details" element={<RegisterDetails />} />
          <Route path="register-picture" element={<RegisterProfilePicture />} />
        </Routes>
      </div>
    </div>
  );
};

export default RegisterRoute;
