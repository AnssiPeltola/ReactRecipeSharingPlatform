import React from "react";
import RecipeSearch from "../../Components/RecipeSearch/RecipeSearch";

function Frontpage() {
  return (
    <div>
      <h1>Tervetuloa</h1>
      <p>
        Löydä reseptejä, suunnittele ateriasi ja jaa kokemuksesi muiden kanssa!
      </p>
      <RecipeSearch />
    </div>
  );
}

export default Frontpage;
