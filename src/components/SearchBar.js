// src/components/SearchBar.js
import React, { useState } from 'react';
import api from '../api';

function formatRefinedQuery(refinedQuery) {
  // refinedQuery가 객체라면 지정된 형식으로 JSX 반환
  return (
    <div style={{ whiteSpace: 'pre-wrap', lineHeight: '1.5em' }}>
      <div><strong>• P (Patient, Problem, or Population):</strong> {refinedQuery.P}</div>
      <div><strong>• I (Intervention):</strong> {refinedQuery.I}</div>
      <div><strong>• C (Comparison):</strong> {refinedQuery.C}</div>
      <div><strong>• O (Outcome):</strong> {refinedQuery.O}</div>
      <div><strong>• Query:</strong> {refinedQuery.query}</div>
    </div>
  );
}

function SearchBar({ onResults }) {
  const [query, setQuery] = useState('');
  const [refinedQueryLocal, setRefinedQueryLocal] = useState('');

  const handleSearch = async () => {
    try {
      const response = await api.post('/search', { userQuery: query });
      // Response: { refinedQuery, results }
      const { refinedQuery, results } = response.data;
      setRefinedQueryLocal(refinedQuery);
      onResults(refinedQuery, results);
    } catch (error) {
      console.error('Search error:', error);
      setRefinedQueryLocal('');
      onResults('', []);
    }
  };

  const handleCopy = () => {
    let textToCopy;
    if (typeof refinedQueryLocal === 'object') {
      // 객체인 경우, 포맷된 텍스트로 변환
      textToCopy =
        `• P (Patient, Problem, or Population): ${refinedQueryLocal.P}\n` +
        `• I (Intervention): ${refinedQueryLocal.I}\n` +
        `• C (Comparison): ${refinedQueryLocal.C}\n` +
        `• O (Outcome): ${refinedQueryLocal.O}\n` +
        `• Query: ${refinedQueryLocal.query}`;
    } else {
      textToCopy = refinedQueryLocal;
    }
    navigator.clipboard.writeText(textToCopy)
      .then(() => console.log("Copied refined query:", textToCopy))
      .catch(err => console.error("Copy failed:", err));
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
      {refinedQueryLocal && (
        <div style={{ marginTop: '8px' }}>
          <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>Refined Query:</div>
          <div>
            {typeof refinedQueryLocal === 'object'
              ? formatRefinedQuery(refinedQueryLocal)
              : <span style={{ whiteSpace: 'pre-wrap' }}>{refinedQueryLocal}</span>
            }
          </div>
        </div>
      )}
    </div>
  );
}

export default SearchBar;
