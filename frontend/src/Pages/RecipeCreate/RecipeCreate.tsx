import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, useNavigate } from 'react-router-dom';
import axios from 'axios';
import RecipeTitle from './RecipeTitle/RecipeTitle';
import RecipeIngredients from './RecipeIngredients/RecipeIngredients';
import RecipePicture from './RecipePicture/RecipePicture';
import RecipeOverview from './RecipeOverview/RecipeOverview';
import RecipeCreated from './RecipeCreated/RecipeCreated';

const CreateRecipe = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('sessionToken');
    
    if (!token) {
      setIsLoggedIn(false);
      return;
    }
  
    axios.get('/checkAuthentication', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(_response => {
        setIsLoggedIn(true);
      })
      .catch(_error => {
        setIsLoggedIn(false);
      });
  }, []);

  if (!isLoggedIn) {
    return (
      <div>
        <p>Sinun on kirjauduttava sisään luodaksesi reseptin.</p>
        <button onClick={() => navigate('/')}>Siirry etusivulle!</button>
      </div>
    );
  }

  return (
    <div>
      <Routes>
        <Route path="/" element={<Navigate to="recipe-title" />} />
        <Route path="recipe-title" element={<RecipeTitle />} />
        <Route path="recipe-ingredients" element={<RecipeIngredients />} />
        <Route path="recipe-picture" element={<RecipePicture />} />
        <Route path="recipe-overview" element={<RecipeOverview />} />
        <Route path="recipe-created" element={<RecipeCreated />} />
      </Routes>
    </div>
  );
};

export default CreateRecipe;