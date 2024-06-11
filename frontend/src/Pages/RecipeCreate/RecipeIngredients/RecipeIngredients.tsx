import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../Redux/store';
import IngredientSearch from '../../../Components/IngredientSearch/IngredientSearch';
import { setIngredients, setInstructions } from '../../../Redux/recipeSlice';
import { Ingredient } from '../../../Types/types';

const RecipeIngredients = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const recipeState = useSelector((state: RootState) => state.recipe);
  const [ingredients, setLocalIngredients] = useState<Ingredient[]>([]);
  const [instructions, setInstructionsLocal] = useState('');

  useEffect(() => {
    if (recipeState.ingredients.length === 0) {
      setLocalIngredients([{ quantity: '', unit: '', name: '' }]);
    } else {
      setLocalIngredients(recipeState.ingredients);
    }
    setInstructionsLocal(recipeState.instructions);
  }, []);

  const handleButtonClick = () => {
    const ingredientsForAction = ingredients.map(({ quantity, unit, name }) => ({ quantity, unit, name }));
    dispatch(setIngredients(ingredientsForAction));
    dispatch(setInstructions(instructions));
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
            const newIngredients = ingredients.map((ing, idx) => {
              if (idx === index) {
                return { ...ing, quantity: e.target.value };
              }
            return ing;
            });
          setLocalIngredients(newIngredients);}} />
          <select 
            value={ingredient.unit} 
            onChange={(e) => {
              const newIngredients = ingredients.map((ing, idx) => {
                if (idx === index) {
                  return { ...ing, unit: e.target.value };
                }
                return ing;
              });
              setLocalIngredients(newIngredients);
            }}
          >
            <option value="">Select unit</option>
            <option value="dl">dl</option>
            <option value="tl">tl</option>
            <option value="kpl">kpl</option>
          </select>
          <IngredientSearch 
            initialValue={ingredient.name} 
            onIngredientSelect={(name) => {
              const newIngredients = ingredients.map((ing, idx) => {
                if (idx === index) {
                  return { ...ing, name: name ? name : '' };
                }
                return ing;
              });
              setLocalIngredients(newIngredients);
            }} />
          <button onClick={() => handleRemove(index)}>Poista</button>
        </div>
      ))}
      <button onClick={handleAddMore}>Lisää uusi raaka-aine</button>
      <textarea value={instructions} onChange={(e) => setInstructionsLocal(e.target.value)} placeholder="Instructions" />
      <button onClick={handleButtonClick}>Next</button>
    </div>
  );
};

export default RecipeIngredients;