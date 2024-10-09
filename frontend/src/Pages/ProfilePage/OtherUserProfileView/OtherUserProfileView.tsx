import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import UserRecipes from "../../../Components/UserRecipes/UserRecipes";
import "../../../Styles/loadingAnimation.css";

const OtherUserProfileView = () => {
  const { userId } = useParams<{ userId: string }>();
  const [profile, setProfile] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_BASE_URL}/user/${userId}`
        );
        setProfile(response.data);
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (userId) {
      fetchProfile();
    }
  }, [userId]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <div className="loader"></div>
        <p className="mt-4 text-lg text-gray-700">Ladataan...</p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <p className="mt-4 text-lg text-gray-700">Profiilia ei löytynyt.</p>
      </div>
    );
  }

  const profilePicture = profile.profile_picture_data
    ? `data:${profile.profile_picture_type};base64,${btoa(
        new Uint8Array(profile.profile_picture_data.data).reduce(
          (data, byte) => data + String.fromCharCode(byte),
          ""
        )
      )}`
    : "/placeholder-user.png";

  return (
    <div className="max-w-4xl mx-auto p-4">
      {profilePicture && (
        <img
          src={profilePicture}
          alt="Profile"
          className="w-32 h-32 rounded-full mx-auto mb-6 border-4 border-gray-300"
        />
      )}
      <div className="bg-white shadow-md rounded-lg p-6 mb-6">
        <p className="text-lg font-semibold mb-2">
          Käyttäjänimi: {profile.nickname}
        </p>
        <p className="text-lg mb-2">Bio: {profile.bio}</p>
        <p className="text-lg mb-2">Sijainti: {profile.location}</p>
        <p className="text-lg mb-2">Instagram: {profile.instagram}</p>
        <p className="text-lg mb-2">TikTok: {profile.tiktok}</p>
        <p className="text-lg mb-2">Kokkitasosi: {profile.experience_level}</p>
      </div>
      {userId && <UserRecipes userId={userId} />}
    </div>
  );
};

export default OtherUserProfileView;
