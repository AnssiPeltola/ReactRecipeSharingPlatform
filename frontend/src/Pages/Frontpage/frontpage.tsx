import React from "react";
import RecipeSearch from "../../Components/RecipeSearch/RecipeSearch";
import RandomRecipeButton from "../../Components/RandomRecipeButton/RandomRecipeButton";
import CategorySelection from "../../Components/CategorySelection/CategorySelection";
import LatestRecipes from "../../Components/LatestRecipes/LatestRecipes";

function Frontpage() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold mb-4">Onko nälkä? Hyvä, aloitetaan!</h1>
      <p className="text-lg mb-6">
        Sukella sapuskoihin, rakenna annoksesi ja heitä herkkufiilistelyt
        jakoon!
      </p>
      <div className="mb-6">
        <RecipeSearch />
      </div>
      <div className="mb-6">
        <RandomRecipeButton />
      </div>
      <div className="mb-6">
        <CategorySelection />
      </div>
      <div className="mb-6">
        <LatestRecipes />
      </div>
    </div>
  );
}

export default Frontpage;
