import React from 'react';

export default function DecisionTree({ catalysts, decision }) {
  if (!catalysts || !catalysts.whatWouldChangeDecision) return null;

  const decisionColor = decision === 'INVEST' ? 'var(--success-color)' : decision === 'PASS' ? 'var(--danger-color)' : 'var(--warning-color)';

  return (
    <div className="decision-tree-container glass-card">
      <div className="section-title"><span className="icon">🌳</span> AI Decision Logic</div>
      
      <div className="tree-flow">
        {/* Step 1: Input */}
        <div className="tree-node input-node">
          <div className="node-icon">📥</div>
          <div className="node-label">
            <strong>Current Factors:</strong>
            <ul className="catalyst-list" style={{ marginTop: '0.5rem', textAlign: 'left' }}>
              {catalysts.currentTopFactors?.map((f, i) => (
                <li key={i}>{f}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="tree-connector">↓</div>

        {/* Step 2: Processing */}
        <div className="tree-node processing-node">
          <div className="node-icon">🧠</div>
          <div className="node-label">Chief Analyst Synthesis</div>
        </div>

        <div className="tree-connector">↓</div>

        {/* Step 3: Decision */}
        <div className="tree-node decision-node" style={{ borderColor: decisionColor }}>
          <div className="node-label" style={{ color: decisionColor, fontWeight: 'bold', fontSize: '1.2rem' }}>
            {decision}
          </div>
        </div>

        <div className="tree-connector dashed">↓</div>

        {/* Step 4: Catalysts (What would change the mind) */}
        <div className="tree-node catalyst-node">
          <div className="node-header">What would change this decision?</div>
          <ul className="catalyst-list">
            {catalysts.whatWouldChangeDecision.map((cat, i) => (
              <li key={i}>{cat}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
