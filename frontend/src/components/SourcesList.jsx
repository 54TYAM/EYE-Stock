export default function SourcesList({ sources }) {
  if (!sources || sources.length === 0) return null;

  return (
    <div className="sources-card glass-card">
      <div className="section-title">
        <span className="icon">📎</span> Data Sources
      </div>

      <ul className="sources-list">
        {sources.map((source, i) => (
          <li key={i} className="source-tag">
            {source}
          </li>
        ))}
      </ul>
    </div>
  );
}
