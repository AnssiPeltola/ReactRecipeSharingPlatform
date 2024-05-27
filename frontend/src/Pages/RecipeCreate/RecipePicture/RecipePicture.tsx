import React from 'react';
import { useNavigate } from 'react-router-dom';

const RecipePicture = () => {
  const navigate = useNavigate();

  const handleButtonClick = () => {
    navigate('/create-recipe/recipe-overview');
  };

  return (
    <div>
      <p>Kuva sivu</p>
      <button onClick={handleButtonClick}>Next</button>
    </div>
  );
};

export default RecipePicture;