import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import {
  setTitle,
  setCategory,
  setsecondary_category,
  setuser_id,
} from "../../../Redux/recipeSlice";
import { RootState } from "../../../Redux/store";

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
    <div>
      <p>Title sivu</p>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitleLocal(e.target.value)}
        placeholder="Title"
      />
      <select
        value={category}
        onChange={(e) => setCategoryLocal(e.target.value)}
      >
        <option value="" disabled>
          Select Category
        </option>
        {categories.map((cat) => (
          <option key={cat} value={cat}>
            {cat}
          </option>
        ))}
      </select>
      <select
        value={secondary_category}
        onChange={(e) => setsecondary_categoryLocal(e.target.value)}
      >
        {secondaryCategories.map((secCat) => (
          <option key={secCat} value={secCat}>
            {secCat}
          </option>
        ))}
      </select>
      <button onClick={handleButtonClick}>Next</button>
    </div>
  );
};

export default RecipeTitle;
