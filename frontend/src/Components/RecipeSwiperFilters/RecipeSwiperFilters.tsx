import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../Redux/store";
import {
  setFilters,
  clearRecipes,
} from "../../Redux/Reducers/recipeSwiperSlice";
import { fetchMoreRecipes } from "../../Redux/Actions/recipeSwiperActions";
import { mainIngredients } from "../../Types/types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronUp, faChevronDown } from "@fortawesome/free-solid-svg-icons";

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

const RecipeSwiperFilters: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const filters = useSelector((state: RootState) => state.recipeSwiper.filters);
  const [mainCategory, setMainCategory] = useState<
    keyof typeof mainIngredients | ""
  >("");
  const [specificIngredient, setSpecificIngredient] = useState<string>("");
  const [isVisible, setIsVisible] = useState<boolean>(true);

  const handleFilterChange = (
    type: "category" | "mainIngredient" | "secondaryCategories",
    value: string | string[]
  ) => {
    const newFilters = {
      ...filters,
      [type]: value,
    };

    dispatch(setFilters(newFilters));
    dispatch(clearRecipes());
    dispatch(fetchMoreRecipes());
  };

  const handleMainCategoryChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const value = e.target.value as keyof typeof mainIngredients | "";
    setMainCategory(value);
    setSpecificIngredient("");
  };

  const handleSpecificIngredientChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const value = e.target.value;
    setSpecificIngredient(value);
    if (value) {
      handleFilterChange("mainIngredient", value);
    }
  };

  // Add this useEffect to sync the UI with filter changes
  useEffect(() => {
    if (filters.mainIngredient) {
      // Find the main category for this ingredient
      const category = Object.keys(mainIngredients).find((cat) =>
        mainIngredients[cat as keyof typeof mainIngredients].includes(
          filters.mainIngredient || "" // Provide default empty string if undefined
        )
      ) as keyof typeof mainIngredients;

      setMainCategory(category);
      setSpecificIngredient(filters.mainIngredient);
    }
  }, [filters.mainIngredient]);

  return (
    <div className="relative">
      {isVisible ? (
        <div className="bg-white p-4 rounded-lg shadow mb-4 border border-gray-300">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Suodata reseptejä</h3>
            <button
              onClick={() => {
                setMainCategory("");
                setSpecificIngredient("");
                dispatch(setFilters({}));
                dispatch(clearRecipes());
                dispatch(fetchMoreRecipes());
              }}
              className="px-3 py-1 text-sm bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
            >
              Tyhjennä suodattimet
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
            {/* Category filter */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Ruokalaji
              </label>
              <select
                value={filters.category || ""}
                onChange={(e) => handleFilterChange("category", e.target.value)}
                className="w-full p-2 text-sm border border-gray-300 rounded bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              >
                <option value="">Kaikki ruokalajit</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            {/* Main ingredient selection */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Pääraaka-aineryhmä
              </label>
              <select
                id="mainCategory"
                value={mainCategory}
                onChange={handleMainCategoryChange}
                className="w-full p-2 text-sm border border-gray-300 rounded bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              >
                <option value="">Kaikki ryhmät</option>
                {Object.keys(mainIngredients).map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Specific ingredient selection */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Tarkenna raaka-aine
              </label>
              <select
                id="specificIngredient"
                value={specificIngredient}
                onChange={handleSpecificIngredientChange}
                disabled={!mainCategory}
                className="w-full p-2 text-sm border border-gray-300 rounded bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 disabled:bg-gray-100 disabled:text-gray-500"
              >
                <option value="">
                  {mainCategory ? "Valitse raaka-aine" : "Valitse ensin ryhmä"}
                </option>
                {mainIngredients[
                  mainCategory as keyof typeof mainIngredients
                ]?.map((ingredient: string) => (
                  <option key={ingredient} value={ingredient}>
                    {ingredient}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Secondary categories below */}
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-600 mb-2">
              Erityisruokavaliot
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 border border-gray-300 rounded p-3">
              {secondaryCategories.map((category) => (
                <label key={category} className="flex items-center text-sm">
                  <input
                    type="checkbox"
                    checked={
                      filters.secondaryCategories?.includes(category) || false
                    }
                    onChange={(e) => {
                      const current = filters.secondaryCategories || [];
                      const newValue = e.target.checked
                        ? [...current, category]
                        : current.filter((c) => c !== category);
                      handleFilterChange("secondaryCategories", newValue);
                    }}
                    className="mr-2"
                  />
                  <span className="text-gray-700">{category}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex justify-center mt-4 relative">
            <button
              onClick={() => setIsVisible(false)}
              className="w-10 h-10 flex items-center justify-center bg-gray-200 text-gray-700 rounded-full hover:bg-gray-300 absolute"
              style={{
                bottom: "-35px",
                left: "50%",
                transform: "translateX(-50%)",
              }}
            >
              <FontAwesomeIcon icon={faChevronUp} />
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-white p-4 rounded-lg shadow mb-4 border border-gray-300 relative">
          <div className="flex flex-col items-center">
            <span className="mb-2">Näytä suodattimet</span>
          </div>
          <button
            onClick={() => setIsVisible(true)}
            className="w-10 h-10 flex items-center justify-center bg-gray-200 text-gray-700 rounded-full hover:bg-gray-300 absolute"
            style={{
              bottom: "-20px",
              left: "50%",
              transform: "translateX(-50%)",
            }}
          >
            <FontAwesomeIcon icon={faChevronDown} />
          </button>
        </div>
      )}
    </div>
  );
};

export default RecipeSwiperFilters;
