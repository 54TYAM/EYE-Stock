export default function NewsList({ news }) {
  if (!news || news.length === 0) return null;

  return (
    <div className="news-card glass-card">
      <div className="section-title">
        <span className="icon">📰</span> Recent News (Last 30 Days)
      </div>

      <ul className="news-list">
        {news.map((item, i) => (
          <li key={i} className="news-item">
            <h3 className="news-headline">
              <a href={item.url} target="_blank" rel="noopener noreferrer">
                {item.headline}
              </a>
            </h3>
            {item.summary && <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: 'var(--space-xs)' }}>{item.summary}</p>}
            <div className="news-meta">
              <span>{item.source}</span> • <span>{new Date(item.datetime).toLocaleDateString()}</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
