import React, { useState, useEffect, useCallback } from "react";
import debounce from "lodash.debounce";

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
  const [selected, setSelected] = useState(!!initialValue);

  const searchIngredients = useCallback(
    debounce((query: string) => {
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
    }, 300),
    []
  );

  useEffect(() => {
    if (query.length >= 3 && !selected) {
      searchIngredients(query);
    } else {
      setResults([]);
    }
  }, [query, searchIngredients, selected]);

  useEffect(() => {
    setQuery(initialValue);
    setSelected(!!initialValue);
  }, [initialValue]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    setSelected(false);
    if (onChange) {
      onChange(e);
    }
  };

  const handleResultClick = (result: any) => {
    setQuery(result.name);
    setResults([]);
    setSelected(true);
    onIngredientSelect(result.name);
  };

  return (
    <div className="relative">
      <input
        type="text"
        value={query}
        placeholder="Mikä tulee mukaan?"
        onChange={handleInputChange}
        className="border p-2 rounded w-full"
      />
      {results.length > 0 && (
        <div className="absolute bg-white border rounded w-full mt-1 z-10 max-h-52 overflow-y-auto">
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
