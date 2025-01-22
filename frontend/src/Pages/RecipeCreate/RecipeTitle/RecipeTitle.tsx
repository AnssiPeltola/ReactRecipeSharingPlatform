import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  setTitle,
  setCategory,
  setSecondaryCategories,
  setMainIngredient,
  setMainIngredientCategory,
  setuser_id,
  setRecipeState,
} from "../../../Redux/recipeSlice";
import { RootState } from "../../../Redux/store";
import ProgressBar from "../../../Components/ProgressBar/ProgressBar";
import { MainIngredientsType, mainIngredients } from "../../../Types/types";
import {
  validateTitle,
  validateCategory,
  validateSecondaryCategory,
  validateMainCategory,
  validateSpecificIngredient,
} from "../../../utils/inputValidations";
import axios from "axios";

const RecipeTitle = () => {
  const navigate = useNavigate();
  const { recipeId } = useParams<{ recipeId: string }>();
  const user = useSelector((state: RootState) => state.auth.user);
  const dispatch = useDispatch();
  const recipeState = useSelector((state: RootState) => state.recipe);
  const [errorMessages, setErrorMessages] = useState({
    title: "",
    category: "",
    secondaryCategory: "",
    mainCategory: "",
    specificIngredient: "",
  });

  const [title, setTitleLocal] = useState(
    recipeState && recipeState.title ? recipeState.title : ""
  );
  const [category, setCategoryLocal] = useState(
    recipeState && recipeState.category ? recipeState.category : ""
  );
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    recipeState && recipeState.secondary_categories
      ? recipeState.secondary_categories
      : []
  );
  const [mainCategory, setMainCategory] = useState<
    keyof MainIngredientsType | ""
  >(
    recipeState && recipeState.main_ingredient_category
      ? (recipeState.main_ingredient_category as keyof MainIngredientsType)
      : ""
  );
  const [specificIngredient, setSpecificIngredient] = useState(
    recipeState && recipeState.main_ingredient
      ? recipeState.main_ingredient
      : ""
  );

  useEffect(() => {
    if (recipeId && !recipeState.title) {
      // Only fetch data if the recipe state is not already populated
      fetchRecipeData(recipeId);
    }
    console.log("Recipe State in RecipeTitle:", recipeState);
  }, [recipeId]);

  useEffect(() => {
    if (!mainCategory && specificIngredient) {
      const derivedMainCategory = Object.keys(mainIngredients).find(
        (category) =>
          mainIngredients[category as keyof MainIngredientsType].includes(
            specificIngredient
          )
      ) as keyof MainIngredientsType | "";
      setMainCategory(derivedMainCategory);
    }
  }, [specificIngredient, mainCategory]);

  const fetchRecipeData = async (id: string) => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/recipe/${id}`
      );
      dispatch(setRecipeState(response.data));
      setTitleLocal(response.data.title);
      setCategoryLocal(response.data.category);
      setSelectedCategories(response.data.secondary_categories || []);
      setMainCategory(response.data.main_ingredient_category || "");
      setSpecificIngredient(response.data.main_ingredient || "");
    } catch (error) {
      console.error("Error fetching recipe data:", error);
    }
  };

  const handleButtonClick = () => {
    const errors = {
      title: validateTitle(title),
      category: validateCategory(category),
      secondaryCategory: validateSecondaryCategory(selectedCategories),
      mainCategory: validateMainCategory(mainCategory),
      specificIngredient: validateSpecificIngredient(specificIngredient),
    };

    setErrorMessages(errors);

    const hasErrors = Object.values(errors).some(
      (errorMessage) => errorMessage !== ""
    );

    if (!hasErrors) {
      dispatch(setTitle(title));
      dispatch(setCategory(category));
      dispatch(setSecondaryCategories(selectedCategories));
      dispatch(setMainIngredient(specificIngredient));
      dispatch(setMainIngredientCategory(mainCategory));
      if (user && user.id !== undefined) {
        dispatch(setuser_id(user.id.toString()));
      }
      console.log("Updated Recipe State before navigation:", recipeState);
      navigate(
        recipeId
          ? `/edit-recipe/${recipeId}/recipe-ingredients`
          : "/create-recipe/recipe-ingredients"
      );
    }
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setTitleLocal(value);
    setErrorMessages((prev) => ({ ...prev, title: validateTitle(value) }));
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setCategoryLocal(value);
    setErrorMessages((prev) => ({
      ...prev,
      category: validateCategory(value),
    }));
  };

  const handleMainCategoryChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const value = e.target.value as keyof MainIngredientsType | "";
    setMainCategory(value);
    setSpecificIngredient(""); // Reset specific ingredient when main category changes
    setErrorMessages((prev) => ({
      ...prev,
      mainCategory: validateMainCategory(value),
      specificIngredient: "", // Reset specific ingredient error
    }));
  };

  const handleSpecificIngredientChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const value = e.target.value;
    setSpecificIngredient(value);
    setErrorMessages((prev) => ({
      ...prev,
      specificIngredient: validateSpecificIngredient(value),
    }));
  };

  const handleCategoryCheckbox = (category: string) => {
    setSelectedCategories((prev) => {
      if (prev.includes(category)) {
        return prev.filter((cat) => cat !== category);
      } else {
        return [...prev, category];
      }
    });
  };

  const handleBackToFrontPage = () => {
    navigate("/");
  };

  const categories = [
    "Alkupalat",
    "Pääruoat",
    "Jälkiruoat",
    "Juomat",
    "Keitot",
    "Pastat ja nuudelit",
    "Pizzat",
    "Makeat leivonnaiset",
    "Kastikkeet ja marinadit",
    "Välipalat",
    "Salaatit",
    "Leivät ja sämpylät",
    "Suolaiset leivonnaiset",
    "Lisukkeet",
    "Säilöntä",
    "Vauvan ruoka",
  ];

  const secondaryCategories = [
    "Ei erityisruokavaliota",
    "Gluteeniton",
    "Kasvisruoka",
    "Vegaaninen",
    "Maidoton",
    "Keto",
    "Vähähiilihydraattinen",
  ];

  const renderSecondaryCategories = () => (
    <div className="mb-4">
      <label className="block text-gray-700 mb-2">
        Mitä ruokavalioita tämä annos noudattaa? (Voit valita useita)
      </label>
      <div className="space-y-2">
        {secondaryCategories.map((category) => (
          <div key={category} className="flex items-center">
            <input
              type="checkbox"
              id={category}
              checked={selectedCategories.includes(category)}
              onChange={() => handleCategoryCheckbox(category)}
              className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
            />
            <label htmlFor={category} className="ml-2 text-gray-700">
              {category}
            </label>
          </div>
        ))}
      </div>
      {errorMessages.secondaryCategory && (
        <div className="text-red-500 text-xm text-center">
          {errorMessages.secondaryCategory}
        </div>
      )}
    </div>
  );

  return (
    <div className="flex items-center justify-center min-h-fit bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <ProgressBar currentStep={1} maxStep={4} />
        <p className="mb-4 text-2xl font-semibold text-gray-700">
          Aloitetaan sapuskan synnytys!
        </p>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="title">
            Anna herkkuluomuksellesi nimi
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={handleTitleChange}
            placeholder="Nimi reseptillesi"
            className="p-2 border border-gray-300 rounded w-full"
          />
          {errorMessages.title && (
            <div className="text-red-500 text-xm text-center">
              {errorMessages.title}
            </div>
          )}
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="category">
            Mihin ruokasarjaan tämä herkku istuu?
          </label>
          <select
            id="category"
            value={category}
            onChange={handleCategoryChange}
            className="p-2 border border-gray-300 rounded w-full"
          >
            <option value="" disabled>
              Valitse kategoria
            </option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          {errorMessages.category && (
            <div className="text-red-500 text-xm text-center">
              {errorMessages.category}
            </div>
          )}
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="mainCategory">
            Mikä on annoksen päätähti?
          </label>
          <select
            id="mainCategory"
            value={mainCategory}
            onChange={handleMainCategoryChange}
            className="p-2 border border-gray-300 rounded w-full"
          >
            <option value="" disabled>
              Valitse pääainesosa
            </option>
            {Object.keys(mainIngredients).map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          {errorMessages.mainCategory && (
            <div className="text-red-500 text-xm text-center">
              {errorMessages.mainCategory}
            </div>
          )}
        </div>
        {mainCategory && (
          <div className="mb-4">
            <label
              className="block text-gray-700 mb-2"
              htmlFor="specificIngredient"
            >
              Tarkenna ruoan tähtiaines
            </label>
            <select
              id="specificIngredient"
              value={specificIngredient}
              onChange={handleSpecificIngredientChange}
              className="p-2 border border-gray-300 rounded w-full"
            >
              <option value="" disabled>
                Valitse tarkempi ainesosa
              </option>
              {mainIngredients[mainCategory].map((ingredient: string) => (
                <option key={ingredient} value={ingredient}>
                  {ingredient}
                </option>
              ))}
            </select>
            {errorMessages.specificIngredient && (
              <div className="text-red-500 text-xm text-center">
                {errorMessages.specificIngredient}
              </div>
            )}
          </div>
        )}
        {renderSecondaryCategories()}
        <div className="flex justify-between">
          <button
            onClick={handleBackToFrontPage}
            className="bg-red-500 hover:bg-red-600 text-white rounded flex-1 mr-2"
          >
            Takaisin etusivulle
          </button>
          <button
            onClick={handleButtonClick}
            className="bg-green-500 hover:bg-green-600 text-white p-2 rounded flex-1 ml-2"
          >
            Mennäänpäs eteenpäin!
          </button>
        </div>
      </div>
    </div>
  );
};

export default RecipeTitle;
