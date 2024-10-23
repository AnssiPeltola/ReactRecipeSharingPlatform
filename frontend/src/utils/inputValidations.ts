export const EMPTY_FIELD_ERROR = "Kenttä ei saa olla tyhjä";
export const SPECIAL_CHAR_ERROR = "ei saa sisältää erikoismerkkejä";
export const NUMBER_ERROR = "Kenttä saa sisältää vain numeroita";
export const INSTRUCTIONS_REQUIRED_ERROR = "Ohjeet ovat pakolliset";
export const INGREDIENT_NUMBER_ERROR = "Ei saa sisältää numeroita";
export const EMPTY_STEP_ERROR = "Vaihe ei saa olla tyhjä";
export const MAX_QUANTITY_ERROR = "Määrä ei voi olla suurempi kuin 9999.99";
export const DECIMAL_ERROR = "Määrässä voi olla enintään kaksi desimaalia";

const titleRegex = /^[\p{L}\d\s\-']*$/u;
const ingredientNameRegex = /^[\p{L}\s\-']*$/u;
const numberRegex = /\d/;

export function validateTitle(title: string): string {
  if (title.trim() === "") {
    return EMPTY_FIELD_ERROR;
  } else if (!titleRegex.test(title)) {
    return `Otsikko ${SPECIAL_CHAR_ERROR}`;
  }
  return "";
}

export function validateCategory(category: string): string {
  if (category.trim() === "") {
    return EMPTY_FIELD_ERROR;
  }
  return "";
}

export function validateSecondaryCategory(secondaryCategory: string): string {
  if (secondaryCategory.trim() === "") {
    return EMPTY_FIELD_ERROR;
  }
  return "";
}

export function validateMainCategory(mainCategory: string): string {
  if (mainCategory.trim() === "") {
    return EMPTY_FIELD_ERROR;
  }
  return "";
}

export function validateSpecificIngredient(specificIngredient: string): string {
  if (specificIngredient.trim() === "") {
    return EMPTY_FIELD_ERROR;
  }
  return "";
}

export function validateQuantity(quantity: string): string {
  if (quantity.trim() === "") {
    return EMPTY_FIELD_ERROR;
  }

  const normalizedQuantity = quantity.replace(",", ".");

  if (isNaN(Number(normalizedQuantity))) {
    return NUMBER_ERROR;
  }

  const numericValue = parseFloat(normalizedQuantity);
  if (numericValue > 9999.99) {
    return MAX_QUANTITY_ERROR;
  }

  const decimalPart = normalizedQuantity.split(".")[1];
  if (decimalPart && decimalPart.length > 2) {
    return DECIMAL_ERROR;
  }

  return "";
}

export function validateUnit(unit: string): string {
  if (unit.trim() === "") {
    return EMPTY_FIELD_ERROR;
  }
  return "";
}

export function validateIngredientName(name: string): string {
  if (name.trim() === "") {
    return EMPTY_FIELD_ERROR;
  } else if (numberRegex.test(name)) {
    return INGREDIENT_NUMBER_ERROR; // Return new error message if numbers are found
  } else if (!ingredientNameRegex.test(name)) {
    return SPECIAL_CHAR_ERROR;
  }
  return "";
}

export function validateInstructions(instructions: string): string {
  return instructions.trim() === "" ? INSTRUCTIONS_REQUIRED_ERROR : "";
}

export function validateStep(step: string): string {
  return step.trim() === "" ? EMPTY_STEP_ERROR : "";
}
