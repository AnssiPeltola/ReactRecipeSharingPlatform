import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { RecipeState } from "../../Types/types";
import LikeButton from "../../Components/LikeButton/LikeButton";
import AddComment from "../../Components/RecipeComments/AddComment/AddComment";
import CommentList from "../../Components/RecipeComments/CommentList/CommentList";

const placeholderImageUrl = "https://via.placeholder.com/150";

const RecipeDetails = () => {
  const { recipeId } = useParams<{ recipeId: string }>();
  const [recipe, setRecipe] = useState<RecipeState | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchRecipe = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`/recipe/${recipeId}`);
      setRecipe(response.data);
    } catch (err) {
      setError("Failed to fetch recipe details.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecipe();
  }, [recipeId]);

  if (loading) return <div className="text-center mt-4">Loading...</div>;
  if (error)
    return <div className="text-center mt-4 text-red-500">Error: {error}</div>;

  console.log(recipe);

  return (
    <div className="max-w-4xl mx-auto p-4">
      {recipe && (
        <>
          <h1 className="text-3xl font-bold mb-4">{recipe.title}</h1>
          <p className="text-lg mb-4">
            {recipe.category} - {recipe.secondary_category} -{" "}
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
            {recipe.instructions.split("\r\n").map((step, index) => (
              <div key={index} className="ml-1">{`${index + 1}. ${step}`}</div>
            ))}
          </div>
          <p className="mb-4 font-semibold">
            Keittiökynäilijä {recipe.nickname}
          </p>
          <LikeButton recipeId={recipe.id || ""} />
          <div className="mt-4">
            <AddComment
              recipeId={parseInt(recipe.id || "")}
              onCommentAdded={() => fetchRecipe()}
            />
          </div>
          <CommentList recipeId={parseInt(recipe.id || "")} />
        </>
      )}
    </div>
  );
};

export default RecipeDetails;
