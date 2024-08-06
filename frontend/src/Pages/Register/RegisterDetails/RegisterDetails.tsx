import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function RegisterDetails() {
  const [bio, setBio] = useState("");
  const [location, setLocation] = useState("");
  const [instagram, setInstagram] = useState("");
  const [tiktok, setTiktok] = useState("");
  const [experienceLevel, setExperienceLevel] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("sessionToken");
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/register-details`,
        {
          bio,
          location,
          instagram,
          tiktok,
          experienceLevel,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log(response.data);
      navigate("/");
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("sessionToken");
    if (!token) {
      navigate("/login"); // Redirect to login if not authenticated
    }
  }, [navigate]);

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={bio}
        onChange={(e) => setBio(e.target.value)}
        placeholder="Bio (optional)"
      />
      <input
        type="text"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        placeholder="Location (optional)"
      />
      <input
        type="text"
        value={instagram}
        onChange={(e) => setInstagram(e.target.value)}
        placeholder="Instagram (optional)"
      />
      <input
        type="text"
        value={tiktok}
        onChange={(e) => setTiktok(e.target.value)}
        placeholder="TikTok (optional)"
      />
      <input
        type="text"
        value={experienceLevel}
        onChange={(e) => setExperienceLevel(e.target.value)}
        placeholder="Experience Level (optional)"
      />
      <button type="submit">Complete Registration</button>
    </form>
  );
}

export default RegisterDetails;
