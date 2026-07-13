export default function CausalReasoning({ catalysts, decision }) {
  if (!catalysts) return null;

  const isInvest = decision === 'INVEST';

  return (
    <div className="causal-card glass-card">
      <div className="section-title">
        <span className="icon">🔮</span> Decision Drivers & Catalysts
      </div>
      
      <div className="causal-grid">
        <div className="causal-section">
          <h4 style={{ color: isInvest ? 'var(--success-color)' : 'var(--danger-color)' }}>
            Top Factors Driving Current Decision ({decision})
          </h4>
          <ul>
            {catalysts.currentTopFactors.map((factor, i) => (
              <li key={i}>{factor}</li>
            ))}
          </ul>
        </div>
        
        <div className="causal-section">
          <h4 style={{ color: isInvest ? 'var(--danger-color)' : 'var(--success-color)' }}>
            What Would Change My Decision to {isInvest ? 'PASS' : 'INVEST'}?
          </h4>
          <ul>
            {catalysts.whatWouldChangeDecision.map((factor, i) => (
              <li key={i}>{factor}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
