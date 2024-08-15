import React, { useState, useEffect } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";

interface LikeButtonProps {
  recipeId: string;
}

const LikeButton: React.FC<LikeButtonProps> = ({ recipeId }) => {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);

  useEffect(() => {
    checkIfLiked();
    fetchLikeCount();
  }, []);

  const checkIfLiked = async () => {
    try {
      const token = localStorage.getItem("sessionToken");
      const response = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/isRecipeLiked/${recipeId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setLiked(response.data.liked);
    } catch (error) {
      console.error("Error checking if recipe is liked:", error);
    }
  };

  const fetchLikeCount = async () => {
    try {
      const token = localStorage.getItem("sessionToken");
      const response = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/recipeLikes/${recipeId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setLikeCount(Number(response.data.likes));
    } catch (error) {
      console.error("Error fetching like count:", error);
    }
  };

  const handleLike = async () => {
    try {
      const token = localStorage.getItem("sessionToken");
      await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/likeRecipe/${recipeId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setLiked(true);
      setLikeCount(likeCount + 1);
    } catch (error) {
      console.error("Error liking the recipe:", error);
    }
  };

  const handleUnlike = async () => {
    try {
      const token = localStorage.getItem("sessionToken");
      await axios.delete(
        `${process.env.REACT_APP_API_BASE_URL}/unlikeRecipe/${recipeId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setLiked(false);
      setLikeCount(likeCount - 1);
    } catch (error) {
      console.error("Error unliking the recipe:", error);
    }
  };

  return (
    <div className="flex items-center space-x-2">
      <button
        onClick={liked ? handleUnlike : handleLike}
        className={`px-4 py-2 rounded ${
          liked ? "bg-red-500 text-white" : "bg-blue-500 text-white"
        } hover:opacity-75 transition-opacity duration-200`}
      >
        {liked ? "Unlike" : "Like"}
      </button>
      <FontAwesomeIcon icon={faStar} className="mx-2 text-yellow-500" />
      <p className="text-gray-700">{likeCount} likes</p>
    </div>
  );
};

export default LikeButton;
