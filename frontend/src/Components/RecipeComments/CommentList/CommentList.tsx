import React, { useEffect, useState } from "react";
import axios from "axios";
import { Comment } from "../../../Types/types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

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
    <div className="space-y-4">
      {comments.map((comment) => (
        <div
          key={comment.id}
          className="relative flex items-start space-x-4 p-4 border-b border-gray-200"
        >
          {comment.profile_picture_url && (
            <img
              src={comment.profile_picture_url}
              alt={comment.nickname}
              className="w-12 h-12 rounded-full"
            />
          )}
          <div className="flex-1">
            <div className="flex justify-between items-center">
              <p className="font-semibold">{comment.nickname}</p>
              <p className="text-gray-500 text-sm mr-8">
                {new Date(comment.timestamp).toLocaleString()}
              </p>
            </div>
            <p className="mt-2">{comment.content}</p>
          </div>
          {currentUserId === comment.user_id && (
            <button
              onClick={() => handleDelete(comment.id)}
              className="absolute top-2 right-2 text-red-500 hover:text-red-600 transition-colors duration-200"
            >
              <FontAwesomeIcon icon={faTrash} />
            </button>
          )}
        </div>
      ))}
    </div>
  );
};

export default CommentList;
