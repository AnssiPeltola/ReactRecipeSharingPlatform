import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../Redux/store";
import IngredientSearch from "../../../Components/IngredientSearch/IngredientSearch";
import { setIngredients, setInstructions } from "../../../Redux/recipeSlice";
import { Ingredient } from "../../../Types/types";
import { v4 as uuidv4 } from "uuid";

const RecipeIngredients = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const recipeState = useSelector((state: RootState) => state.recipe);
  const [ingredients, setLocalIngredients] = useState<Ingredient[]>([]);
  const [instructions, setInstructionsLocal] = useState("");

  useEffect(() => {
    if (recipeState.ingredients.length === 0) {
      setLocalIngredients([{ id: uuidv4(), quantity: "", unit: "", name: "" }]);
    } else {
      setLocalIngredients(recipeState.ingredients);
    }
    setInstructionsLocal(recipeState.instructions);
  }, []);

  const handleButtonClick = () => {
    const ingredientsForAction = ingredients.map(
      ({ id, quantity, unit, name }) => ({ id, quantity, unit, name })
    );
    dispatch(setIngredients(ingredientsForAction));
    dispatch(setInstructions(instructions));
    navigate("/create-recipe/recipe-picture");
  };

  const handleAddMore = () => {
    setLocalIngredients([
      ...ingredients,
      { id: uuidv4(), quantity: "", unit: "", name: "" },
    ]);
  };

  const handleRemove = (id: string) => {
    setLocalIngredients((prevIngredients) => {
      return prevIngredients.filter((ingredient) => ingredient.id !== id);
    });
  };

  const formatIngredientName = (name: string) => {
    return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
  };

  // Function to update ingredient name in local state
  const updateIngredientName = (ingredientIndex: number, newName: string) => {
    const formattedName = formatIngredientName(newName); // Use the helper function
    const newIngredients = ingredients.map((ingredient, idx) => {
      if (idx === ingredientIndex) {
        return { ...ingredient, name: formattedName };
      }
      return ingredient;
    });
    setLocalIngredients(newIngredients);
  };

  return (
    <div>
      <p>Raaka-aine sivu</p>
      {ingredients.map((ingredient, index) => (
        <div key={ingredient.id}>
          <input
            type="text"
            placeholder="Quantity"
            value={ingredient.quantity}
            onChange={(e) => {
              const newIngredients = ingredients.map((ing, idx) => {
                if (idx === index) {
                  return { ...ing, quantity: e.target.value };
                }
                return ing;
              });
              setLocalIngredients(newIngredients);
            }}
          />
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
            <option value="g">g (gramma)</option>
            <option value="kg">kg (kilogramma)</option>
            <option value="ml">ml (millilitra)</option>
            <option value="dl">dl (desilitra)</option>
            <option value="l">l (litra)</option>
            <option value="rkl">rkl (ruokalusikallinen)</option>
            <option value="tl">tl (teelusikallinen)</option>
            <option value="kpl">kpl (kappale)</option>
            <option value="pkt">pkt (paketti)</option>
            <option value="tlk">tlk (tölkki)</option>
            <option value="prk">prk (purkki)</option>
          </select>
          <IngredientSearch
            initialValue={ingredient.name}
            onIngredientSelect={(name) => {
              // This handles selection from search results
              updateIngredientName(index, name);
            }}
            onChange={(e) => {
              // This handles manual input
              const name = e.target.value;
              updateIngredientName(index, name);
            }}
          />
          <button onClick={() => handleRemove(ingredient.id)}>Remove</button>
        </div>
      ))}
      <button onClick={handleAddMore}>Lisää uusi raaka-aine</button>
      <textarea
        value={instructions}
        onChange={(e) => setInstructionsLocal(e.target.value)}
        placeholder="Instructions"
      />
      <button onClick={handleButtonClick}>Next</button>
    </div>
  );
};

export default RecipeIngredients;
