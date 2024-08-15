import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import * as ROUTES from "../../Constants/routes";

function RecipeSearch() {
  const [searchTerm, setSearchTerm] = useState("");
  const [recipes, setRecipes] = useState<{ id: number; title: string }[]>([]);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleSearch = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    try {
      const response = await axios.get(
        `/search?query=${encodeURIComponent(searchTerm)}`
      );
      navigate(ROUTES.SEARCH_RESULTS, { state: { recipes: response.data } });
    } catch (error) {
      console.error("Search failed:", error);
      setError("Failed to fetch recipes. Please try again.");
    }
  };

  return (
    <div className="max-w-xs">
      <form onSubmit={handleSearch} className="flex flex-col">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Reseptin tai raaka-aineen nimi"
          className="border rounded p-2 mb-4"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white rounded p-2 hover:bg-blue-700"
        >
          Hae
        </button>
      </form>
      {error && <p className="text-red-500 mt-4">{error}</p>}
    </div>
  );
}

export default RecipeSearch;
