import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import styles from "./Navbar.module.scss";
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
      <nav className={styles.nav}>
        <button onClick={() => navigate("/")}>
          <img src="https://via.placeholder.com/40" alt="Logo" />
        </button>
        <div>
          <button onClick={() => navigate("/register")}>Register</button>
          <button onClick={() => setIsLoginOpen(true)}>Login</button>
          <LoginModal
            isOpen={isLoginOpen}
            onRequestClose={() => setIsLoginOpen(false)}
          />
        </div>
      </nav>
    );
  }

  return (
    <nav className={styles.nav}>
      <button onClick={() => navigate("/")}>
        <img src="https://via.placeholder.com/40" alt="Logo" />
      </button>
      <div>
        <button onClick={() => navigate("/create-recipe")}>
          Lisää resepti
        </button>
        <button onClick={() => navigate("/profile")}>Profiili</button>
        <button onClick={handleLogout}>Logout</button>
      </div>
    </nav>
  );
};

export default Navbar;
