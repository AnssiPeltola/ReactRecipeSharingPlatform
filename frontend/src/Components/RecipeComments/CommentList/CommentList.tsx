import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Comment } from "../../../Types/types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { useSelector } from "react-redux";
import { RootState } from "../../../Redux/store";
import "../../../Styles/loadingAnimation.css";

interface CommentListProps {
  recipeId: number;
}

const CommentList: React.FC<CommentListProps> = ({ recipeId }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalComments, setTotalComments] = useState(0);
  const [loading, setLoading] = useState(false);
  const commentsPerPage = 10;
  const user = useSelector((state: RootState) => state.auth.user);
  const placeholderImageUrl = "/placeholder-user.png";
  const navigate = useNavigate(); // Use navigate hook

  useEffect(() => {
    fetchComments(1, true);
  }, [recipeId]);

  const fetchComments = async (page: number, reset = false) => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/recipe/${recipeId}/comments`,
        {
          params: { page, limit: commentsPerPage },
        }
      );
      setComments((prevComments) =>
        reset
          ? response.data.comments
          : [...prevComments, ...response.data.comments]
      );
      setTotalComments(response.data.totalComments);
    } catch (err) {
      console.error("Failed to fetch comments", err);
    } finally {
      setLoading(false);
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
      setComments((prevComments) =>
        prevComments.filter((comment) => comment.id !== commentId)
      );
      setTotalComments((prevTotal) => prevTotal - 1);
    } catch (err) {
      console.error("Failed to delete comment", err);
    }
  };

  const loadMoreComments = () => {
    const nextPage = currentPage + 1;
    setCurrentPage(nextPage);
    fetchComments(nextPage);
  };

  const handleProfileClick = (userId: number) => {
    navigate(`/profile/user/${userId}`);
  };

  return (
    <div className="space-y-4">
      {comments.map((comment, index) => (
        <div
          key={`${comment.id}-${index}`}
          className="relative flex items-start space-x-4 p-4 border-b border-gray-200"
        >
          <img
            src={comment.profile_picture_url || placeholderImageUrl}
            alt={comment.nickname}
            className="w-12 h-12 rounded-full cursor-pointer"
            onClick={() => handleProfileClick(comment.user_id)}
          />
          <div className="flex-1">
            <div className="flex justify-between items-center">
              <p
                className="font-semibold cursor-pointer"
                onClick={() => handleProfileClick(comment.user_id)}
              >
                {comment.nickname}
              </p>
              <p className="text-gray-500 text-sm mr-8">
                {new Date(comment.timestamp).toLocaleDateString()}
              </p>
            </div>
            <p
              className="mt-2 break-words"
              style={{ wordBreak: "break-word", overflowWrap: "break-word" }}
            >
              {comment.content}
            </p>
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
      {loading && (
        <div className="flex justify-center items-center mt-4">
          <div className="loader"></div>
        </div>
      )}
      {!loading && comments.length < totalComments && (
        <div className="text-center mt-4">
          <button
            onClick={loadMoreComments}
            className="bg-blue-500 text-white p-2 rounded"
          >
            Näytä lisää kommentteja
          </button>
        </div>
      )}
    </div>
  );
};

export default CommentList;
