import React from "react";
import RecipeSearch from "../../Components/RecipeSearch/RecipeSearch";
import RandomRecipeButton from "../../Components/RandomRecipeButton/RandomRecipeButton";
import CategorySelection from "../../Components/CategorySelection/CategorySelection";

function Frontpage() {
  return (
    <div>
      <h1>Tervetuloa</h1>
      <p>
        Löydä reseptejä, suunnittele ateriasi ja jaa kokemuksesi muiden kanssa!
      </p>
      <RecipeSearch />
      <RandomRecipeButton />
      <CategorySelection />
    </div>
  );
}

export default Frontpage;
