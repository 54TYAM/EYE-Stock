export default function DebatePanel({ debate }) {
  if (!debate) return null;

  return (
    <div className="debate-container">
      <div className="section-title" style={{ width: '100%' }}>
        <span className="icon">⚖️</span> Bull vs Bear AI Debate
      </div>
      
      <div className="debate-grid">
        <div className="debate-card bull-card glass-card">
          <div className="debate-header">
            <h3>🟢 AI Bull</h3>
          </div>
          <ul className="debate-list">
            {debate.bull.arguments.map((arg, i) => (
              <li key={i}>{arg}</li>
            ))}
          </ul>
        </div>

        <div className="debate-card bear-card glass-card">
          <div className="debate-header">
            <h3>🔴 AI Bear</h3>
          </div>
          <ul className="debate-list">
            {debate.bear.arguments.map((arg, i) => (
              <li key={i}>{arg}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="chief-analyst-card glass-card">
        <div className="debate-header">
          <h3>👔 Chief AI Analyst Synthesis</h3>
        </div>
        <p>{debate.chiefAnalystSynthesis}</p>
      </div>
    </div>
  );
}
