import CitationText from './CitationText';

export default function RiskList({ risks }) {
  if (!risks || risks.length === 0) return null;

  return (
    <div className="risks-card glass-card">
      <div className="section-title">
        <span className="icon">⚠️</span> Risk Factors
      </div>

      <ul className="risks-list">
        {risks.map((risk, i) => (
          <li key={i} className="risk-item">
            <span className="bullet">▲</span>
            <span><CitationText text={risk} /></span>
          </li>
        ))}
      </ul>
    </div>
  );
}
