import React, { useState } from 'react';
import styles from './IngredientSearch.module.scss';

interface IngredientSearchProps {
    onIngredientSelect: (name: string) => void;
  }

  interface Ingredient {
    name: string;
  }

const IngredientSearch: React.FC<IngredientSearchProps> = ({ onIngredientSelect }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Ingredient[]>([]);

  const searchIngredients = () => {
    fetch(`https://world.openfoodfacts.org/data/taxonomies/ingredients.json`)
      .then(response => response.json())
      .then(data => {
        // Extract the Finnish names
        const fiNames = Object.entries(data)
          .filter(([key, ingredient]: [string, any]) => ingredient.name && ingredient.name.fi && ingredient.name.fi.toLowerCase().includes(query.toLowerCase()))
          .map(([key, ingredient]: [string, any]) => ({ name: ingredient.name.fi }))
          .sort((a: any, b: any) => a.name.length - b.name.length);
        setResults(fiNames);
      })
      .catch(error => {
        console.error('Error:', error);
      });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
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
    <div className={styles.ingredientSearch}>
      <input className={styles.inputField} type="text" value={query} onChange={handleInputChange} />
      <div className={styles.dropdown}>
            {results.map((result, index) => (
        <p key={index} onClick={() => handleResultClick(result)}>
            {result.name}
        </p>
        ))}
      </div>
    </div>
  );
}

export default IngredientSearch;