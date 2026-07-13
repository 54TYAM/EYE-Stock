import { useState } from 'react';

export default function FollowUpChat({ analysisData }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const suggestedQuestions = [
    'Why did you rate risk this way?',
    'What is the biggest concern?',
    'Should I invest for the short term?',
    'Compare this to its competitors.',
  ];

  const handleSend = async (question) => {
    const q = question || input.trim();
    if (!q) return;

    setMessages((prev) => [...prev, { role: 'user', text: q }]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('http://localhost:3001/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: q,
          context: {
            company: analysisData.company,
            analysis: analysisData.analysis,
          },
        }),
      });

      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        { role: 'ai', text: data.success ? data.answer : 'Sorry, I could not generate a response.' },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: 'ai', text: 'Could not connect to the server.' },
      ]);
    }

    setLoading(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="chat-card glass-card">
      <div className="section-title">
        <span className="icon">💬</span> Ask AI Analyst
      </div>

      {messages.length === 0 && (
        <div className="chat-suggestions">
          {suggestedQuestions.map((q, i) => (
            <button key={i} className="chat-suggestion-btn" onClick={() => handleSend(q)}>
              {q}
            </button>
          ))}
        </div>
      )}

      <div className="chat-messages">
        {messages.map((msg, i) => (
          <div key={i} className={`chat-msg ${msg.role}`}>
            <span className="chat-msg-label">{msg.role === 'user' ? 'You' : '🤖 AI'}</span>
            <p>{msg.text}</p>
          </div>
        ))}
        {loading && (
          <div className="chat-msg ai">
            <span className="chat-msg-label">🤖 AI</span>
            <p className="chat-typing">Thinking...</p>
          </div>
        )}
      </div>

      <div className="chat-input-row">
        <input
          type="text"
          className="chat-input"
          placeholder="Ask about this company..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={loading}
        />
        <button className="chat-send-btn" onClick={() => handleSend()} disabled={loading || !input.trim()}>
          Send
        </button>
      </div>
    </div>
  );
}
