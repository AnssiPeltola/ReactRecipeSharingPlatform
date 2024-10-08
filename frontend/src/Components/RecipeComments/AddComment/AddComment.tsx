import React, { useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { RootState } from "../../../Redux/store";

interface AddCommentProps {
  recipeId: number;
  onCommentAdded: () => void;
}

const AddComment: React.FC<AddCommentProps> = ({
  recipeId,
  onCommentAdded,
}) => {
  const [content, setContent] = useState("");
  const isLoggedIn = useSelector((state: RootState) => state.auth.isLoggedIn);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("sessionToken");
      if (!token) {
        throw new Error("No token found");
      }

      await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/recipe/${recipeId}/comment`,
        { content },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setContent("");
      onCommentAdded();
    } catch (err) {
      console.error("Failed to add comment", err);
    }
  };

  if (!isLoggedIn) {
    return null;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Anna palautetta sapuskasta!"
        required
        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <button
        type="submit"
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors duration-200"
      >
        Lähetä makutuomio!
      </button>
    </form>
  );
};

export default AddComment;
