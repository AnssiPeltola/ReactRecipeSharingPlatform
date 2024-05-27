import React from 'react';
import { useNavigate } from 'react-router-dom';

const RecipeTitle = () => {
  const navigate = useNavigate();

  const handleButtonClick = () => {
    navigate('/create-recipe/recipe-ingredients');
  };

  return (
    <div>
      <p>Title sivu</p>
      <button onClick={handleButtonClick}>Next</button>
    </div>
  );
};

export default RecipeTitle;