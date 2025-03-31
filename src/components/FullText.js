// src/components/FullText.js
import React, { useEffect, useState } from 'react';
import api from '../api';

function FullText({ pmcid, source }) {
  const [content, setContent] = useState('');

  useEffect(() => {
    const fetchContent = async () => {
      if (!pmcid) {
        setContent('No full text available.');
        return;
      }
      try {
        // PMC/PM 논문은 pmc_full_text_html API를 호출
        const res = await api.get(`/paper/pmc_full_text_html`, {
          params: { pmcid }
        });
        setContent(res.data.pmc_full_text_html || '');
      } catch (error) {
        console.error('Error fetching full text:', error);
      }
    };
    fetchContent();
  }, [pmcid]);

  if (!content) return <div>Loading content...</div>;

  return (
    <div style={{ border: '1px solid #ccc', padding: '1rem', overflow: 'auto' }}>
      <div dangerouslySetInnerHTML={{ __html: content }} />
    </div>
  );
}

export default FullText;
