export default function ScenarioAnalysis({ scenarios }) {
  if (!scenarios || scenarios.length === 0) return null;

  const decisionColor = {
    INVEST: 'var(--success-color)',
    HOLD: '#f39c12',
    PASS: 'var(--danger-color)',
  };

  const decisionIcon = {
    INVEST: '🟢',
    HOLD: '🟡',
    PASS: '🔴',
  };

  return (
    <div className="scenarios-card glass-card">
      <div className="section-title">
        <span className="icon">🔮</span> Alternative Scenarios
      </div>

      <div className="scenarios-grid">
        {scenarios.map((s, i) => (
          <div key={i} className="scenario-item">
            <div className="scenario-name">{s.name}</div>
            <div className="scenario-assumption">{s.assumption}</div>
            <div className="scenario-result">
              <span style={{ color: decisionColor[s.decision] }}>
                {decisionIcon[s.decision]} {s.decision}
              </span>
              <span className="scenario-score">Score: {s.score}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
