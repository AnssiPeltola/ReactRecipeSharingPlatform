import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { RootState } from "../../Redux/store";
import { RecipeState } from "../../Types/types";
import LikeButton from "../../Components/LikeButton/LikeButton";
import AddComment from "../../Components/RecipeComments/AddComment/AddComment";
import CommentList from "../../Components/RecipeComments/CommentList/CommentList";
import ConfirmModal from "../../Components/Modal/ConfirmModal/ConfirmModal";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "../../Styles/loadingAnimation.css";

const placeholderImageUrl = "/placeholder-food.png";

const RecipeDetails = () => {
  const { recipeId } = useParams<{ recipeId: string }>();
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.auth.user);
  const [recipe, setRecipe] = useState<RecipeState | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);

  const openModal = () => setShowModal(true);
  const closeModal = () => setShowModal(false);

  const fetchRecipe = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/recipe/${recipeId}`
      );
      setRecipe(response.data);
    } catch (err) {
      console.error("Error fetching recipe:", err);
      setError("Failed to fetch recipe details.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecipe();
  }, [recipeId]);

  const handleEditClick = () => {
    navigate(`/edit-recipe/${recipeId}`);
  };

  const handleDeleteClick = async () => {
    try {
      const token = localStorage.getItem("sessionToken");
      await axios.delete(
        `${process.env.REACT_APP_API_BASE_URL}/recipe/delete/${recipe?.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: { userId: user?.id },
        }
      );
      navigate("/");
    } catch (error) {
      console.error("Error deleting recipe:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <div className="loader"></div>
        <p className="mt-4 text-lg text-gray-700">Ladataan...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <div className="text-center mt-4 text-red-500">
          <p>Reseptiä ei löytynyt.</p>
        </div>
        <div className="mt-4">
          <button
            onClick={() => navigate("/")}
            className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-700"
          >
            Siirry etusivulle
          </button>
          <button
            onClick={() => window.location.reload()}
            className="ml-4 px-4 py-2 text-white bg-green-500 rounded hover:bg-green-700"
          >
            Päivitä sivu
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      {recipe && (
        <>
          <h1 className="text-3xl font-bold mb-4">{recipe.title}</h1>
          <p className="text-lg mb-4">
            {recipe.category} - {recipe.secondary_categories.join(", ")} -{" "}
            {recipe.main_ingredient}
          </p>
          <img
            className="w-full h-auto mb-4 rounded object-contain"
            src={
              recipe.picture_url
                ? `${process.env.REACT_APP_API_BASE_URL}/recipePicture/${recipe.picture_url}`
                : placeholderImageUrl
            }
            alt={recipe.title}
          />
          <div className="mb-4">
            <h2 className="text-2xl font-semibold mb-2">Kokkausroippeet:</h2>
            <ul className="list-disc list-inside">
              {(recipe.ingredients ?? []).map((ingredient, index) => (
                <li key={index} className="mb-1">
                  {`${ingredient.quantity} ${ingredient.unit} ${ingredient.name}`}
                </li>
              ))}
            </ul>
          </div>
          <div className="mb-4">
            <p className="text-2xl font-semibold mb-2">
              Kokin salaiset liikkeet:
            </p>
            {recipe.instructions.split(/\r?\n/).map((step, index) => (
              <div
                key={index}
                className="ml-1 break-words"
                style={{ wordBreak: "break-word", overflowWrap: "break-word" }}
              >{`${index + 1}. ${step}`}</div>
            ))}
          </div>
          <p
            className="mb-4 font-semibold cursor-pointer text-blue-500 hover:bg-blue-100 transition duration-200 inline-flex items-center"
            onClick={() => navigate(`/profile/user/${recipe.user_id}`)}
          >
            <FontAwesomeIcon icon={faUser} className="mr-2" />
            Keittiökynäilijä {recipe.nickname}
          </p>
          <p className="mb-4">
            Resepti luotu: {new Date(recipe.created_at).toLocaleDateString()}
          </p>
          <LikeButton recipeId={recipe.id || ""} />
          <div className="mt-4">
            <AddComment
              recipeId={parseInt(recipe.id || "")}
              onCommentAdded={() => fetchRecipe()}
            />
          </div>
          <CommentList recipeId={parseInt(recipe.id || "")} />
          {user && user.id?.toString() === recipe.user_id.toString() && (
            <>
              <button
                onClick={handleEditClick}
                className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded mt-4"
              >
                Muokkaa reseptiä
              </button>
              <button
                onClick={openModal}
                className="bg-red-500 hover:bg-red-600 text-white p-2 rounded mt-4 ml-2"
              >
                Poista resepti
              </button>
            </>
          )}
          <ConfirmModal
            show={showModal}
            onClose={closeModal}
            onConfirm={handleDeleteClick}
            title="Vahvista poisto"
            message="Haluatko varmasti poistaa tämän reseptin? Tätä toimintoa ei voi peruuttaa."
            confirmText="Kyllä, poista resepti"
            cancelText="Ei, jätä resepti"
          />
        </>
      )}
    </div>
  );
};

export default RecipeDetails;
