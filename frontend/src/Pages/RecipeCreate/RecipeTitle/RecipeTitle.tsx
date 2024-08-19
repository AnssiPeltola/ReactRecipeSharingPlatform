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

const RecipeTitle = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const recipeState = useSelector((state: RootState) => state.recipe);

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
    dispatch(setTitle(title));
    dispatch(setCategory(category));
    dispatch(setsecondary_category(secondary_category));
    dispatch(setMainIngredient(specificIngredient));
    dispatch(setMainIngredientCategory(mainCategory));
    console.log(recipeState);
    navigate("/create-recipe/recipe-ingredients");
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
    "-",
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
          Otsikko sivu
        </p>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitleLocal(e.target.value)}
          placeholder="Otsikko"
          className="mb-4 p-2 border border-gray-300 rounded w-full"
        />
        <select
          value={category}
          onChange={(e) => setCategoryLocal(e.target.value)}
          className="mb-4 p-2 border border-gray-300 rounded w-full"
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
        <select
          value={mainCategory}
          onChange={(e) =>
            setMainCategory(e.target.value as keyof MainIngredientsType)
          }
          className="mb-4 p-2 border border-gray-300 rounded w-full"
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
        {mainCategory && (
          <select
            value={specificIngredient}
            onChange={(e) => setSpecificIngredient(e.target.value)}
            className="mb-4 p-2 border border-gray-300 rounded w-full"
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
        )}
        <select
          value={secondary_category}
          onChange={(e) => setsecondary_categoryLocal(e.target.value)}
          className="mb-4 p-2 border border-gray-300 rounded w-full"
        >
          {secondaryCategories.map((secCat) => (
            <option key={secCat} value={secCat}>
              {secCat}
            </option>
          ))}
        </select>

        <button
          onClick={handleButtonClick}
          className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-700 w-full"
        >
          Seuraava
        </button>
      </div>
    </div>
  );
};

export default RecipeTitle;
