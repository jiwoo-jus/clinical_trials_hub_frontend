// src/components/ChatBot.js
import React, { useState } from 'react';
import api from '../api';
import './ChatBot.css';

function copyToClipboard(text) {
  navigator.clipboard.writeText(text)
    .then(() => console.log("Copied:", text))
    .catch(err => console.error("Copy failed", err));
}

const ChatMessage = ({ message, isLatest, onToggle }) => {
  const handleCopyAll = () => {
    const allText = `Q: ${message.question}\nA: ${message.answer}${
      message.evidence && message.evidence.length > 0
        ? `\nEvidence:\n${message.evidence.join("\n")}`
        : ""
    }`;
    copyToClipboard(allText);
  };

  return (
    <div style={{ marginBottom: '1rem', border: '1px solid #ccc', padding: '8px' }}>
      {/* Q 영역 */}
      <div style={{ display: 'flex', alignItems: 'flex-start', marginBottom: '4px' }}>
        <strong style={{ marginRight: '4px' }}>Q:</strong>
        <div style={{ flex: 1, whiteSpace: 'pre-wrap' }}>
          {message.question}
        </div>
        <button
          className="copy-button"
          style={{ alignSelf: 'flex-start' }}
          onClick={() => copyToClipboard(message.question)}
        >
          copy
        </button>
      </div>

      {isLatest || message.expanded ? (
        <>
          {/* A 영역 */}
          <div style={{ display: 'flex', alignItems: 'flex-start', marginBottom: '4px' }}>
            <strong style={{ marginRight: '4px' }}>A:</strong>
            <div style={{ flex: 1, whiteSpace: 'pre-wrap' }}>
              {message.answer}
            </div>
            <button
              className="copy-button"
              style={{ alignSelf: 'flex-start' }}
              onClick={() => copyToClipboard(message.answer)}
            >
              copy
            </button>
          </div>

          {/* Evidence 영역 */}
          {message.evidence && message.evidence.length > 0 && (
            <div style={{ marginTop: '4px' }}>
              <strong>Evidence:</strong>
              <ul style={{ paddingLeft: '20px' }}>
                {message.evidence.map((evi, idx) => (
                  <li key={idx} style={{ whiteSpace: 'pre-wrap', marginBottom: '4px' }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                      <div style={{ flex: 1 }}>{evi}</div>
                      <button
                        className="copy-button"
                        style={{ alignSelf: 'flex-start' }}
                        onClick={() => copyToClipboard(evi)}
                      >
                        copy
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </>
      ) : (
        <div style={{ marginTop: '4px', fontStyle: 'italic' }}>
          (Answer collapsed)
        </div>
      )}

      {/* 과거 메시지는 접었다/펼칠 수 있도록 토글 버튼 */}
      {!isLatest && (
        <button onClick={onToggle} style={{ marginTop: '4px' }}>
          {message.expanded ? 'Collapse' : 'Expand'}
        </button>
      )}

      {/* 전체 복사 버튼 (질문+답변+근거) */}
      <button className="copy-button" onClick={handleCopyAll} style={{ marginTop: '4px' }}>
        Copy All
      </button>
    </div>
  );
};

function ChatBot({ paperId, data }) {
  // 대화 내역
  const [question, setQuestion] = useState('');
  const [conversation, setConversation] = useState([]);

  const handleAsk = async () => {
    if (!question.trim()) return;
    try {
      const payload = data 
        ? { content: data, userQuestion: question }
        : { paperId, userQuestion: question };
      const response = await api.post('/chat', payload);

      const newMessage = {
        question: question,
        answer: response.data.answer,
        evidence: response.data.evidence || [],
        expanded: true, // 최신 메시지는 기본적으로 펼쳐짐
      };
      setConversation([...conversation, newMessage]);
      setQuestion('');
    } catch (error) {
      console.error('Chat error:', error);
    }
  };

  const toggleMessage = (index) => {
    setConversation(prev => {
      const updated = [...prev];
      updated[index].expanded = !updated[index].expanded;
      return updated;
    });
  };

  return (
    <div>
      {/* 누적 대화 출력 */}
      <div>
        {conversation.map((msg, index) => (
          <ChatMessage
            key={index}
            message={msg}
            isLatest={index === conversation.length - 1}
            onToggle={() => toggleMessage(index)}
          />
        ))}
      </div>

      {/* 질문 입력 */}
      <input
        type="text"
        placeholder="Ask a question about this paper..."
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        style={{ width: '100%', marginTop: '8px' }}
      />
      <button onClick={handleAsk}>Ask</button>
    </div>
  );
}

export default ChatBot;
