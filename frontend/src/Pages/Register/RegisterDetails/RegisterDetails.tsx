import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ProgressBar from "../../../Components/ProgressBar/ProgressBar";

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
      navigate("/register-picture");
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
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <ProgressBar currentStep={2} maxStep={3} />
        <h2 className="text-2xl font-semibold text-gray-700 mb-6">
          Register Details
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Bio (optional)"
            className="w-full p-2 border border-gray-300 rounded"
          />
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Location (optional)"
            className="w-full p-2 border border-gray-300 rounded"
          />
          <input
            type="text"
            value={instagram}
            onChange={(e) => setInstagram(e.target.value)}
            placeholder="Instagram (optional)"
            className="w-full p-2 border border-gray-300 rounded"
          />
          <input
            type="text"
            value={tiktok}
            onChange={(e) => setTiktok(e.target.value)}
            placeholder="TikTok (optional)"
            className="w-full p-2 border border-gray-300 rounded"
          />
          <input
            type="text"
            value={experienceLevel}
            onChange={(e) => setExperienceLevel(e.target.value)}
            placeholder="Experience Level (optional)"
            className="w-full p-2 border border-gray-300 rounded"
          />
          <button
            type="submit"
            className="w-full py-2 text-white bg-blue-500 rounded hover:bg-blue-700"
          >
            Continue
          </button>
        </form>
      </div>
    </div>
  );
}

export default RegisterDetails;
