import { useState } from 'react';
import ReactMarkdown from 'react-markdown';

export default function MemoModal({ analysisData, isOpen, onClose }) {
  const [memoHtml, setMemoHtml] = useState('');
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleGenerate = async () => {
    setGenerating(true);
    setError('');
    
    try {
      const res = await fetch('http://localhost:3001/api/memo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ analysisData }),
      });
      
      const data = await res.json();
      
      if (!data.success) {
        setError(data.error || 'Failed to generate memo.');
      } else {
        setMemoHtml(data.memo);
      }
    } catch (err) {
      console.error(err);
      setError('Connection error while generating memo.');
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content memo-modal glass-card">
        <div className="modal-header">
          <h2>Investment Memo: {analysisData?.company?.ticker}</h2>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>
        
        <div className="modal-body">
          {!memoHtml && !generating && !error && (
            <div className="memo-placeholder">
              <p>Generate a professional, one-page investment memo for {analysisData?.company?.name}.</p>
              <button className="generate-memo-btn" onClick={handleGenerate}>
                📄 Generate Memo
              </button>
            </div>
          )}

          {generating && (
            <div className="memo-loading">
              <div className="timeline-dot"><span className="dot-pulse" /></div>
              <p>Drafting memo...</p>
            </div>
          )}

          {error && <p className="error-message">{error}</p>}

          {memoHtml && !generating && (
            <div className="memo-document">
              <div className="memo-actions no-print">
                <button className="export-btn" onClick={() => window.print()}>🖨️ Print PDF</button>
              </div>
              <div className="memo-markdown">
                <ReactMarkdown>{memoHtml}</ReactMarkdown>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
