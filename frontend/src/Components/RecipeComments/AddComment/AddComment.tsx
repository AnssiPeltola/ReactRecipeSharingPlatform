import React, { useState } from "react";
import axios from "axios";

interface AddCommentProps {
  recipeId: number;
  onCommentAdded: () => void;
}

const AddComment: React.FC<AddCommentProps> = ({
  recipeId,
  onCommentAdded,
}) => {
  const [content, setContent] = useState("");

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

  return (
    <form onSubmit={handleSubmit}>
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Add a comment"
        required
      />
      <button type="submit">Submit</button>
    </form>
  );
};

export default AddComment;
