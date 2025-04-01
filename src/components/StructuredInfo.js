// src/components/StructuredInfo.js
import React, { useEffect, useState } from 'react';
import api from '../api';
import './StructuredInfo.css';

// 재귀적으로 JSON 트리를 폴딩하여 렌더링
const FoldableNode = ({ nodeKey, data, depth, defaultExpandDepth }) => {
  const isObject = data && typeof data === 'object';
  const isArray = Array.isArray(data);

  // 사용자 입장에서 depth 0 -> 레벨1, depth 1 -> 레벨2
  const level = depth + 1;
  // level이 defaultExpandDepth 미만이면 펼쳐진 상태로
  const [expanded, setExpanded] = useState(level < defaultExpandDepth);

  const toggle = () => setExpanded(!expanded);

  const handleCopy = () => {
    const jsonObj = { [nodeKey]: data };
    const jsonStr = JSON.stringify(jsonObj, null, 2);
    navigator.clipboard.writeText(jsonStr)
      .then(() => console.log("Copied:", jsonStr))
      .catch(err => console.error("Copy failed", err));
  };

  // 폰트 크기: level 1 -> 1.3em, 2 -> 1.2em, 3 -> 1.1em, 4이상 -> 1em
  const computedFontSize = level < 4 ? `${1.4 - level * 0.1}em` : '1em';
  const containerStyle = {
    marginLeft: depth * 16,
    borderLeft: '2px solid #666',
    paddingLeft: 8,
    // fontSize: computedFontSize,
    marginTop: 4,
  };

  // Leaf 노드: string/number 등
  if (!isObject) {
    return (
      <div style={containerStyle} className="foldable-node">
        <span style={{ whiteSpace: 'pre-wrap' }}>
          <strong>{nodeKey}:</strong> {data?.toString()}
        </span>
        <button className="copy-button" onClick={handleCopy}>copy</button>
      </div>
    );
  }

  // 객체/배열 노드
  return (
    <div style={containerStyle} className="foldable-node">
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <span onClick={toggle} style={{ cursor: 'pointer', userSelect: 'none', flex: 1 }}>
          {expanded ? '▼' : '▶'} <strong>{nodeKey}</strong>:
        </span>
        <button className="copy-button" onClick={handleCopy}>copy</button>
      </div>
      {expanded && (
        <div>
          {isArray ? (
            data.map((item, i) => (
              <FoldableNode
                key={i}
                nodeKey={i.toString()}
                data={item}
                depth={depth + 1}
                defaultExpandDepth={defaultExpandDepth}
              />
            ))
          ) : (
            Object.entries(data).map(([key, value]) => (
              <FoldableNode
                key={key}
                nodeKey={key}
                data={value}
                depth={depth + 1}
                defaultExpandDepth={defaultExpandDepth}
              />
            ))
          )}
        </div>
      )}
    </div>
  );
};

function StructuredInfo({ pmcid, structuredInfo: preloadedStructuredInfo }) {
  const [info, setInfo] = useState(preloadedStructuredInfo || null);

  useEffect(() => {
    // CTG인 경우 이미 structuredInfo가 있으므로 API 호출 불필요
    if (!preloadedStructuredInfo && pmcid) {
      const fetchInfo = async () => {
        try {
          const res = await api.get(`/paper/structured_info`, { params: { pmcid } });
          setInfo(res.data.structured_info);
        } catch (error) {
          console.error('Error fetching structured info:', error);
        }
      };
      fetchInfo();
    }
  }, [pmcid, preloadedStructuredInfo]);

  const handleCopyAll = () => {
    const jsonStr = JSON.stringify(info, null, 2);
    navigator.clipboard.writeText(jsonStr)
      .then(() => console.log("Copied all:", jsonStr))
      .catch(err => console.error("Copy all failed", err));
  };

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
    <div style={{ border: '1px solid #ccc', padding: '1rem', overflowX: 'auto' }}>
      <div style={{ marginBottom: 8, display: 'flex', alignItems: 'center' }}>
        <strong>Structured Info</strong>
        <button className="copy-button" onClick={handleCopyAll}>copy</button>
      </div>
      {Object.entries(info).map(([key, value]) => (
        <FoldableNode
          key={key}
          nodeKey={key}
          data={value}
          depth={0}
          defaultExpandDepth={3}
        />
      ))}
    </div>
  );
}

export default StructuredInfo;
