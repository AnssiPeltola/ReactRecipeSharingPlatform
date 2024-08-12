import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { RecipeState } from "../../Types/types";
import LikeButton from "../../Components/LikeButton/LikeButton";

const RecipeDetails = () => {
  const { recipeId } = useParams<{ recipeId: string }>();
  const [recipe, setRecipe] = useState<RecipeState | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
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
    fetchRecipe();
  }, [recipeId]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  console.log(recipe);

  return (
    <div>
      {recipe && (
        <>
          <h1>{recipe.title}</h1>
          <p>
            {recipe.category} - {recipe.secondary_category}
          </p>
          <img
            src={`${process.env.REACT_APP_API_BASE_URL}/recipePicture/${recipe.picture_url}`}
            alt={recipe.title}
          />
          <div>
            Ingredients:
            {(recipe.ingredients ?? []).map((ingredient, index) => (
              <div
                key={index}
              >{`${ingredient.quantity} ${ingredient.unit} ${ingredient.name}`}</div>
            ))}
          </div>
          <p>{recipe.instructions}</p>
          <p>Recipe by: {recipe.nickname}</p>
          <LikeButton recipeId={recipe.id || ""} />
        </>
      )}
    </div>
  );
};

export default RecipeDetails;
