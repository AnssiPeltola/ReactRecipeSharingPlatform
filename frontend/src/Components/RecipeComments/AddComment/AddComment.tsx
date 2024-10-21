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
  const [error, setError] = useState<string | null>(null);
  const isLoggedIn = useSelector((state: RootState) => state.auth.isLoggedIn);
  const maxCharacters = 250;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedContent = content.trim();
    if (!trimmedContent) {
      setError("Kommentti ei voi olla tyhjä tai sisältää vain välilyöntejä.");
      return;
    }

    try {
      const token = localStorage.getItem("sessionToken");
      if (!token) {
        throw new Error("No token found");
      }

      await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/recipe/${recipeId}/comment`,
        { content: trimmedContent },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setContent("");
      setError(null);
      onCommentAdded();
    } catch (err) {
      console.error("Failed to add comment", err);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;
    setContent(newContent);
    if (newContent.trim() || newContent.length === 0) {
      setError(null);
    }
  };

  if (!isLoggedIn) {
    return null;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="relative">
        <textarea
          value={content}
          onChange={handleChange}
          placeholder="Anna palautetta sapuskasta!"
          required
          maxLength={maxCharacters}
          className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <div className="absolute bottom-2 right-2 text-gray-500 text-sm">
          {content.length}/{maxCharacters}
        </div>
      </div>
      {error && <p className="text-red-500">{error}</p>}
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
