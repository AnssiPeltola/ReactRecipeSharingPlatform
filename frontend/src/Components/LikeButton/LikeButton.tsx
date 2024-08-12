import React, { useState, useEffect } from "react";
import axios from "axios";

interface LikeButtonProps {
  recipeId: string;
}

const LikeButton: React.FC<LikeButtonProps> = ({ recipeId }) => {
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    checkIfLiked();
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
    } catch (error) {
      console.error("Error unliking the recipe:", error);
    }
  };

  return (
    <button onClick={liked ? handleUnlike : handleLike}>
      {liked ? "Unlike" : "Like"}
    </button>
  );
};

export default LikeButton;
