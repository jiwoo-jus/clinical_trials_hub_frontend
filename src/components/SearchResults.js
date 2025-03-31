// src/components/SearchResults.js
import React from 'react';

function SearchResults({ results, onSelectPaper }) {
  if (!results || results.length === 0) {
    return <div>No results found.</div>;
  }

  return (
    <div>
      <h2>Search Results</h2>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {results.map((item, index) => (
          <li key={index} style={{ borderBottom: '1px solid #ccc', marginBottom: '0.5rem', paddingBottom: '0.5rem' }}>
            <strong>{item.title}</strong> ({item.source})
            <br />
            <button onClick={() => onSelectPaper(item)}>View Details</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default SearchResults;
