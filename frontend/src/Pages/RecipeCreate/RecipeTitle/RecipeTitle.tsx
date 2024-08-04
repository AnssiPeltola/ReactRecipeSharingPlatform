import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import {
  setTitle,
  setCategory,
  setSecondaryCategory,
  setUserId,
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
  const [secondaryCategory, setSecondaryCategoryLocal] = useState(
    recipeState && recipeState.secondaryCategory
      ? recipeState.secondaryCategory
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
          const userId = response.data.id;
          dispatch(setUserId(userId));
        })
        .catch((error) => {
          console.error("Error fetching user details", error);
        });
    }
  }, [dispatch]);

  const handleButtonClick = () => {
    dispatch(setTitle(title));
    dispatch(setCategory(category));
    dispatch(setSecondaryCategory(secondaryCategory));
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
        value={secondaryCategory}
        onChange={(e) => setSecondaryCategoryLocal(e.target.value)}
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
