import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setTitle, setCategory } from '../../../Redux/recipeSlice';
import { RootState } from '../../../Redux/store';

const RecipeTitle = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const recipeState = useSelector((state: RootState) => state.recipe);

  const [title, setTitleLocal] = useState(recipeState && recipeState.title ? recipeState.title : '');
  const [category, setCategoryLocal] = useState(recipeState && recipeState.category ? recipeState.category : '');

  const handleButtonClick = () => {
    dispatch(setTitle(title));
    dispatch(setCategory(category));
    console.log(recipeState);
    navigate('/create-recipe/recipe-ingredients');
  };

  return (
    <div>
      <p>Title sivu</p>
      <input type="text" value={title} onChange={(e) => setTitleLocal(e.target.value)} placeholder="Title" />
      <input type="text" value={category} onChange={(e) => setCategoryLocal(e.target.value)} placeholder="Category" />
      <button onClick={handleButtonClick}>Next</button>
    </div>
  );
};

export default RecipeTitle;