import { useLocation, Link } from "react-router-dom";
import { RecipeState } from "../../Types/types";

interface ExtendedRecipeState extends RecipeState {
  id: number;
  pictureUrl: string; // Assuming this holds just the filename or a relative path
}

const SearchResultsPage = () => {
  const location = useLocation();
  const state = location.state as
    | { recipes: ExtendedRecipeState[] }
    | undefined;

  if (!state || !state.recipes) {
    return <div>No recipes found.</div>;
  }

  return (
    <div>
      {state.recipes.map((recipe) => (
        <Link to={`/recipe/${recipe.id}`} key={recipe.id}>
          <div>
            <img
              src={`${process.env.REACT_APP_API_BASE_URL}/recipePicture/${recipe.picture_url}`}
              alt={recipe.title}
            />
            <h3>{recipe.title}</h3>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default SearchResultsPage;
