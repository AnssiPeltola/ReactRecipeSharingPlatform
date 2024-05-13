import React, { useState } from 'react';
import styles from './IngredientSearch.module.scss';

function IngredientSearch() {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);

    const searchIngredients = () => {
        fetch(`https://world.openfoodfacts.org/data/taxonomies/ingredients.json`)
            .then(response => response.json())
            .then(data => {
                // Extract the Finnish names
                const fiNames = Object.values(data)
                    .filter((ingredient: any) => ingredient.name && ingredient.name.fi && ingredient.name.fi.toLowerCase().includes(query.toLowerCase()))
                    .map((ingredient: any) => ingredient.name.fi)
                    .sort((a: string, b: string) => a.length - b.length);
                setResults(fiNames as never[]);
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

    const handleResultClick = (result: string) => {
        setQuery(result);
        setResults([]);
    };

    return (
        <div className={styles.ingredientSearch}>
            <input className={styles.inputField} type="text" value={query} onChange={handleInputChange} />
            <div className={styles.dropdown}>
                {results.map((result, index) => (
                    <p key={index} onClick={() => handleResultClick(result)}>
                        {result}
                    </p>
                ))}
            </div>
        </div>
    );
}

export default IngredientSearch;