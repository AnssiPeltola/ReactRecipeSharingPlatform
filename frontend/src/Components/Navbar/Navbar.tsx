import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import LoginModal from "../Modal/LoginModal/LoginModal";
import { LANDING } from "../../Constants/routes";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../Redux/authSlice";
import { RootState } from "../../Redux/store";

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const auth = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    const token = localStorage.getItem("sessionToken");

    if (!token) {
      setIsLoggedIn(false);
      console.log("Authentication status: Not logged in");
      return;
    }

    if (token && auth.isLoggedIn) {
      setIsLoggedIn(true);
      console.log("Authentication status: Logged in");
      return;
    }
  }, [location, auth.isLoggedIn]);

  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === "sessionToken") {
        const token = event.newValue;
        if (token) {
          setIsLoggedIn(true);
          console.log("Authentication status: Logged in (from storage event)");
        } else {
          setIsLoggedIn(false);
          dispatch(logout());
          navigate(LANDING);
          console.log(
            "Authentication status: Not logged in (from storage event)"
          );
        }
      }
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [dispatch, navigate]);

  const handleLogout = () => {
    axios
      .post("/logout")
      .then((response) => {
        console.log(response.data.message);
        localStorage.removeItem("sessionToken");
        setIsLoggedIn(false);
        dispatch(logout());
        console.log("Auth state after logout:", auth); // for testing if dispatch worked
        navigate(LANDING);
      })
      .catch((error) => {
        console.error("Error logging out:", error);
      });
  };

  if (!isLoggedIn) {
    return (
      <nav className="fixed top-0 left-0 w-full bg-gray-800 p-4 flex justify-between items-center z-50">
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
    <nav className="fixed top-0 left-0 w-full bg-gray-800 p-4 flex justify-between items-center z-50">
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
