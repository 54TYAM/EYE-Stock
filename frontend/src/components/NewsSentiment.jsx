export default function NewsSentiment({ sentiment }) {
  if (!sentiment) return null;

  return (
    <div className="sentiment-card glass-card">
      <div className="section-title">
        <span className="icon">📰</span> News Sentiment: {sentiment.overall}
      </div>

      <div className="sentiment-bar-container">
        <div 
          className="sentiment-segment positive" 
          style={{ width: `${sentiment.breakdown.positive}%` }}
          title={`Positive: ${sentiment.breakdown.positive}%`}
        >
          {sentiment.breakdown.positive > 10 && `${sentiment.breakdown.positive}%`}
        </div>
        <div 
          className="sentiment-segment neutral" 
          style={{ width: `${sentiment.breakdown.neutral}%` }}
          title={`Neutral: ${sentiment.breakdown.neutral}%`}
        >
          {sentiment.breakdown.neutral > 10 && `${sentiment.breakdown.neutral}%`}
        </div>
        <div 
          className="sentiment-segment negative" 
          style={{ width: `${sentiment.breakdown.negative}%` }}
          title={`Negative: ${sentiment.breakdown.negative}%`}
        >
          {sentiment.breakdown.negative > 10 && `${sentiment.breakdown.negative}%`}
        </div>
      </div>

      <p className="sentiment-reason">
        <strong>AI Takeaway:</strong> {sentiment.reason}
      </p>
    </div>
  );
}
