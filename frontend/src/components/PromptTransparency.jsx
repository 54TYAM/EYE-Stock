import { useState } from 'react';

export default function PromptTransparency({ agentReports }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="transparency-card glass-card">
      <button className="transparency-toggle" onClick={() => setExpanded(!expanded)}>
        <span className="section-title" style={{ margin: 0 }}>
          <span className="icon">🔍</span> AI Methodology & Agent Architecture
        </span>
        <span className="toggle-arrow">{expanded ? '▲' : '▼'}</span>
      </button>

      {expanded && (
        <div className="transparency-content">
          <div className="methodology-section">
            <h4>Multi-Agent Architecture</h4>
            <p>This analysis was produced by a team of 4 specialized AI agents working in parallel:</p>
            <div className="agent-flow">
              <div className="agent-node orchestrator">📐 Orchestrator</div>
              <div className="agent-arrow">↓</div>
              <div className="agent-row">
                <div className="agent-node data">📊 Data Collection</div>
              </div>
              <div className="agent-arrow">↓</div>
              <div className="agent-row parallel">
                <div className="agent-node specialist">💰 Financial<br/>Analyst</div>
                <div className="agent-node specialist">📰 News<br/>Analyst</div>
                <div className="agent-node specialist">🛡️ Risk<br/>Analyst</div>
              </div>
              <div className="agent-arrow">↓</div>
              <div className="agent-node chief">👔 Chief Analyst</div>
            </div>
          </div>

          <div className="methodology-section">
            <h4>Data Sources</h4>
            <ul>
              <li><strong>Yahoo Finance API</strong> — Company profile, financial statements, market data, analyst ratings</li>
              <li><strong>Finnhub API</strong> — Real-time news articles and headlines (last 30 days)</li>
              <li><strong>Google Gemini 2.5 Flash</strong> — 4 separate LLM calls for specialized analysis</li>
            </ul>
          </div>

          <div className="methodology-section">
            <h4>Analysis Process</h4>
            <ol>
              <li>Resolve company name → stock ticker symbol</li>
              <li>Fetch profile, financials, market data, and news in sequence</li>
              <li>Fan out to 3 specialist agents <strong>in parallel</strong></li>
              <li>Each specialist produces an independent sub-report</li>
              <li>Chief Analyst synthesizes all sub-reports + raw data into the final recommendation</li>
              <li>Output is validated against a strict Zod schema before rendering</li>
            </ol>
          </div>

          {agentReports && (
            <div className="methodology-section">
              <h4>Sub-Agent Reports</h4>
              {agentReports.financial && (
                <div className="sub-report">
                  <strong>💰 Financial Analyst:</strong> Health {agentReports.financial.healthScore}/100, 
                  Growth {agentReports.financial.growthScore}/100, 
                  Valuation {agentReports.financial.valuationScore}/100
                  <p className="sub-report-summary">{agentReports.financial.summary}</p>
                </div>
              )}
              {agentReports.news && (
                <div className="sub-report">
                  <strong>📰 News Analyst:</strong> {agentReports.news.overallSentiment} sentiment ({agentReports.news.sentimentScore}/100)
                  <p className="sub-report-summary">{agentReports.news.summary}</p>
                </div>
              )}
              {agentReports.risk && (
                <div className="sub-report">
                  <strong>🛡️ Risk Analyst:</strong> {agentReports.risk.overallRisk} overall risk
                  <p className="sub-report-summary">{agentReports.risk.summary}</p>
                </div>
              )}
            </div>
          )}

          <div className="methodology-section">
            <h4>Validation & Guardrails</h4>
            <ul>
              <li>All LLM outputs are parsed as JSON and validated against a Zod schema</li>
              <li>If any agent fails, the system gracefully continues with available data</li>
              <li>Conditional routing in LangGraph short-circuits on ticker resolution failures</li>
              <li>90-second timeout prevents runaway API calls</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
