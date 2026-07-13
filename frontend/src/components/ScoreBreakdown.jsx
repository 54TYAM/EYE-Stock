export default function ScoreBreakdown({ breakdown, overallScore }) {
  if (!breakdown) return null;

  const items = [
    { label: 'Financial Health', value: breakdown.financialHealth, icon: '💰' },
    { label: 'Growth Potential', value: breakdown.growthPotential, icon: '📈' },
    { label: 'News Sentiment', value: breakdown.newsSentiment, icon: '📰' },
    { label: 'Competitive Position', value: breakdown.competitivePosition, icon: '🏆' },
    { label: 'Risk Adjustment', value: breakdown.riskAdjustment, icon: '⚠️' },
    { label: 'Valuation Adjustment', value: breakdown.valuationAdjustment, icon: '💲' },
  ];

  return (
    <div className="score-breakdown-card glass-card">
      <div className="section-title">
        <span className="icon">🧮</span> How the Score is Calculated
      </div>

      <div className="score-waterfall">
        {items.map((item, i) => (
          <div key={i} className="waterfall-row">
            <span className="waterfall-label">{item.icon} {item.label}</span>
            <div className="waterfall-bar-track">
              <div
                className={`waterfall-bar ${item.value >= 0 ? 'positive' : 'negative'}`}
                style={{ width: `${Math.min(Math.abs(item.value) * 2.5, 100)}%` }}
              />
            </div>
            <span className={`waterfall-value ${item.value >= 0 ? 'positive' : 'negative'}`}>
              {item.value >= 0 ? '+' : ''}{item.value}
            </span>
          </div>
        ))}

        <div className="waterfall-total">
          <span>Total Score</span>
          <span className="waterfall-total-value">{overallScore}/100</span>
        </div>
      </div>
    </div>
  );
}
