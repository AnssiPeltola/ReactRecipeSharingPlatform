import { useLocation, Link } from "react-router-dom";
import { RecipeState } from "../../Types/types";
import { LANDING } from "../../Constants/routes";

interface ExtendedRecipeState extends RecipeState {
  id: string;
  pictureUrl: string;
}

const placeholderImageUrl = "https://via.placeholder.com/150";

const SearchResultsPage = () => {
  const location = useLocation();
  const state = location.state as
    | { recipes: ExtendedRecipeState[] }
    | undefined;

  if (!state || !state.recipes || state.recipes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <p className="text-xl font-semibold mb-4">Reseptejä ei löytynyt!</p>
        <Link to={LANDING}>
          <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-200">
            Palaa etusivulle
          </button>
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
      {state.recipes.map((recipe) => (
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
  );
};

export default SearchResultsPage;
