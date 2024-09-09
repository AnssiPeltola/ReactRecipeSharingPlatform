import React, { useState, useEffect } from "react";
import axios from "axios";
import { User } from "../../../Types/types";
import { useNavigate } from "react-router-dom";
import ProfilePictureModal from "../../../Components/ProfilePictureModal/ProfilePictureModal";
import { useDispatch } from "react-redux";
import { updateUserProfile } from "../../../Redux/authSlice";

const ModifyUserInfo = () => {
  const [userDetails, setUserDetails] = useState<Partial<User> | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    fetchUserDetails();
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

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setUserDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  const handleProfilePictureUpload = (fileId: number) => {
    setUserDetails((prevDetails) => ({
      ...prevDetails,
      profilePictureId: fileId,
    }));
  };

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem("sessionToken");
      await axios.post("/register-details", userDetails, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (userDetails) {
        const { password, ...userWithoutPassword } = userDetails as User & {
          password?: string;
        };
        dispatch(updateUserProfile(userWithoutPassword));
      }
      navigate(-1);
    } catch (error) {
      console.error("Error updating user details:", error);
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Muuta käyttäjätietojasi</h1>
      {userDetails && (
        <div className="bg-white shadow-md rounded-lg p-6">
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2">
              Bio:
              <input
                type="text"
                name="bio"
                value={userDetails.bio || ""}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              />
            </label>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2">
              Sijainti:
              <input
                type="text"
                name="location"
                value={userDetails.location || ""}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              />
            </label>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2">
              Instagram:
              <input
                type="text"
                name="instagram"
                value={userDetails.instagram || ""}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              />
            </label>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2">
              TikTok:
              <input
                type="text"
                name="tiktok"
                value={userDetails.tiktok || ""}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              />
            </label>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2">
              Kokkitasosi:
              <select
                name="experience_level"
                value={userDetails.experience_level || ""}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              >
                <option value="Keittiön noviisi">
                  Keittiön noviisi (Aloittelija)
                </option>
                <option value="Rohkea reseptien testaaja">
                  Rohkea reseptien testaaja (Perustaso)
                </option>
                <option value="Kokkauskulttuurin kehittäjä">
                  Kokkauskulttuurin kehittäjä (Keskitaso)
                </option>
                <option value="Maustemestari">Maustemestari (Edistynyt)</option>
                <option value="Kauhan konkari">
                  Kauhan konkari (Ammattilainen)
                </option>
              </select>
            </label>
          </div>
          <div className="mb-4">
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-200"
            >
              Muuta profiilikuva
            </button>
          </div>
          <div className="flex justify-end mt-6">
            <button
              onClick={handleBack}
              className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition duration-200 mr-2"
            >
              Takaisin
            </button>
            <button
              onClick={handleSubmit}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-200"
            >
              Tallenna
            </button>
          </div>
        </div>
      )}
      <ProfilePictureModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onUpload={handleProfilePictureUpload}
      />
    </div>
  );
};

export default ModifyUserInfo;
