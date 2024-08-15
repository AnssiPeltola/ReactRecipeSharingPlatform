import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import LoginModal from "../Modal/LoginModal/LoginModal";

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("sessionToken");

    if (!token) {
      setIsLoggedIn(false);
      console.log("Authentication status: Not logged in");
      return;
    }

    axios
      .get("/checkAuthentication", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((_response) => {
        setIsLoggedIn(true);
        console.log("Authentication status: Logged in");
      })
      .catch((error) => {
        setIsLoggedIn(false);
        console.error("Error checking authentication status:", error);
      });
  }, [location]);

  const handleLogout = () => {
    axios
      .post("/logout")
      .then((response) => {
        console.log(response.data.message);
        localStorage.removeItem("sessionToken");
        setIsLoggedIn(false);
      })
      .catch((error) => {
        console.error("Error logging out:", error);
      });
  };

  if (!isLoggedIn) {
    return (
      <nav className="bg-gray-800 p-4 flex justify-between items-center">
        <button onClick={() => navigate("/")}>
          <img
            src="https://via.placeholder.com/40"
            alt="Logo"
            className="h-10"
          />
        </button>
        <div className="flex space-x-4">
          <button
            onClick={() => navigate("/register")}
            className="bg-blue-500 text-white rounded px-4 py-2 hover:bg-blue-700"
          >
            Register
          </button>
          <button
            onClick={() => setIsLoginOpen(true)}
            className="bg-blue-500 text-white rounded px-4 py-2 hover:bg-blue-700"
          >
            Login
          </button>
          <LoginModal
            isOpen={isLoginOpen}
            onRequestClose={() => setIsLoginOpen(false)}
          />
        </div>
      </nav>
    );
  }

  return (
    <nav className="bg-gray-800 p-4 flex justify-between items-center">
      <button onClick={() => navigate("/")}>
        <img src="https://via.placeholder.com/40" alt="Logo" className="h-10" />
      </button>
      <div className="flex space-x-4">
        <button
          onClick={() => navigate("/create-recipe")}
          className="bg-blue-500 text-white rounded px-4 py-2 hover:bg-blue-700"
        >
          Lisää resepti
        </button>
        <button
          onClick={() => navigate("/profile")}
          className="bg-blue-500 text-white rounded px-4 py-2 hover:bg-blue-700"
        >
          Profiili
        </button>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white rounded px-4 py-2 hover:bg-red-700"
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
