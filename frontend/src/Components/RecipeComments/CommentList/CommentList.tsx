import React, { useEffect, useState } from "react";
import axios from "axios";

interface Comment {
  id: number;
  content: string;
  timestamp: string;
  nickname: string;
  profile_picture_url: string;
  user_id: number;
}

interface CommentListProps {
  recipeId: number;
}

const CommentList: React.FC<CommentListProps> = ({ recipeId }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);

  const fetchComments = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/recipe/${recipeId}/comments`
      );
      setComments(response.data);
    } catch (err) {
      console.error("Failed to fetch comments", err);
    }
  };

  const fetchCurrentUserId = async () => {
    try {
      const token = localStorage.getItem("sessionToken");
      if (!token) {
        throw new Error("No token found");
      }

      const response = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/getUserDetails`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setCurrentUserId(response.data.id);
      console.log("Current User ID:", response.data.id); // Debugging log
    } catch (err) {
      console.error("Failed to fetch current user ID", err);
    }
  };

  const handleDelete = async (commentId: number) => {
    try {
      const token = localStorage.getItem("sessionToken");
      if (!token) {
        throw new Error("No token found");
      }

      await axios.delete(
        `${process.env.REACT_APP_API_BASE_URL}/comment/${commentId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      fetchComments(); // Refresh comments after deletion
    } catch (err) {
      console.error("Failed to delete comment", err);
    }
  };

  useEffect(() => {
    fetchComments();
    fetchCurrentUserId();
  }, [recipeId]);

  console.log("Comments:", comments); // Debugging log

  return (
    <div>
      {comments.map((comment) => (
        <div key={comment.id}>
          {comment.profile_picture_url && (
            <img src={comment.profile_picture_url} alt={comment.nickname} />
          )}
          <p>{comment.nickname}</p>
          <p>{comment.content}</p>
          <p>{new Date(comment.timestamp).toLocaleString()}</p>
          {currentUserId === comment.user_id && (
            <button onClick={() => handleDelete(comment.id)}>Delete</button>
          )}
        </div>
      ))}
    </div>
  );
};

export default CommentList;
