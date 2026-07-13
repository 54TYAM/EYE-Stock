export default function ConfidenceMeter({ confidence, evidence }) {
  if (!evidence) return null;

  const qualityColor = {
    High: 'var(--success-color)',
    Medium: '#f39c12',
    Low: 'var(--danger-color)',
  };

  return (
    <div className="confidence-card glass-card">
      <div className="section-title">
        <span className="icon">🎯</span> AI Confidence Meter
      </div>

      <div className="confidence-gauge-row">
        <div className="confidence-ring">
          <svg viewBox="0 0 120 120" className="confidence-svg">
            <circle cx="60" cy="60" r="52" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="8" />
            <circle
              cx="60" cy="60" r="52"
              fill="none"
              stroke={qualityColor[evidence.quality] || 'var(--primary-color)'}
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={`${(confidence / 100) * 327} 327`}
              transform="rotate(-90 60 60)"
              className="confidence-arc"
            />
          </svg>
          <div className="confidence-ring-value">{confidence}%</div>
        </div>

        <div className="confidence-details">
          <div className="confidence-quality">
            <span>Evidence Quality:</span>
            <span className="quality-badge" style={{ color: qualityColor[evidence.quality] }}>
              {evidence.quality}
            </span>
          </div>
          <ul className="confidence-factors">
            {evidence.factors.map((factor, i) => (
              <li key={i}>{factor}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
