export const EMPTY_FIELD_ERROR = "Kenttä ei saa olla tyhjä";
export const SPECIAL_CHAR_ERROR = "ei saa sisältää erikoismerkkejä";

const titleRegex = /^[\p{L}\d\s\-']*$/u;

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
