import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../Redux/store";
import IngredientSearch from "../../../Components/IngredientSearch/IngredientSearch";
import { setIngredients, setInstructions } from "../../../Redux/recipeSlice";
import { Ingredient } from "../../../Types/types";
import { v4 as uuidv4 } from "uuid";
import ProgressBar from "../../../Components/ProgressBar/ProgressBar";
import {
  faTrash,
  faCaretUp,
  faCaretDown,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  validateQuantity,
  validateUnit,
  validateIngredientName,
  validateInstructions,
  validateStep,
} from "../../../utils/inputValidations";

const RecipeIngredients = () => {
  const navigate = useNavigate();
  const { recipeId } = useParams<{ recipeId: string }>(); // Get recipeId from URL
  const dispatch = useDispatch();
  const recipeState = useSelector((state: RootState) => state.recipe);
  const [ingredients, setLocalIngredients] = useState<Ingredient[]>([]);
  const [steps, setSteps] = useState<string[]>(
    recipeState.instructions ? recipeState.instructions.split("\n") : [""]
  );
  const [errorMessages, setErrorMessages] = useState({
    ingredients: [] as string[],
    instructions: "",
    steps: [] as string[],
  });
  const charLimit = 1000;

  useEffect(() => {
    if (recipeState.ingredients.length === 0) {
      setLocalIngredients([
        { id: uuidv4(), quantity: "", unit: "", name: "" },
        { id: uuidv4(), quantity: "", unit: "", name: "" },
        { id: uuidv4(), quantity: "", unit: "", name: "" },
      ]);
    } else {
      setLocalIngredients(
        recipeState.ingredients.map((ingredient) => ({
          ...ingredient,
          id: ingredient.id || uuidv4(),
        }))
      );
    }
    console.log("Recipe State in RecipeIngredients:", recipeState);
  }, [recipeState]);

  const handleButtonClick = () => {
    const ingredientErrors = ingredients.map((ingredient) => {
      return (
        validateQuantity(ingredient.quantity) ||
        validateUnit(ingredient.unit) ||
        validateIngredientName(ingredient.name)
      );
    });
    const instructionsError = validateInstructions(steps.join("\n"));
    const stepErrors = steps.map((step) => validateStep(step));

    setErrorMessages({
      ingredients: ingredientErrors,
      instructions: instructionsError,
      steps: stepErrors,
    });

    const hasErrors =
      ingredientErrors.some((error) => error !== "") ||
      instructionsError !== "" ||
      stepErrors.some((error) => error !== "");

    if (!hasErrors) {
      const ingredientsForAction = ingredients.map(
        ({ id, quantity, unit, name }) => ({ id, quantity, unit, name })
      );
      dispatch(setIngredients(ingredientsForAction));
      dispatch(setInstructions(steps.join("\n")));
      console.log(
        "Updated Recipe State before navigation from ingredients page:",
        recipeState
      );
      navigate(
        recipeId
          ? `/edit-recipe/${recipeId}/recipe-picture`
          : "/create-recipe/recipe-picture"
      );
    }
  };

  const handleBackButton = () => {
    navigate(
      recipeId
        ? `/edit-recipe/${recipeId}/recipe-title`
        : "/create-recipe/recipe-title"
    );
  };

  const handleAddMore = () => {
    setLocalIngredients([
      ...ingredients,
      { id: uuidv4(), quantity: "", unit: "", name: "" },
    ]);
  };

  const handleRemove = (id: string) => {
    setLocalIngredients((prevIngredients) => {
      if (prevIngredients.length <= 1) {
        return prevIngredients;
      }
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
    setErrorMessages((prev) => {
      const newErrors = [...prev.ingredients];
      newErrors[ingredientIndex] = validateIngredientName(formattedName);
      return { ...prev, ingredients: newErrors };
    });
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

  const handleStepChange = (value: string, index: number) => {
    const newSteps = [...steps];
    newSteps[index] = value;
    setSteps(newSteps);
    setErrorMessages((prev) => ({
      ...prev,
      instructions: validateInstructions(newSteps.join("\n")),
      steps: newSteps.map((step) => validateStep(step)),
    }));
  };

  const getTotalChars = () => steps.reduce((acc, step) => acc + step.length, 0);
  const isCharLimitReached = getTotalChars() >= charLimit;

  const handleAddStep = () => {
    if (!isCharLimitReached) {
      setSteps([...steps, ""]);
    }
  };

  const handleRemoveStep = (index: number) => {
    setSteps((prevSteps) => {
      if (prevSteps.length <= 1) {
        return prevSteps;
      }
      return prevSteps.filter((_, i) => i !== index);
    });
  };

  const moveIngredient = (index: number, direction: "up" | "down") => {
    const newIngredients = [...ingredients];
    if (direction === "up" && index > 0) {
      [newIngredients[index], newIngredients[index - 1]] = [
        newIngredients[index - 1],
        newIngredients[index],
      ];
    } else if (direction === "down" && index < ingredients.length - 1) {
      [newIngredients[index], newIngredients[index + 1]] = [
        newIngredients[index + 1],
        newIngredients[index],
      ];
    }
    setLocalIngredients(newIngredients);
  };

  console.log("Recipe State in RecipeIngredients:", recipeState);

  return (
    <div className="flex items-center justify-center min-h-fit bg-gray-100">
      <div className="bg-white p-3 rounded shadow-md w-full max-w-4xl">
        <ProgressBar currentStep={2} maxStep={4} />
        <p className="mb-4 text-2xl font-semibold text-gray-700">
          Mitä sapuskaan tarvitaan?
        </p>
        {ingredients.map((ingredient, index) => (
          <div
            key={ingredient.id}
            className="mb-4 p-4 border rounded-lg bg-white shadow"
          >
            <div className="flex flex-wrap gap-4 items-center">
              <div className="flex flex-col justify-center">
                <button
                  onClick={() => moveIngredient(index, "up")}
                  disabled={index === 0}
                  className={`text-blue-500 hover:text-blue-600 transition-colors duration-200 ${
                    index === 0 ? "opacity-30 cursor-not-allowed" : ""
                  }`}
                  type="button"
                >
                  <FontAwesomeIcon icon={faCaretUp} />
                </button>
                <button
                  onClick={() => moveIngredient(index, "down")}
                  disabled={index === ingredients.length - 1}
                  className={`text-blue-500 hover:text-blue-600 transition-colors duration-200 ${
                    index === ingredients.length - 1
                      ? "opacity-30 cursor-not-allowed"
                      : ""
                  }`}
                  type="button"
                >
                  <FontAwesomeIcon icon={faCaretDown} />
                </button>
              </div>
              <input
                type="text"
                placeholder="Paljon?"
                value={ingredient.quantity}
                onChange={(e) => handleQuantityChange(index, e.target.value)}
                className="border p-2 rounded w-2/12"
                maxLength={7}
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
        <div className="flex items-center justify-between mb-4">
          <p className="text-2xl font-semibold text-gray-700">
            Kuinka sapuska syntyy?
          </p>
          <p className="text-gray-500">
            {steps.reduce((acc, step) => acc + step.length, 0)}/{charLimit}
          </p>
        </div>
        {steps.map((step, index) => {
          const totalCharsUsed = steps.reduce(
            (acc, step) => acc + step.length,
            0
          );
          const remainingChars =
            charLimit - totalCharsUsed + steps[index].length;

          return (
            <div
              key={index}
              className="mb-4 p-4 border rounded-lg bg-white shadow"
            >
              <div className="flex items-center">
                <textarea
                  value={step}
                  onChange={(e) => handleStepChange(e.target.value, index)}
                  placeholder={`Vaihe ${index + 1}`}
                  className="border p-2 rounded w-full"
                  maxLength={remainingChars}
                />
                <button
                  onClick={() => handleRemoveStep(index)}
                  className="ml-4 text-red-500 hover:text-red-600 transition-colors duration-200 flex items-center justify-center"
                >
                  <FontAwesomeIcon icon={faTrash} />
                </button>
              </div>
              {errorMessages.steps[index] && (
                <div className="text-red-500 text-xm text-center mt-2">
                  {errorMessages.steps[index]}
                </div>
              )}
            </div>
          );
        })}
        <div className="flex flex-col items-center">
          {isCharLimitReached && (
            <div className="text-red-500 text-sm mb-2">
              Merkkimäärän raja saavutettu (1000 merkkiä)
            </div>
          )}
          <button
            onClick={handleAddStep}
            className={`bg-blue-500 text-white p-2 rounded mb-4 ${
              isCharLimitReached
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-blue-600"
            }`}
            disabled={isCharLimitReached}
          >
            Lisää uusi vaihe
          </button>
        </div>
        {errorMessages.instructions && (
          <div className="text-red-500 text-center mt-2">
            {errorMessages.instructions}
          </div>
        )}
        <div className="flex justify-between">
          <button
            onClick={handleBackButton}
            className="bg-red-500 hover:bg-red-600 text-white rounded flex-1 mr-2"
          >
            Askel taaksepäin!
          </button>
          <button
            onClick={handleButtonClick}
            className="bg-green-500 hover:bg-green-600 text-white p-2 rounded flex-1 ml-2"
          >
            Mennäänpäs eteenpäin!
          </button>
        </div>
      </div>
    </div>
  );
};

export default RecipeIngredients;
