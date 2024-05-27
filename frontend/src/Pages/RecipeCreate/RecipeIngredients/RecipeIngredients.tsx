import React from 'react';
import { useNavigate } from 'react-router-dom';

const RecipeIngredients = () => {
  const navigate = useNavigate();

  const handleButtonClick = () => {
    navigate('/create-recipe/recipe-picture');
  };

  return (
    <div>
      <p>Raaka-aine sivu</p>
      <button onClick={handleButtonClick}>Next</button>
    </div>
  );
};

export default RecipeIngredients;