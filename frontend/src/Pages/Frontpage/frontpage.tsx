import React from "react";
import RecipeSearch from "../../Components/RecipeSearch/RecipeSearch";
import RandomRecipeButton from "../../Components/RandomRecipeButton/RandomRecipeButton";
import CategorySelection from "../../Components/CategorySelection/CategorySelection";

function Frontpage() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold mb-4">Tervetuloa</h1>
      <p className="text-lg mb-6">
        Löydä reseptejä, suunnittele ateriasi ja jaa kokemuksesi muiden kanssa!
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
    </div>
  );
}

export default Frontpage;
