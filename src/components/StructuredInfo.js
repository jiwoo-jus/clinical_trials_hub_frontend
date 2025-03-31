// src/components/StructuredInfo.js
import React, { useEffect, useState } from 'react';
import api from '../api';

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

  if (!info) return <div>Loading structured info...</div>;

  if (info.references) {
    return (
      <div style={{ border: '1px solid #ccc', padding: '1rem' }}>
        <strong>References:</strong>
        <ul>
          {info.references.map((ref, idx) => (
            <li key={idx}>{ref}</li>
          ))}
        </ul>
      </div>
    );
  }

  return (
    <div style={{ border: '1px solid #ccc', padding: '1rem' }}>
      {Object.entries(info).map(([key, value]) => (
        <div key={key}>
          <strong>{key}:</strong> {typeof value === 'string' ? value : JSON.stringify(value)}
        </div>
      ))}
    </div>
  );
}

export default StructuredInfo;
