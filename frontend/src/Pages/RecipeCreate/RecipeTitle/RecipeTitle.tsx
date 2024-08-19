import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import {
  setTitle,
  setCategory,
  setsecondary_category,
  setMainIngredient,
  setMainIngredientCategory,
  setuser_id,
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
} from "./inputValidations";

const RecipeTitle = () => {
  const navigate = useNavigate();
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
  const [secondary_category, setsecondary_categoryLocal] = useState(
    recipeState && recipeState.secondary_category
      ? recipeState.secondary_category
      : ""
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
    const token = localStorage.getItem("sessionToken");
    if (token) {
      axios
        .get(`${process.env.REACT_APP_API_BASE_URL}/getUserDetails`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          const user_id = response.data.id;
          dispatch(setuser_id(user_id));
        })
        .catch((error) => {
          console.error("Error fetching user details", error);
        });
    }
  }, [dispatch]);

  const handleButtonClick = () => {
    const errors = {
      title: validateTitle(title),
      category: validateCategory(category),
      secondaryCategory: validateSecondaryCategory(secondary_category),
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
      dispatch(setsecondary_category(secondary_category));
      dispatch(setMainIngredient(specificIngredient));
      dispatch(setMainIngredientCategory(mainCategory));
      console.log(recipeState);
      navigate("/create-recipe/recipe-ingredients");
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
    setErrorMessages((prev) => ({
      ...prev,
      mainCategory: validateMainCategory(value),
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

  const handleSecondaryCategoryChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const value = e.target.value;
    setsecondary_categoryLocal(value);
    setErrorMessages((prev) => ({
      ...prev,
      secondaryCategory: validateSecondaryCategory(value),
    }));
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

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
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
        <div className="mb-4">
          <label
            className="block text-gray-700 mb-2"
            htmlFor="secondaryCategory"
          >
            Noudattaako tämä annos dieettiä?
          </label>
          <select
            id="secondaryCategory"
            value={secondary_category}
            onChange={handleSecondaryCategoryChange}
            className="p-2 border border-gray-300 rounded w-full"
          >
            <option value="" disabled>
              Valitse ruokavalio
            </option>
            {secondaryCategories.map((secCat) => (
              <option key={secCat} value={secCat}>
                {secCat}
              </option>
            ))}
          </select>
          {errorMessages.secondaryCategory && (
            <div className="text-red-500 text-xm text-center">
              {errorMessages.secondaryCategory}
            </div>
          )}
        </div>
        <button
          onClick={handleButtonClick}
          className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-700 w-full"
        >
          Mennäänpäs eteenpäin!
        </button>
      </div>
    </div>
  );
};

export default RecipeTitle;
