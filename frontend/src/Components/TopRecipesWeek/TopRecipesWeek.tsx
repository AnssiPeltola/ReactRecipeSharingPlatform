import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "../../Styles/loadingAnimation.css";

const placeholderImageUrl = "/placeholder-food.png";

const TopRecipesWeek: React.FC = () => {
  const [topRecipes, setTopRecipes] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchTopRecipes = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_BASE_URL}/topRecipesWeek`
        );
        setTopRecipes(response.data);
      } catch (error) {
        console.error("Error fetching top recipes of the week", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTopRecipes();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="loader"></div>
      </div>
    );
  }

  if (topRecipes.length === 0) {
    return (
      <div className="text-center">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Tämän viikon suosikkiannokset
        </h1>
        <p className="text-xl font-semibold mb-4">Reseptejä ei löytynyt!</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
        Tämän viikon suosikkiannokset
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {topRecipes.map((recipe) => (
          <Link
            to={`/recipe/${recipe.recipe_id}`}
            key={recipe.recipe_id}
            className="block"
          >
            <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200">
              <img
                src={
                  recipe.picture_url
                    ? `${process.env.REACT_APP_API_BASE_URL}/recipePicture/${recipe.picture_url}`
                    : placeholderImageUrl
                }
                alt={recipe.title}
                className="w-full h-48 object-contain"
              />
              <div className="p-4">
                <h3 className="text-lg font-semibold">{recipe.title}</h3>
                <p className="text-gray-600">{recipe.like_count} Makupeukkua</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default TopRecipesWeek;
