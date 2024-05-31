import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../Redux/store';
import IngredientSearch from '../../../Components/IngredientSearch/IngredientSearch';
import { setIngredients } from '../../../Redux/recipeSlice';
import { Ingredient } from '../../../Types/types';

const RecipeIngredients = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const recipeState = useSelector((state: RootState) => state.recipe);
  const [ingredients, setLocalIngredients] = useState<Ingredient[]>([{ quantity: '', unit: '', name: '' }]);

  const handleButtonClick = () => {
    const ingredientsForAction = ingredients.map(({ quantity, unit, name }) => ({ quantity, unit, name }));
    dispatch(setIngredients(ingredientsForAction));
    navigate('/create-recipe/recipe-picture');
  };

  const handleAddMore = () => {
    setLocalIngredients([...ingredients, { quantity: '', unit: '', name: '' }]);
  };

  const handleRemove = (index: number) => {
    const newIngredients = [...ingredients];
    newIngredients.splice(index, 1);
    setLocalIngredients(newIngredients);
  };

  return (
    <div>
      <p>Raaka-aine sivu</p>
      {ingredients.map((ingredient, index) => (
        <div key={index}>
          <input type="text" placeholder="Quantity" value={ingredient.quantity} onChange={(e) => {
            const newIngredients = [...ingredients];
            newIngredients[index].quantity = e.target.value;
            setLocalIngredients(newIngredients);
          }} />

          <select value={ingredient.unit} onChange={(e) => {
            const newIngredients = [...ingredients];
            newIngredients[index].unit = e.target.value;
            setLocalIngredients(newIngredients);
          }}>
            <option value="dl">dl</option>
            <option value="tl">tl</option>
            <option value="kpl">kpl</option>
          </select>
          <IngredientSearch onIngredientSelect={(name) => {
            const newIngredients = [...ingredients];
            newIngredients[index].name = name ? name : '';
            setLocalIngredients(newIngredients);
          }} />
          <button onClick={() => handleRemove(index)}>Poista</button>
        </div>
      ))}
      <button onClick={handleAddMore}>Lisää uusi raaka-aine</button>
      <button onClick={handleButtonClick}>Next</button>
    </div>
  );
};

export default RecipeIngredients;