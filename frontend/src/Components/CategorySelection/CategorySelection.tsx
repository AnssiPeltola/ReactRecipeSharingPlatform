import React from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { SEARCH_RESULTS } from "../../Constants/routes";

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
  "Gluteeniton",
  "Kasvisruoka",
  "Vegaaninen",
  "Maidoton",
  "Keto",
  "Vähähiilihydraattinen",
];

const CategorySelection = () => {
  const navigate = useNavigate();

  const handleCategoryClick = async (category: string) => {
    try {
      const response = await axios.get(
        `${
          process.env.REACT_APP_API_BASE_URL
        }/search?query=${encodeURIComponent(category)}`
      );
      navigate(SEARCH_RESULTS, { state: { recipes: response.data } });
    } catch (error) {
      console.error("Error fetching recipes:", error);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Etsi kategorian mukaan</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {[...categories, ...secondaryCategories].map((category) => (
          <button
            key={category}
            onClick={() => handleCategoryClick(category)}
            className="bg-blue-500 text-white rounded p-2 hover:bg-blue-700 focus:outline-none"
          >
            {category}
          </button>
        ))}
      </div>
    </div>
  );
};

export default CategorySelection;
