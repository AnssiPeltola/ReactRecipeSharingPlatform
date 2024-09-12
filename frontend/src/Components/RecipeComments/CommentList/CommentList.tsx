import React, { useEffect, useState } from "react";
import axios from "axios";
import { Comment } from "../../../Types/types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { useSelector } from "react-redux";
import { RootState } from "../../../Redux/store";

interface CommentListProps {
  recipeId: number;
}

const CommentList: React.FC<CommentListProps> = ({ recipeId }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const placeholderImageUrl = "https://via.placeholder.com/40";
  const user = useSelector((state: RootState) => state.auth.user);

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
  }, [recipeId]);

  console.log("Comments:", comments);

  return (
    <div className="space-y-4">
      {comments.map((comment) => (
        <div
          key={comment.id}
          className="relative flex items-start space-x-4 p-4 border-b border-gray-200"
        >
          <img
            src={comment.profile_picture_url || placeholderImageUrl}
            alt={comment.nickname}
            className="w-12 h-12 rounded-full"
          />
          <div className="flex-1">
            <div className="flex justify-between items-center">
              <p className="font-semibold">{comment.nickname}</p>
              <p className="text-gray-500 text-sm mr-8">
                {new Date(comment.timestamp).toLocaleString()}
              </p>
            </div>
            <p className="mt-2">{comment.content}</p>
          </div>
          {user?.id === comment.user_id && (
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
