import React from 'react';
import { useNavigate } from 'react-router-dom';

const RecipeOverview = () => {
  const navigate = useNavigate();

  const handleButtonClick = () => {
    navigate('/create-recipe/recipe-created');
  };

  return (
    <div>
      <p>Katsaus sivu</p>
      <button onClick={handleButtonClick}>Next</button>
    </div>
  );
};

export default RecipeOverview;