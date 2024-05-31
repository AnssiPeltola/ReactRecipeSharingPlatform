import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../Redux/store';

const RecipePicture = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const recipeState = useSelector((state: RootState) => state.recipe);

  const handleButtonClick = () => {
    navigate('/create-recipe/recipe-overview');
  };

  console.log(recipeState);

  return (
    <div>
      <p>Kuva sivu</p>
      <button onClick={handleButtonClick}>Next</button>
    </div>
  );
};

export default RecipePicture;