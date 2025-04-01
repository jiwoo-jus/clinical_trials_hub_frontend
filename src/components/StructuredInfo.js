// src/components/StructuredInfo.js
import React, { useEffect, useState } from 'react';
import api from '../api';

// render object recursively
function renderObject(obj, indent = 0) {
  return Object.entries(obj).map(([key, value]) => {
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      return (
        <div key={key} style={{ marginLeft: indent * 16 }}>
          <strong>{key}:</strong>
          <div style={{ marginLeft: 16 }}>{renderObject(value, indent + 1)}</div>
        </div>
      );
    } else if (Array.isArray(value)) {
      return (
        <div key={key} style={{ marginLeft: indent * 16 }}>
          <strong>{key}:</strong>
          <ul>
            {value.map((item, idx) => (
              <li key={idx}>
                {typeof item === 'object' ? renderObject(item, indent + 1) : item.toString()}
              </li>
            ))}
          </ul>
        </div>
      );
    } else {
      return (
        <div key={key} style={{ marginLeft: indent * 16 }}>
          <strong>{key}:</strong> {value !== null && value !== undefined ? value.toString() : ''}
        </div>
      );
    }
  });
}

function StructuredInfo({ pmcid }) {
  const [info, setInfo] = useState(null);

  useEffect(() => {
    const fetchInfo = async () => {
      if (!pmcid) {
        setInfo({ error: 'No structured info available.' });
        return;
      }
      try {
        const res = await api.get(`/paper/structured_info`, {
          params: { pmcid }
        });
        setInfo(res.data.structured_info);
      } catch (error) {
        console.error('Error fetching structured info:', error);
      }
    };
    fetchInfo();
  }, [pmcid]);

  if (!info) {
    return (
      <div style={{ padding: '1rem', fontStyle: 'italic' }}>
        <span role="img" aria-label="loading">⏳</span> Loading structured info...
      </div>
    );
  }

  if (info.error) {
    return <div style={{ padding: '1rem' }}>Error: {info.error}</div>;
  }

  return (
    <div style={{ border: '1px solid #ccc', padding: '1rem' }}>
      {info.protocolSection && (
        <div>
          <h4>Protocol Section</h4>
          {renderObject(info.protocolSection)}
        </div>
      )}
      {info.resultsSection && (
        <div>
          <h4>Results Section</h4>
          {renderObject(info.resultsSection)}
        </div>
      )}
      {info.annotationSection && (
        <div>
          <h4>Annotation Section</h4>
          {renderObject(info.annotationSection)}
        </div>
      )}
      {info.documentSection && (
        <div>
          <h4>Document Section</h4>
          {renderObject(info.documentSection)}
        </div>
      )}
      {info.derivedSection && (
        <div>
          <h4>Derived Section</h4>
          {renderObject(info.derivedSection)}
        </div>
      )}
      {info.hasResults !== undefined && (
        <div>
          <h4>Has Results</h4>
          <div>{info.hasResults ? 'Yes' : 'No'}</div>
        </div>
      )}
    </div>
  );
}

export default StructuredInfo;
