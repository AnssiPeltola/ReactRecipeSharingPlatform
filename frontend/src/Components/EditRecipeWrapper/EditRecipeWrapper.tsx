import React from "react";
import { useParams } from "react-router-dom";
import CreateRecipe from "../../Pages/RecipeCreate/RecipeCreate";

const EditRecipeWrapper = () => {
  const { recipeId } = useParams<{ recipeId: string }>();
  return <CreateRecipe mode="edit" recipeId={recipeId} />;
};

export default EditRecipeWrapper;
