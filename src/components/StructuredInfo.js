import React, { useEffect, useState } from 'react';
import api from '../api';
import './StructuredInfo.css'; // CSS 파일 임포트

// 재귀적으로 JSON 트리를 렌더링하는 컴포넌트
const FoldableNode = ({ nodeKey, data, depth, defaultExpandDepth }) => {
  const isObject = data !== null && typeof data === 'object';
  const isArray = Array.isArray(data);
  // 기본적으로 depth가 defaultExpandDepth 미만이면 펼쳐지도록 함 (예: defaultExpandDepth=2이면 depth 0, 1는 펼쳐지고, 2 이상은 접힘)
  const [expanded, setExpanded] = useState(depth < defaultExpandDepth);

  const toggle = () => {
    setExpanded(!expanded);
  };

  const handleCopy = () => {
    // 자신 포함 하위 내용을 복사: { key: data } 형태의 JSON 문자열 생성
    const jsonObj = { [nodeKey]: data };
    const jsonStr = JSON.stringify(jsonObj, null, 2);
    navigator.clipboard.writeText(jsonStr)
      .then(() => console.log("Copied:", jsonStr))
      .catch(err => console.error("Copy failed", err));
  };

  // 노드 컨테이너 스타일: 깊이에 따라 들여쓰기와 왼쪽 선이 적용됨
  const containerStyle = {
    marginLeft: depth * 16,
    borderLeft: '2px solid #666',
    paddingLeft: 8,
    marginTop: 4,
  };

  // Leaf 노드인 경우
  if (!isObject) {
    return (
      <div style={containerStyle} className="foldable-node">
        <span><strong>{nodeKey}:</strong> {data.toString()}</span>
        <button className="copy-button" onClick={handleCopy}>copy</button>
      </div>
    );
  }

  // 객체나 배열인 경우
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
            data.map((item, index) => (
              <FoldableNode
                key={index}
                nodeKey={index.toString()}
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
        // defaultExpandDepth=1: 깊이 0은 기본적으로 펼쳐지고, 1 이상은 접힘
        <FoldableNode key={key} nodeKey={key} data={value} depth={0} defaultExpandDepth={1} />
      ))}
    </div>
  );
}

export default StructuredInfo;
