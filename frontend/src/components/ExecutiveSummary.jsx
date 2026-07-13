export default function ExecutiveSummary({ analysis, company, marketData }) {
  if (!analysis) return null;

  const isInvest = analysis.decision === 'INVEST';

  return (
    <div className="executive-summary glass-card">
      <div className="exec-left">
        <h2 className="exec-company">{company?.name || 'Company'}</h2>
        <p className="exec-oneliner">{analysis.executiveSummary || analysis.reasoning?.substring(0, 120) + '...'}</p>
      </div>

      <div className="exec-metrics">
        <div className="exec-metric">
          <div className="exec-metric-label">Recommendation</div>
          <div className={`exec-metric-value ${isInvest ? 'invest' : 'pass'}`}>
            {isInvest ? '🟢' : '🔴'} {analysis.decision}
          </div>
        </div>
        <div className="exec-metric">
          <div className="exec-metric-label">Score</div>
          <div className="exec-metric-value">{analysis.overallScore}</div>
        </div>
        <div className="exec-metric">
          <div className="exec-metric-label">Confidence</div>
          <div className="exec-metric-value">{analysis.confidence}%</div>
        </div>
        <div className="exec-metric">
          <div className="exec-metric-label">Risk</div>
          <div className="exec-metric-value">
            {analysis.scores.riskLevel >= 4 ? '🟢 Low' : analysis.scores.riskLevel >= 3 ? '🟡 Medium' : '🔴 High'}
          </div>
        </div>
        <div className="exec-metric">
          <div className="exec-metric-label">Time Horizon</div>
          <div className="exec-metric-value">{analysis.timeHorizon || 'Long Term'}</div>
        </div>
      </div>
    </div>
  );
}
