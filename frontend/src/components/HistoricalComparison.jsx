import { useState, useEffect } from 'react';

export default function HistoricalComparison({ currentAnalysis }) {
  const [previousAnalysis, setPreviousAnalysis] = useState(null);

  useEffect(() => {
    if (!currentAnalysis || !currentAnalysis.company) return;
    
    const ticker = currentAnalysis.company.ticker;
    const historyKey = `history_${ticker}`;
    
    // Check for previous analysis
    const stored = localStorage.getItem(historyKey);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        // Only show comparison if it's actually older (for this demo, we'll just check if it exists and has a different score)
        if (parsed && parsed.overallScore !== currentAnalysis.analysis.overallScore) {
          setPreviousAnalysis(parsed);
        }
      } catch (e) {
        console.error('Failed to parse history:', e);
      }
    }

    // Save current analysis for next time
    localStorage.setItem(historyKey, JSON.stringify({
      overallScore: currentAnalysis.analysis.overallScore,
      decision: currentAnalysis.analysis.decision,
      date: new Date().toISOString(),
    }));
  }, [currentAnalysis]);

  if (!previousAnalysis) return null;

  const scoreDiff = currentAnalysis.analysis.overallScore - previousAnalysis.overallScore;
  const isBetter = scoreDiff > 0;
  
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="historical-comparison glass-card">
      <div className="section-title"><span className="icon">⏱️</span> Historical Trend</div>
      <p className="history-subtitle">Compared to your last analysis on {formatDate(previousAnalysis.date)}</p>
      
      <div className="history-grid">
        <div className="history-card">
          <div className="history-label">Previous Score</div>
          <div className="history-value">{previousAnalysis.overallScore}</div>
          <div className="history-decision">{previousAnalysis.decision}</div>
        </div>
        
        <div className="history-arrow">➔</div>
        
        <div className="history-card current">
          <div className="history-label">Current Score</div>
          <div className="history-value">{currentAnalysis.analysis.overallScore}</div>
          <div className={`history-diff ${isBetter ? 'positive' : 'negative'}`}>
            {isBetter ? '↗' : '↘'} {Math.abs(scoreDiff)} pts
          </div>
        </div>
      </div>
    </div>
  );
}
