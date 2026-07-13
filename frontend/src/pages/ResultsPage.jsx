import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, FileText, Printer, BarChart3, ArrowUp, ArrowDown } from 'lucide-react';
import ExecutiveSummary from '../components/ExecutiveSummary';
import MemoModal from '../components/MemoModal';
import HistoricalComparison from '../components/HistoricalComparison';
import DecisionTree from '../components/DecisionTree';
import DecisionBanner from '../components/DecisionBanner';
import ScoreGauge from '../components/ScoreGauge';
import MetricBar from '../components/MetricBar';
import ConfidenceMeter from '../components/ConfidenceMeter';
import RiskBreakdown from '../components/RiskBreakdown';
import ScoreBreakdown from '../components/ScoreBreakdown';
import ScenarioAnalysis from '../components/ScenarioAnalysis';
import ReasoningPanel from '../components/ReasoningPanel';
import RiskList from '../components/RiskList';
import SourcesList from '../components/SourcesList';
import NewsList from '../components/NewsList';
import DebatePanel from '../components/DebatePanel';
import SwotAnalysis from '../components/SwotAnalysis';
import NewsSentiment from '../components/NewsSentiment';
import ExplainSimple from '../components/ExplainSimple';
import CausalReasoning from '../components/CausalReasoning';
import RevenueChart from '../components/RevenueChart';
import FollowUpChat from '../components/FollowUpChat';
import PromptTransparency from '../components/PromptTransparency';

export default function ResultsPage({ analysisData, setAnalysisData }) {
  const navigate = useNavigate();
  const [isMemoOpen, setIsMemoOpen] = useState(false);

  if (!analysisData) {
    return (
      <div className="loading-page">
        <div className="error-card glass-card">
          <div className="error-icon"><Search size={48} color="var(--text-muted)" /></div>
          <p className="error-message">No analysis data found. Please search for a company first.</p>
          <button className="back-btn" onClick={() => navigate('/')}>
            ← Go to Search
          </button>
        </div>
      </div>
    );
  }

  const { company, profile, financials, marketData, news, analysis, agentReports } = analysisData;

  const handleNewSearch = () => {
    setAnalysisData(null);
    navigate('/');
  };

  const formatMarketCap = (cap) => {
    if (!cap || cap === 'N/A') return 'N/A';
    if (cap >= 1e12) return `$${(cap / 1e12).toFixed(2)}T`;
    if (cap >= 1e9) return `$${(cap / 1e9).toFixed(2)}B`;
    if (cap >= 1e6) return `$${(cap / 1e6).toFixed(2)}M`;
    return `$${cap.toLocaleString()}`;
  };

  return (
    <div className={`page-container results-page ${isMemoOpen ? 'memo-open' : ''}`}>
      {/* Header */}
      <div className="results-header animate-in">
        <div>
          <h1 className="results-company-name">{company?.name || 'Unknown'}</h1>
          <span className="results-ticker">
            {company?.ticker || '???'} · {company?.exchange || ''}
          </span>
        </div>
        <div className="header-actions no-print" style={{ display: 'flex', gap: '0.5rem' }}>
          <button className="export-btn" onClick={() => setIsMemoOpen(true)}>
            <FileText size={16} /> Generate Memo
          </button>
          <button className="export-btn" onClick={() => window.print()}>
            <Printer size={16} /> Export PDF
          </button>
        </div>
      </div>

      {/* Executive Summary */}
      <div className="animate-in animate-in-1">
        <ExecutiveSummary analysis={analysis} company={company} marketData={marketData} />
      </div>

      {/* Decision Banner */}
      <div className="animate-in animate-in-1">
        <DecisionBanner decision={analysis.decision} confidence={analysis.confidence} />
      </div>

      {/* Scores + Confidence Row */}
      <div className="scores-confidence-row animate-in animate-in-2">
        <div className="scores-grid">
          <div className="score-card glass-card">
            <ScoreGauge score={analysis.overallScore} />
            <div className="gauge-label">Overall Score</div>
          </div>
          <div className="metrics-card glass-card">
            <div className="section-title"><span className="icon"><BarChart3 size={20} /></span> Category Scores</div>
            <MetricBar label="Financial Health" score={analysis.scores.financialHealth} />
            <MetricBar label="Growth Potential" score={analysis.scores.growthPotential} />
            <MetricBar label="Risk Level" score={analysis.scores.riskLevel} />
            <MetricBar label="Market Position" score={analysis.scores.marketPosition} />
          </div>
        </div>
        <ConfidenceMeter confidence={analysis.confidence} evidence={analysis.confidenceEvidence} />
      </div>

      {/* Score Breakdown (Waterfall) */}
      <div className="animate-in animate-in-2">
        <ScoreBreakdown breakdown={analysis.scoreBreakdown} overallScore={analysis.overallScore} />
      </div>

      {/* Historical Comparison */}
      <div className="animate-in animate-in-3">
        <HistoricalComparison currentAnalysis={analysisData} />
      </div>

      {/* Company Info Bar */}
      {(profile || marketData) && (
        <div className="company-info-bar glass-card animate-in animate-in-3">
          {marketData?.currentPrice && (
            <div className="info-item">
              <div className="info-label">Price</div>
              <div className="info-value">${marketData.currentPrice}</div>
            </div>
          )}
          {marketData?.marketCap && (
            <div className="info-item">
              <div className="info-label">Market Cap</div>
              <div className="info-value">{formatMarketCap(marketData.marketCap)}</div>
            </div>
          )}
          {marketData?.peRatio && (
            <div className="info-item">
              <div className="info-label">P/E Ratio</div>
              <div className="info-value">{marketData.peRatio}</div>
            </div>
          )}
          {profile?.sector && (
            <div className="info-item">
              <div className="info-label">Sector</div>
              <div className="info-value" style={{ fontFamily: 'var(--font-main)', fontSize: '0.85rem' }}>
                {profile.sector}
              </div>
            </div>
          )}
          {profile?.industry && (
            <div className="info-item">
              <div className="info-label">Industry</div>
              <div className="info-value" style={{ fontFamily: 'var(--font-main)', fontSize: '0.8rem' }}>
                {profile.industry}
              </div>
            </div>
          )}
          {profile?.employees && (
            <div className="info-item">
              <div className="info-label">Employees</div>
              <div className="info-value">
                {typeof profile.employees === 'number' ? profile.employees.toLocaleString() : profile.employees}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Key Reasons */}
      <div className="animate-in animate-in-4">
        <ReasoningPanel reasons={analysis.reasons} reasoning={analysis.reasoning} />
      </div>

      {/* Explain Like I'm 15 */}
      <div className="animate-in animate-in-4">
        <ExplainSimple text={analysis.eli15} />
      </div>

      {/* Decision Tree */}
      <div className="animate-in animate-in-4">
        <DecisionTree catalysts={analysis.decisionCatalysts} decision={analysis.decision} />
      </div>

      {/* Debate Panel */}
      <div className="animate-in animate-in-5">
        <DebatePanel debate={analysis.debate} />
      </div>

      {/* SWOT Analysis */}
      <div className="animate-in animate-in-5">
        <SwotAnalysis swot={analysis.swot} />
      </div>

      {/* Causal Reasoning */}
      <div className="animate-in animate-in-5">
        <CausalReasoning catalysts={analysis.decisionCatalysts} decision={analysis.decision} />
      </div>

      {/* Scenario Analysis */}
      <div className="animate-in animate-in-5">
        <ScenarioAnalysis scenarios={analysis.scenarios} />
      </div>

      {/* Revenue Chart */}
      <div className="animate-in animate-in-5">
        <RevenueChart financials={financials} />
      </div>

      {/* Risk Breakdown */}
      <div className="animate-in animate-in-6">
        <RiskBreakdown riskBreakdown={analysis.riskBreakdown} />
      </div>

      {/* Risks */}
      <div className="animate-in animate-in-6">
        <RiskList risks={analysis.risks} />
      </div>

      {/* News Sentiment */}
      <div className="animate-in animate-in-6">
        <NewsSentiment sentiment={analysis.newsSentiment} />
      </div>

      {/* Sources */}
      <div className="animate-in animate-in-6">
        <SourcesList sources={analysis.sources} />
      </div>

      {/* News Articles */}
      <div className="animate-in animate-in-6">
        <NewsList news={news} />
      </div>

      {/* AI Methodology & Transparency */}
      <div className="animate-in animate-in-6 no-print">
        <PromptTransparency agentReports={agentReports} />
      </div>

      {/* AI Follow-up Chat */}
      <div className="animate-in animate-in-6 no-print">
        <FollowUpChat analysisData={analysisData} />
      </div>

      {/* Back Button */}
      <div style={{ textAlign: 'center', marginTop: '2rem' }} className="animate-in animate-in-6 no-print">
        <button className="back-btn" onClick={handleNewSearch}><Search size={14} /> Analyze Another Company</button>
      </div>

      {/* Floating Scroll Controls */}
      <div className="floating-scroll-controls no-print">
        <button 
          className="floating-scroll-btn" 
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          title="Scroll to Top"
        >
          <ArrowUp size={20} />
        </button>
        <button 
          className="floating-scroll-btn" 
          onClick={() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })}
          title="Scroll to Bottom"
        >
          <ArrowDown size={20} />
        </button>
      </div>

      <MemoModal 
        analysisData={analysisData} 
        isOpen={isMemoOpen} 
        onClose={() => setIsMemoOpen(false)} 
      />
    </div>
  );
}
