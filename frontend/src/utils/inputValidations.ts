export const EMPTY_FIELD_ERROR = "Kenttä ei saa olla tyhjä";
export const SPECIAL_CHAR_ERROR = "ei saa sisältää erikoismerkkejä";
export const NUMBER_ERROR = "Kenttä saa sisältää vain numeroita";
export const INSTRUCTIONS_REQUIRED_ERROR = "Ohjeet ovat pakolliset";
export const INGREDIENT_NUMBER_ERROR = "Ei saa sisältää numeroita"; // New error message

const titleRegex = /^[\p{L}\d\s\-']*$/u;
const ingredientNameRegex = /^[\p{L}\s\-']*$/u; // Updated regex to exclude numbers
const numberRegex = /\d/; // Regex to check for numbers

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
  } else if (isNaN(Number(quantity))) {
    return NUMBER_ERROR;
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
