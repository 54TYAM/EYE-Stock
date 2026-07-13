export default function DecisionBanner({ decision, confidence }) {
  const isInvest = decision === 'INVEST';

  return (
    <div className={`decision-banner glass-card ${isInvest ? 'invest' : 'pass'}`}>
      <div className="decision-label">AI Recommendation</div>
      <div className="decision-text">
        {isInvest ? '✅' : '❌'} {decision}
      </div>
      <div className="confidence-badge">
        <span>Confidence:</span>
        <strong>{confidence}%</strong>
      </div>
    </div>
  );
}
