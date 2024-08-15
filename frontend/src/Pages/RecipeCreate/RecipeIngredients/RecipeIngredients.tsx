import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../Redux/store";
import IngredientSearch from "../../../Components/IngredientSearch/IngredientSearch";
import { setIngredients, setInstructions } from "../../../Redux/recipeSlice";
import { Ingredient } from "../../../Types/types";
import { v4 as uuidv4 } from "uuid";
import ProgressBar from "../../../Components/ProgressBar/ProgressBar";

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

  const updateIngredientName = (ingredientIndex: number, newName: string) => {
    const formattedName = formatIngredientName(newName);
    const newIngredients = ingredients.map((ingredient, idx) => {
      if (idx === ingredientIndex) {
        return { ...ingredient, name: formattedName };
      }
      return ingredient;
    });
    setLocalIngredients(newIngredients);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <ProgressBar currentStep={2} maxStep={4} />
        <p className="text-xl font-bold mb-4">Raaka-aine sivu</p>
        {ingredients.map((ingredient, index) => (
          <div
            key={ingredient.id}
            className="mb-4 p-4 border rounded-lg bg-white shadow"
          >
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
              className="border p-2 rounded w-full mb-2"
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
              className="border p-2 rounded w-full mb-2"
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
                updateIngredientName(index, name);
              }}
              onChange={(e) => {
                const name = e.target.value;
                updateIngredientName(index, name);
              }}
            />
            <button
              onClick={() => handleRemove(ingredient.id)}
              className="bg-red-500 text-white p-2 rounded mt-2"
            >
              Remove
            </button>
          </div>
        ))}
        <button
          onClick={handleAddMore}
          className="bg-blue-500 text-white p-2 rounded mb-4"
        >
          Lisää uusi raaka-aine
        </button>
        <textarea
          value={instructions}
          onChange={(e) => setInstructionsLocal(e.target.value)}
          placeholder="Instructions"
          className="border p-2 rounded w-full mb-4"
        />
        <button
          onClick={handleButtonClick}
          className="bg-green-500 text-white p-2 rounded"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default RecipeIngredients;
