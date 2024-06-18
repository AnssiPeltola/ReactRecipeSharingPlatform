import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { setTitle, setCategory, setUserId } from "../../../Redux/recipeSlice"; // Import setUserId action
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

  useEffect(() => {
    const token = localStorage.getItem("sessionToken");
    if (token) {
      axios
        .get(`${process.env.REACT_APP_API_BASE_URL}/getUserDetails`, {
          // Use template literals to include the environment variable
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          const userId = response.data.id; // Assuming the response contains the user ID
          dispatch(setUserId(userId)); // Dispatch the user ID to the Redux store
        })
        .catch((error) => {
          console.error("Error fetching user details", error);
        });
    }
  }, [dispatch]);

  const handleButtonClick = () => {
    dispatch(setTitle(title));
    dispatch(setCategory(category));
    console.log(recipeState);
    navigate("/create-recipe/recipe-ingredients");
  };

  return (
    <div>
      <p>Title sivu</p>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitleLocal(e.target.value)}
        placeholder="Title"
      />
      <input
        type="text"
        value={category}
        onChange={(e) => setCategoryLocal(e.target.value)}
        placeholder="Category"
      />
      <button onClick={handleButtonClick}>Next</button>
    </div>
  );
};

export default RecipeTitle;
