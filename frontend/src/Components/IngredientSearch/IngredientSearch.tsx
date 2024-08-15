import React, { useState, useEffect } from "react";

interface IngredientSearchProps {
  onIngredientSelect: (name: string) => void;
  initialValue: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

interface Ingredient {
  name: string;
}

const IngredientSearch: React.FC<IngredientSearchProps> = ({
  onIngredientSelect,
  initialValue,
  onChange,
}) => {
  const [query, setQuery] = useState(initialValue || "");
  const [results, setResults] = useState<Ingredient[]>([]);

  const searchIngredients = () => {
    fetch(`https://world.openfoodfacts.org/data/taxonomies/ingredients.json`)
      .then((response) => response.json())
      .then((data) => {
        const fiNames = Object.entries(data)
          .filter(
            ([key, ingredient]: [string, any]) =>
              ingredient.name &&
              ingredient.name.fi &&
              ingredient.name.fi.toLowerCase().includes(query.toLowerCase())
          )
          .map(([key, ingredient]: [string, any]) => ({
            name: ingredient.name.fi,
          }))
          .sort((a: any, b: any) => a.name.length - b.name.length);
        setResults(fiNames);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    if (onChange) {
      onChange(e);
    }
    if (e.target.value.length < 3) {
      setResults([]);
    } else {
      searchIngredients();
    }
  };

  const handleResultClick = (result: any) => {
    setQuery(result.name);
    setResults([]);
    onIngredientSelect(result.name);
  };

  return (
    <div className="relative">
      <input
        type="text"
        value={query}
        onChange={handleInputChange}
        className="border p-2 rounded w-full"
      />
      {results.length > 0 && (
        <div className="absolute bg-white border rounded w-full mt-1 z-10">
          {results.map((result, index) => (
            <p
              key={index}
              onClick={() => handleResultClick(result)}
              className="p-2 cursor-pointer hover:bg-gray-200"
            >
              {result.name}
            </p>
          ))}
        </div>
      )}
    </div>
  );
};

export default IngredientSearch;
