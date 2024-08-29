import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../Redux/store";
import IngredientSearch from "../../../Components/IngredientSearch/IngredientSearch";
import { setIngredients, setInstructions } from "../../../Redux/recipeSlice";
import { Ingredient } from "../../../Types/types";
import { v4 as uuidv4 } from "uuid";
import ProgressBar from "../../../Components/ProgressBar/ProgressBar";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  validateQuantity,
  validateUnit,
  validateIngredientName,
  validateInstructions,
  SPECIAL_CHAR_ERROR,
  INGREDIENT_NUMBER_ERROR,
} from "../../../utils/inputValidations";

const RecipeIngredients = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const recipeState = useSelector((state: RootState) => state.recipe);
  const [ingredients, setLocalIngredients] = useState<Ingredient[]>([]);
  const [instructions, setInstructionsLocal] = useState("");
  const [errorMessages, setErrorMessages] = useState({
    ingredients: [] as string[],
    instructions: "",
  });

  useEffect(() => {
    if (recipeState.ingredients.length === 0) {
      setLocalIngredients([
        { id: uuidv4(), quantity: "", unit: "", name: "" },
        { id: uuidv4(), quantity: "", unit: "", name: "" },
        { id: uuidv4(), quantity: "", unit: "", name: "" },
      ]);
    } else {
      setLocalIngredients(recipeState.ingredients);
    }
    setInstructionsLocal(recipeState.instructions);
  }, [recipeState]);

  const handleButtonClick = () => {
    const ingredientErrors = ingredients.map((ingredient) => {
      return (
        validateQuantity(ingredient.quantity) ||
        validateUnit(ingredient.unit) ||
        validateIngredientName(ingredient.name)
      );
    });
    const instructionsError = validateInstructions(instructions);

    setErrorMessages({
      ingredients: ingredientErrors,
      instructions: instructionsError,
    });

    const hasErrors =
      ingredientErrors.some((error) => error !== "") ||
      instructionsError !== "";

    if (!hasErrors) {
      const ingredientsForAction = ingredients.map(
        ({ id, quantity, unit, name }) => ({ id, quantity, unit, name })
      );
      dispatch(setIngredients(ingredientsForAction));
      dispatch(setInstructions(instructions));
      navigate("/create-recipe/recipe-picture");
    }
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

  const handleBackButton = () => {
    navigate("/create-recipe/recipe-title");
  };

  const handleQuantityChange = (index: number, value: string) => {
    const newIngredients = ingredients.map((ingredient, idx) => {
      if (idx === index) {
        return { ...ingredient, quantity: value };
      }
      return ingredient;
    });
    setLocalIngredients(newIngredients);
    setErrorMessages((prev) => {
      const newErrors = [...prev.ingredients];
      newErrors[index] = validateQuantity(value);
      return { ...prev, ingredients: newErrors };
    });
  };

  const handleUnitChange = (index: number, value: string) => {
    const newIngredients = ingredients.map((ingredient, idx) => {
      if (idx === index) {
        return { ...ingredient, unit: value };
      }
      return ingredient;
    });
    setLocalIngredients(newIngredients);
    setErrorMessages((prev) => {
      const newErrors = [...prev.ingredients];
      newErrors[index] = validateUnit(value);
      return { ...prev, ingredients: newErrors };
    });
  };

  const handleIngredientNameChange = (index: number, value: string) => {
    const formattedName = formatIngredientName(value);
    const newIngredients = ingredients.map((ingredient, idx) => {
      if (idx === index) {
        return { ...ingredient, name: formattedName };
      }
      return ingredient;
    });
    setLocalIngredients(newIngredients);
    setErrorMessages((prev) => {
      const newErrors = [...prev.ingredients];
      newErrors[index] = validateIngredientName(formattedName);
      return { ...prev, ingredients: newErrors };
    });
  };

  const handleInstructionsChange = (value: string) => {
    setInstructionsLocal(value);
    setErrorMessages((prev) => ({
      ...prev,
      instructions: validateInstructions(value),
    }));
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-3 rounded shadow-md w-full max-w-4xl">
        <ProgressBar currentStep={2} maxStep={4} />
        <p className="text-xl font-bold mb-4">Mitä sapuskaan tarvitaan?</p>
        {ingredients.map((ingredient, index) => (
          <div
            key={ingredient.id}
            className="mb-4 p-4 border rounded-lg bg-white shadow"
          >
            <div className="flex flex-wrap gap-4 items-center">
              <input
                type="text"
                placeholder="Paljon?"
                value={ingredient.quantity}
                onChange={(e) => handleQuantityChange(index, e.target.value)}
                className="border p-2 rounded w-2/12"
              />
              <select
                value={ingredient.unit}
                onChange={(e) => handleUnitChange(index, e.target.value)}
                className="border p-2 rounded w-4/12"
              >
                <option value="">Millä mitalla mennään?</option>
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
              <div className="flex-1">
                <IngredientSearch
                  initialValue={ingredient.name}
                  onIngredientSelect={(name) => {
                    updateIngredientName(index, name);
                  }}
                  onChange={(e) =>
                    handleIngredientNameChange(index, e.target.value)
                  }
                />
              </div>
              <button
                onClick={() => handleRemove(ingredient.id)}
                className="text-red-500 hover:text-red-600 transition-colors duration-200"
              >
                <FontAwesomeIcon icon={faTrash} />
              </button>
            </div>
            {errorMessages.ingredients[index] && (
              <div className="text-red-500 text-xm text-center">
                {errorMessages.ingredients[index]}
              </div>
            )}
          </div>
        ))}
        <div className="flex justify-center">
          <button
            onClick={handleAddMore}
            className="bg-blue-500 text-white p-2 rounded mb-4"
          >
            Lisää uusi raaka-aine
          </button>
        </div>
        <textarea
          value={instructions}
          onChange={(e) => handleInstructionsChange(e.target.value)}
          placeholder="Kuinka sapuska syntyy?"
          className="border p-2 rounded w-full mb-4"
        />
        {errorMessages.instructions && (
          <div className="text-red-500 text-xm text-center">
            {errorMessages.instructions}
          </div>
        )}
        <div className="flex justify-between">
          <button
            onClick={handleBackButton}
            className="bg-red-500 text-white rounded flex-1 mx-2"
          >
            Askel taaksepäin!
          </button>
          <button
            onClick={handleButtonClick}
            className="bg-green-500 text-white p-2 rounded flex-1 mx-2"
          >
            Mennäänpäs eteenpäin!
          </button>
        </div>
      </div>
    </div>
  );
};

export default RecipeIngredients;
