// src/components/PaperDetails.js
import React from 'react';
import ChatBot from './ChatBot';
import StructuredInfo from './StructuredInfo';
import FullText from './FullText';

function PaperDetails({ paper, onBack }) {
  const { title, id, source, pmcid, doi, references } = paper;

  return (
    <div>
      <button onClick={onBack}>Back to Results</button>
      <h2>{title}</h2>
      <p><strong>ID:</strong> {id}</p>
      <p><strong>Source:</strong> {source}</p>
      {doi && <p><strong>DOI:</strong> {doi}</p>}

      <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
        <div style={{ flex: 1 }}>
          <h3>ChatBot</h3>
          <ChatBot paperId={pmcid} />
        </div>
        <div style={{ flex: 1 }}>
          <h3>Structured Info</h3>
          <StructuredInfo pmcid={pmcid} />
        </div>
      </div>

      <div style={{ marginTop: '2rem' }}>
        <h3>{source === "ClinicalTrials.gov" ? "References" : "Full Text"}</h3>
        {source === "ClinicalTrials.gov" ? (
          <div style={{ border: '1px solid #ccc', padding: '1rem', overflow: 'auto', whiteSpace: 'pre-wrap' }}>
            {references && references.length > 0 ? references.join('\n') : 'No references available.'}
          </div>
        ) : (
          <FullText pmcid={pmcid} source={source} />
        )}
      </div>
    </div>
  );
}

export default PaperDetails;
