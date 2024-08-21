import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { RecipeState } from "../../Types/types";
import { LANDING } from "../../Constants/routes";

interface ExtendedRecipeState extends RecipeState {
  id: string;
  pictureUrl: string;
}

const placeholderImageUrl = "https://via.placeholder.com/150";

const LatestRecipes = () => {
  const [recipes, setRecipes] = useState<ExtendedRecipeState[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLatestRecipes = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_BASE_URL}/latestRecipes`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch latest recipes");
        }
        const data = await response.json();
        setRecipes(data);
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError("An unknown error occurred");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchLatestRecipes();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (recipes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <p className="text-xl font-semibold mb-4">No recipes found!</p>
        <Link to={LANDING}>
          <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-200">
            Go back to homepage
          </button>
        </Link>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-center text-gray-800">
        Vasta naputellut ruokaoivallukset
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
        {recipes.map((recipe) => (
          <Link to={`/recipe/${recipe.id}`} key={recipe.id} className="block">
            <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200">
              <img
                src={
                  recipe.picture_url
                    ? `${process.env.REACT_APP_API_BASE_URL}/recipePicture/${recipe.picture_url}`
                    : placeholderImageUrl
                }
                alt={recipe.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="text-lg font-semibold">{recipe.title}</h3>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default LatestRecipes;
