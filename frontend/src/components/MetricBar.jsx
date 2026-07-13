export default function MetricBar({ label, score }) {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    stars.push(
      <span key={i} className={`star ${i <= score ? 'filled' : 'empty'}`}>
        ★
      </span>
    );
  }

  return (
    <div className="metric-row">
      <span className="metric-label">{label}</span>
      <div className="metric-stars">{stars}</div>
    </div>
  );
}
