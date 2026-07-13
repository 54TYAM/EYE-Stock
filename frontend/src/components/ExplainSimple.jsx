export default function ExplainSimple({ text }) {
  if (!text) return null;

  return (
    <div className="eli15-card glass-card">
      <div className="section-title">
        <span className="icon">🧠</span> Explain Like I'm 15
      </div>
      <p style={{ fontSize: '1.1rem', lineHeight: '1.6', fontStyle: 'italic' }}>
        "{text}"
      </p>
    </div>
  );
}
