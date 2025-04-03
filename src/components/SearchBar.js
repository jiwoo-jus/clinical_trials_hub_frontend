import React, { useState } from 'react';
import api from '../api';

function formatRefinedQuery(refinedQuery) {
  return (
    <div style={{ whiteSpace: 'pre-wrap', lineHeight: '1.5em' }}>
      <div><strong>• Condition/Disease:</strong> {refinedQuery["cond"]}</div>
      <div><strong>• Intervention/Treatment:</strong> {refinedQuery["intr"]}</div>
      <div><strong>• Other Terms:</strong> {refinedQuery["other_term"]}</div>
      {/* {refinedQuery.combined_query && (
        <div><strong>• Combined Query:</strong> {refinedQuery.combined_query}</div>
      )} */}
    </div>
  );
}

function SearchBar({ onResults }) {
  const [userQuery, setQuery] = useState('');
  const [condition, setCondition] = useState('');
  const [intervention, setIntervention] = useState('');
  const [refinedQueryLocal, setRefinedQueryLocal] = useState('');
  const [advancedVisible, setAdvancedVisible] = useState(false);

  const toggleAdvanced = () => {
    setAdvancedVisible(!advancedVisible);
  };

  const handleSearch = async () => {
    try {
      // 사용자 입력을 "other_term", "cond", "intr"로 구성하여 payload에 담습니다.
      const payload = {
        other_term: userQuery,
        cond: condition,
        intr: intervention
      };
      const response = await api.post('/search', payload);
      // 응답 형식: { refinedQuery, results }
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
      textToCopy =
        `• Condition/Disease: ${refinedQueryLocal["cond"]}\n`
        + `• Intervention/Treatment: ${refinedQueryLocal["intr"]}\n`
        + `• Other Terms: ${refinedQueryLocal["other_term"]}\n`
        // +(refinedQueryLocal.combined_query ? `• Combined Query: ${refinedQueryLocal.combined_query}` : "")
        ;
    } else {
      textToCopy = refinedQueryLocal;
    }
    navigator.clipboard.writeText(textToCopy)
      .then(() => console.log("Copied refined query:", textToCopy))
      .catch(err => console.error("Copy failed:", err));
  };

  return (
    <div style={{ marginBottom: '1rem' }}>
      {/* 메인 검색 입력 (우선 노출) */}
      <div>
        <input
          type="text"
          placeholder="What clinical trial paper are you looking for?"
          value={userQuery}
          onChange={(e) => setQuery(e.target.value)}
          style={{ width: '300px', marginBottom: '4px' }}
        />
        <button onClick={handleSearch}>Search</button>
      </div>
      {/* Advanced Search (Optional) 섹션 토글 */}
      <div style={{ marginTop: '8px' }}>
        <button onClick={toggleAdvanced}>
          {advancedVisible ? 'Hide Advanced Search' : 'Show Advanced Search'}
        </button>
      </div>
      {advancedVisible && (
        <div style={{ marginTop: '8px' }}>
          <input
            type="text"
            placeholder="Condition or disease"
            value={condition}
            onChange={(e) => setCondition(e.target.value)}
            style={{ width: '300px', marginBottom: '4px' }}
          />
          <input
            type="text"
            placeholder="Intervention or treatment"
            value={intervention}
            onChange={(e) => setIntervention(e.target.value)}
            style={{ width: '300px', marginBottom: '4px' }}
          />
        </div>
      )}
      {refinedQueryLocal && (
        <div style={{ marginTop: '16px' }}>
          <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>Refined Search:</div>
          <div>
            {typeof refinedQueryLocal === 'object'
              ? formatRefinedQuery(refinedQueryLocal)
              : <span style={{ whiteSpace: 'pre-wrap' }}>{refinedQueryLocal}</span>
            }
          </div>
          <button onClick={handleCopy} style={{ marginTop: '4px' }}>📋 Copy</button>
        </div>
      )}
    </div>
  );
}

export default SearchBar;
