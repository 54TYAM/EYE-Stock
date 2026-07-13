import CitationText from './CitationText';

export default function ReasoningPanel({ reasons, reasoning }) {
  return (
    <div className="reasoning-card glass-card">
      <div className="section-title">
        <span className="icon">💡</span> Key Reasons
      </div>

      <ul className="reasons-list">
        {reasons.map((reason, i) => (
          <li key={i} className="reason-item">
            <span className="bullet">✦</span>
            <span><CitationText text={reason} /></span>
          </li>
        ))}
      </ul>

      {reasoning && (
        <>
          <div className="section-title" style={{ marginTop: 'var(--space-xl)' }}>
            <span className="icon">🧠</span> Detailed Analysis
          </div>
          <p className="reasoning-text"><CitationText text={reasoning} /></p>
        </>
      )}
    </div>
  );
}
