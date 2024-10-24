import React, { useState, useEffect, useCallback, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import debounce from "lodash.debounce";
import * as ROUTES from "../../Constants/routes";

function RecipeSearch() {
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState("");
  const [results, setResults] = useState<string[]>([]);
  const [selected, setSelected] = useState(false);
  const resultsRef = useRef<HTMLDivElement>(null);

  const navigate = useNavigate();

  const fetchRecipeNamesAndIngredients = useCallback(
    debounce(async (query: string) => {
      try {
        const response = await axios.get(
          `/unique-recipe-names-and-ingredients?query=${encodeURIComponent(
            query
          )}`
        );
        setResults([query, ...response.data]);
      } catch (error) {
        console.error("Error fetching recipe names and ingredients:", error);
      }
    }, 300),
    []
  );

  useEffect(() => {
    if (searchTerm.length >= 3 && !selected) {
      fetchRecipeNamesAndIngredients(searchTerm);
    } else {
      setResults([]);
    }
  }, [searchTerm, fetchRecipeNamesAndIngredients, selected]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const capitalizedValue = value.charAt(0).toUpperCase() + value.slice(1);
    setSearchTerm(capitalizedValue);
    setSelected(false);
  };

  const handleResultClick = (result: string) => {
    setSearchTerm(result);
    setResults([]);
    setSelected(true);
  };

  const handleSearch = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    try {
      const response = await axios.get(
        `/search?query=${encodeURIComponent(searchTerm)}&page=1&limit=9`
      );
      navigate(ROUTES.SEARCH_RESULTS, {
        state: {
          recipes: response.data.recipes,
          totalRecipes: response.data.totalRecipes,
          searchTerm,
        },
      });
    } catch (error) {
      console.error("Search failed:", error);
      setError("Failed to fetch recipes. Please try again.");
    }
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (
      resultsRef.current &&
      !resultsRef.current.contains(event.target as Node)
    ) {
      setResults([]);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="max-w-xs relative">
      <form onSubmit={handleSearch} className="flex flex-col">
        <input
          type="text"
          value={searchTerm}
          onChange={handleInputChange}
          placeholder="Reseptin tai raaka-aineen nimi"
          className="border rounded p-2 mb-4"
          required
        />
        {results.length > 0 && (
          <div
            ref={resultsRef}
            className="absolute bg-white border rounded w-full mt-1 z-10 max-h-52 overflow-y-auto"
            style={{ top: "44px" }}
          >
            {results.map((result, index) => (
              <p
                key={index}
                onClick={() => handleResultClick(result)}
                className="p-2 cursor-pointer hover:bg-gray-200"
              >
                {result}
              </p>
            ))}
          </div>
        )}
        <button
          type="submit"
          className="bg-blue-500 text-white rounded p-2 hover:bg-blue-700"
        >
          Löydä herkku!
        </button>
      </form>
      {error && <p className="text-red-500 mt-4">{error}</p>}
    </div>
  );
}

export default RecipeSearch;
