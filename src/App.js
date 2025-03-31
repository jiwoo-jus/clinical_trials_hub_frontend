// src/App.js
import React, { useState } from 'react';
import SearchBar from './components/SearchBar';
import SearchResults from './components/SearchResults';
import PaperDetails from './components/PaperDetails';

function App() {
  const [selectedPaper, setSelectedPaper] = useState(null);
  const [results, setResults] = useState([]);
  const [refinedQuery, setRefinedQuery] = useState('');

  return (
    <div style={{ padding: '1rem' }}>
      <h1>Clinical Trials Hub</h1>
      {!selectedPaper && (
        <>
          <SearchBar onResults={(refined, res) => {
            setRefinedQuery(refined);
            setResults(res);
          }} />
          <SearchResults results={results} onSelectPaper={setSelectedPaper} />
        </>
      )}
      {selectedPaper && (
        <PaperDetails paper={selectedPaper} onBack={() => setSelectedPaper(null)} />
      )}
    </div>
  );
}

export default App;
