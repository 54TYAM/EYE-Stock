import { useEffect, useState } from 'react';

export default function ScoreGauge({ score }) {
  const [animatedScore, setAnimatedScore] = useState(0);

  useEffect(() => {
    // Animate score from 0 to target
    const timer = setTimeout(() => setAnimatedScore(score), 100);
    return () => clearTimeout(timer);
  }, [score]);

  const radius = 58;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (animatedScore / 100) * circumference;

  // Color based on score
  const getColor = (s) => {
    if (s >= 70) return 'var(--invest-color)';
    if (s >= 40) return 'var(--warning-color)';
    return 'var(--pass-color)';
  };

  return (
    <div className="gauge-container">
      <svg className="gauge-svg" viewBox="0 0 140 140">
        <circle className="gauge-bg" cx="70" cy="70" r={radius} />
        <circle
          className="gauge-fill"
          cx="70"
          cy="70"
          r={radius}
          stroke={getColor(animatedScore)}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
      </svg>
      <div className="gauge-value" style={{ color: getColor(animatedScore) }}>
        {animatedScore}
      </div>
    </div>
  );
}
