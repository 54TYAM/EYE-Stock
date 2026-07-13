export default function RevenueChart({ financials }) {
  if (!financials || !financials.revenueHistory || financials.revenueHistory.length === 0) return null;

  // Find max revenue for scaling the bars
  const maxRevenue = Math.max(...financials.revenueHistory.map(r => r.revenue));

  const formatCurrency = (val) => {
    if (val >= 1e9) return `$${(val / 1e9).toFixed(1)}B`;
    if (val >= 1e6) return `$${(val / 1e6).toFixed(1)}M`;
    return `$${val.toLocaleString()}`;
  };

  // Sort history chronologically (assuming date strings like '2021-12-31' can be sorted alphabetically, or just reversed if it's new-to-old)
  const sortedHistory = [...financials.revenueHistory].reverse();

  return (
    <div className="chart-card glass-card">
      <div className="section-title">
        <span className="icon">📈</span> Revenue History
      </div>
      
      <div className="bar-chart">
        {sortedHistory.map((item, i) => {
          const heightPercent = Math.max((item.revenue / maxRevenue) * 100, 5); // min 5% height
          
          return (
            <div key={i} className="bar-container">
              <div className="bar-value">{formatCurrency(item.revenue)}</div>
              <div className="bar" style={{ height: `${heightPercent}%` }}>
                <div className="bar-fill"></div>
              </div>
              <div className="bar-label">{item.date}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
