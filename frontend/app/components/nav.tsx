'use client'
// components/SearchBar.tsx

import { useState } from 'react';
import styles from './components.module.css'; 


const SearchBar: React.FC = () => {
  const [query, setQuery] = useState<string>('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // You can perform your search logic here with the 'query' state
    console.log('Search query:', query);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="search youtube video here!"
        value={query}
        onChange={handleInputChange}
        className={styles['search-bar']}
      />
      <button type="submit">Search</button>
    </form>
  );
};

export default SearchBar;
