export default function RiskBreakdown({ riskBreakdown }) {
  if (!riskBreakdown) return null;

  const risks = [
    { label: 'Market Risk', value: riskBreakdown.market, icon: '📉' },
    { label: 'Financial Risk', value: riskBreakdown.financial, icon: '💰' },
    { label: 'Execution Risk', value: riskBreakdown.execution, icon: '⚙️' },
    { label: 'Regulatory Risk', value: riskBreakdown.regulatory, icon: '📜' },
  ];

  const getColor = (val) => {
    if (val <= 30) return 'var(--success-color)';
    if (val <= 60) return '#f39c12';
    return 'var(--danger-color)';
  };

  return (
    <div className="risk-breakdown-card glass-card">
      <div className="section-title">
        <span className="icon">🛡️</span> Risk Breakdown
      </div>

      <div className="risk-gauges">
        {risks.map((risk, i) => (
          <div key={i} className="risk-gauge-item">
            <div className="risk-gauge-header">
              <span>{risk.icon} {risk.label}</span>
              <span style={{ color: getColor(risk.value), fontFamily: 'var(--font-mono)' }}>
                {risk.value}%
              </span>
            </div>
            <div className="risk-gauge-track">
              <div
                className="risk-gauge-fill"
                style={{
                  width: `${risk.value}%`,
                  backgroundColor: getColor(risk.value),
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
