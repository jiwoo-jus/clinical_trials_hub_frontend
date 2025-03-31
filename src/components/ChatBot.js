// src/components/ChatBot.js
import React, { useState } from 'react';
import api from '../api';

function ChatBot({ paperId }) {
  const [question, setQuestion] = useState('');
  const [chatResult, setChatResult] = useState(null);

  const handleAsk = async () => {
    try {
      const response = await api.post('/chat', { paperId, userQuestion: question });
      setChatResult(response.data);
    } catch (error) {
      console.error('Chat error:', error);
    }
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Ask a question about this paper..."
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        style={{ width: '100%' }}
      />
      <button onClick={handleAsk}>Ask</button>
      {chatResult && (
        <div style={{ marginTop: '1rem' }}>
          <p><strong>Answer:</strong> {chatResult.answer}</p>
          {chatResult.evidence && chatResult.evidence.length > 0 && (
            <div>
              <strong>Evidence:</strong>
              <ul>
                {chatResult.evidence.map((evi, idx) => <li key={idx}>{evi}</li>)}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default ChatBot;
