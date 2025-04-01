// src/components/PaperDetails.js
import React from 'react';
import ChatBot from './ChatBot';
import StructuredInfo from './StructuredInfo';
import FullText from './FullText';

function PaperDetails({ paper, onBack }) {
  // CTG 검색결과의 경우 structured_info와 references 필드가 있음
  const { title, id, source, pmcid, doi, references, structured_info } = paper;

  return (
    <div>
      <button onClick={onBack}>Back to Results</button>
      <h2>{title}</h2>
      <p><strong>ID:</strong> {id}</p>
      <p><strong>Source:</strong> {source}</p>
      {doi && <p><strong>DOI:</strong> {doi}</p>}

      {/* 상단 영역: 왼쪽 ChatBot, 오른쪽 Structured Info */}
      <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
        <div style={{ flex: 1 }}>
          <h3>ChatBot</h3>
          {source === "CTG" ? (
            // CTG의 경우 ChatBot에 structured_info 전달
            <ChatBot data={structured_info} />
          ) : (
            // PM/PMC의 경우 paperId(pmcid) 전달
            <ChatBot paperId={pmcid} />
          )}
        </div>
        <div style={{ flex: 1 }}>
          <h3>Structured Info</h3>
          {source === "CTG" ? (
            // CTG의 경우 이미 가져온 structured_info 사용
            <StructuredInfo structuredInfo={structured_info} />
          ) : (
            // PM/PMC의 경우 pmcid로 백엔드 호출
            <StructuredInfo pmcid={pmcid} />
          )}
        </div>
      </div>

      {/* 하단 영역: CTG면 References, PM/PMC면 Full Text */}
      <div style={{ marginTop: '2rem' }}>
        <h3>{source === "CTG" ? "References" : "Full Text"}</h3>
        {source === "CTG" ? (
          <div style={{ border: '1px solid #ccc', padding: '1rem', overflow: 'auto' }}>
            {references && references.length > 0 ? (
              references.map((ref, index) => (
                <div key={index} style={{ marginBottom: '8px' }}>
                  {/* pmid가 있으면 PubMed 링크로, 없으면 그냥 텍스트 */}
                  {ref.pmid ? (
                    <>
                      <a
                        href={`https://pubmed.ncbi.nlm.nih.gov/${ref.pmid}/`}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ color: '#0645AD', textDecoration: 'underline' }}
                      >
                        {ref.citation}
                      </a>
                    </>
                  ) : (
                    // pmid 없으면 citation만 텍스트로 표시
                    <span>{ref.citation}</span>
                  )}
                </div>
              ))
            ) : (
              'No references available.'
            )}
          </div>
        ) : (
          <FullText pmcid={pmcid} source={source} />
        )}

      </div>
    </div>
  );
}

export default PaperDetails;
