// src/components/SearchBar.js
import React, { useState } from 'react';
import api from '../api';

function SearchBar({ onResults }) {
  const [query, setQuery] = useState('');

  const handleSearch = async () => {
    try {
      const response = await api.post('/search', { userQuery: query });
      // Response: { refinedQuery, results }
      const { refinedQuery, results } = response.data;
      onResults(refinedQuery, results);
    } catch (error) {
      console.error('Search error:', error);
      onResults('', []);
    }
  };

  return (
    <div style={{ marginBottom: '1rem' }}>
      <input
        type="text"
        placeholder="Enter clinical trial query..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        style={{ width: '300px' }}
      />
      <button onClick={handleSearch}>Search</button>
    </div>
  );
}

export default SearchBar;
