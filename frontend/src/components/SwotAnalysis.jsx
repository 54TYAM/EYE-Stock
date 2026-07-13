export default function SwotAnalysis({ swot }) {
  if (!swot) return null;

  return (
    <div className="swot-container glass-card">
      <div className="section-title">
        <span className="icon">🎯</span> SWOT Analysis
      </div>
      
      <div className="swot-grid">
        <div className="swot-quadrant strengths">
          <h4>Strengths</h4>
          <ul>
            {swot.strengths.map((item, i) => <li key={i}>✓ {item}</li>)}
          </ul>
        </div>
        <div className="swot-quadrant weaknesses">
          <h4>Weaknesses</h4>
          <ul>
            {swot.weaknesses.map((item, i) => <li key={i}>✗ {item}</li>)}
          </ul>
        </div>
        <div className="swot-quadrant opportunities">
          <h4>Opportunities</h4>
          <ul>
            {swot.opportunities.map((item, i) => <li key={i}>↗ {item}</li>)}
          </ul>
        </div>
        <div className="swot-quadrant threats">
          <h4>Threats</h4>
          <ul>
            {swot.threats.map((item, i) => <li key={i}>⚠ {item}</li>)}
          </ul>
        </div>
      </div>
    </div>
  );
}
