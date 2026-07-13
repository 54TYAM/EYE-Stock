import { StateGraph, Annotation } from '@langchain/langgraph';
import { ChatGroq } from '@langchain/groq';
import { resolveTicker } from './tools/tickerResolver.js';
import { fetchCompanyProfile } from './tools/companyProfile.js';
import { fetchFinancials } from './tools/financials.js';
import { fetchMarketData } from './tools/marketData.js';
import { fetchNews } from './tools/news.js';
import { SYSTEM_PROMPT, buildAnalysisPrompt } from './prompts.js';
import { InvestmentAnalysisSchema } from './schemas.js';

// ─── State Definition ────────────────────────────────────────────────
const AgentState = Annotation.Root({
  companyName: Annotation({ reducer: (_, v) => v, default: () => '' }),
  ticker: Annotation({ reducer: (_, v) => v, default: () => null }),
  tickerInfo: Annotation({ reducer: (_, v) => v, default: () => null }),
  profile: Annotation({ reducer: (_, v) => v, default: () => null }),
  financials: Annotation({ reducer: (_, v) => v, default: () => null }),
  marketData: Annotation({ reducer: (_, v) => v, default: () => null }),
  news: Annotation({ reducer: (_, v) => v, default: () => null }),
  // Multi-agent sub-reports
  financialReport: Annotation({ reducer: (_, v) => v, default: () => null }),
  newsReport: Annotation({ reducer: (_, v) => v, default: () => null }),
  riskReport: Annotation({ reducer: (_, v) => v, default: () => null }),
  // Final analysis
  analysisResult: Annotation({ reducer: (_, v) => v, default: () => null }),
  error: Annotation({ reducer: (_, v) => v, default: () => null }),
});

// ─── Helper: Create LLM Instance ─────────────────────────────────────
function createLLM(maxTokens = 2048, modelName = 'llama-3.3-70b-versatile') {
  return new ChatGroq({
    model: modelName,
    apiKey: process.env.GROQ_API_KEY,
    temperature: 0.3,
    maxTokens: maxTokens,
  });
}

// Helper: safely parse JSON from LLM response
function parseLLMJson(content) {
  let cleaned = content;
  const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
  if (jsonMatch) {
    cleaned = jsonMatch[1];
  } else {
    const firstBrace = cleaned.indexOf('{');
    const lastBrace = cleaned.lastIndexOf('}');
    if (firstBrace !== -1 && lastBrace !== -1 && lastBrace >= firstBrace) {
      cleaned = cleaned.slice(firstBrace, lastBrace + 1);
    }
  }
  
  // Replace literal newlines with space to prevent 'Bad control character' in string literals
  cleaned = cleaned.replace(/\n/g, ' ').replace(/\r/g, '');
  // Strip other bad control characters
  cleaned = cleaned.replace(/[\x00-\x1F\x7F-\x9F]/g, '');
  
  return JSON.parse(cleaned.trim());
}

// ─── Data Collection Nodes ───────────────────────────────────────────

async function resolveTickerNode(state) {
  console.log(`📍 [Orchestrator] Resolving ticker for "${state.companyName}"...`);
  const result = await resolveTicker(state.companyName);
  if (!result) {
    return {
      error: `Could not find a stock ticker for "${state.companyName}". Please try a different company name or use a ticker symbol directly.`,
    };
  }
  console.log(`   ✅ Found: ${result.ticker} (${result.name})`);
  return { ticker: result.ticker, tickerInfo: result };
}

async function fetchProfileNode(state) {
  if (state.error) return {};
  console.log(`📍 [Data Agent] Fetching company profile for ${state.ticker}...`);
  const profile = await fetchCompanyProfile(state.ticker);
  if (profile) console.log(`   ✅ Profile loaded: ${profile.name}`);
  else console.log(`   ⚠️ Profile unavailable, continuing...`);
  return { profile };
}

async function fetchFinancialsNode(state) {
  if (state.error) return {};
  console.log(`📍 [Data Agent] Fetching financial data for ${state.ticker}...`);
  const financials = await fetchFinancials(state.ticker);
  if (financials) console.log(`   ✅ Financials loaded`);
  else console.log(`   ⚠️ Financials unavailable, continuing...`);
  return { financials };
}

async function fetchMarketDataNode(state) {
  if (state.error) return {};
  console.log(`📍 [Data Agent] Fetching market data for ${state.ticker}...`);
  const marketData = await fetchMarketData(state.ticker);
  if (marketData) console.log(`   ✅ Market data loaded: $${marketData.currentPrice}`);
  else console.log(`   ⚠️ Market data unavailable, continuing...`);
  return { marketData };
}

async function fetchNewsNode(state) {
  if (state.error) return {};
  console.log(`📍 [Data Agent] Fetching recent news for ${state.ticker}...`);
  const news = await fetchNews(state.ticker);
  console.log(`   ✅ Found ${news.length} news articles`);
  return { news };
}

// ─── Specialist AI Agent Nodes ───────────────────────────────────────

/**
 * Financial Analyst Agent: Evaluates financial health independently.
 */
async function financialAnalystNode(state) {
  if (state.error) return {};
  console.log(`📍 [Financial Analyst Agent] Analyzing financial health...`);

  const llm = createLLM(512, 'llama-3.3-70b-versatile');
  const prompt = `You are a Financial Analyst specializing in corporate finance.

Analyze this company's financial health based on the data below and return a JSON object.

Company: ${state.companyName} (${state.ticker})
${state.financials ? `
Revenue: $${state.financials.latestRevenue}
Revenue Growth: ${state.financials.revenueGrowth}
Net Income: $${state.financials.netIncome}
Profit Margin: ${state.financials.profitMargin}
Operating Margin: ${state.financials.operatingMargin}
Return on Equity: ${state.financials.returnOnEquity}
Total Debt: $${state.financials.totalDebt}
Total Cash: $${state.financials.totalCash}
Debt-to-Equity: ${state.financials.debtToEquity}
Free Cash Flow: $${state.financials.freeCashflow}
` : 'Financial data unavailable.'}
${state.marketData ? `
Market Cap: $${state.marketData.marketCap}
P/E Ratio: ${state.marketData.peRatio}
Forward P/E: ${state.marketData.forwardPE}
` : ''}

Return ONLY this JSON:
{
  "healthScore": <number 0-100>,
  "growthScore": <number 0-100>,
  "valuationScore": <number 0-100>,
  "summary": "<2-3 sentence financial assessment>",
  "keyMetrics": ["metric1 with citation (Source)", "metric2 with citation (Source)"],
  "concerns": ["concern1", "concern2"]
}`;

  try {
    const response = await llm.invoke([{ role: 'human', content: prompt }]);
    const report = parseLLMJson(response.content);
    console.log(`   ✅ Financial analysis complete: Health ${report.healthScore}/100`);
    return { financialReport: report };
  } catch (err) {
    console.error(`   ❌ Financial agent error:`, err.message);
    return { financialReport: null };
  }
}

/**
 * News Analyst Agent: Evaluates sentiment from news data independently.
 */
async function newsAnalystNode(state) {
  if (state.error) return {};
  console.log(`📍 [News Analyst Agent] Analyzing news sentiment...`);

  const llm = createLLM(512, 'llama-3.3-70b-versatile');
  const newsText = state.news?.length
    ? state.news.map((n, i) => `${i + 1}. "${n.headline}" (${n.source}, ${new Date(n.datetime).toLocaleDateString()}) — ${n.summary || ''}`).join('\n')
    : 'No recent news available.';

  const prompt = `You are a News & Sentiment Analyst.

Analyze the following news articles about ${state.companyName} (${state.ticker}) and return a sentiment assessment.

${newsText}

Return ONLY this JSON:
{
  "overallSentiment": "Positive" | "Neutral" | "Negative",
  "sentimentScore": <number 0-100, where 100 = extremely positive>,
  "positivePercent": <number 0-100>,
  "neutralPercent": <number 0-100>,
  "negativePercent": <number 0-100>,
  "summary": "<2-3 sentence news sentiment summary>",
  "keyHeadlines": ["headline1 (Source, Date)", "headline2 (Source, Date)"]
}

Percentages must sum to 100.`;

  try {
    const response = await llm.invoke([{ role: 'human', content: prompt }]);
    const report = parseLLMJson(response.content);
    console.log(`   ✅ News analysis complete: ${report.overallSentiment} (${report.sentimentScore}/100)`);
    return { newsReport: report };
  } catch (err) {
    console.error(`   ❌ News agent error:`, err.message);
    return { newsReport: null };
  }
}

/**
 * Risk Analyst Agent: Evaluates risk profile independently.
 */
async function riskAnalystNode(state) {
  if (state.error) return {};
  console.log(`📍 [Risk Analyst Agent] Evaluating risk profile...`);

  const llm = createLLM(512, 'llama-3.3-70b-versatile');
  const prompt = `You are a Risk Analyst specializing in investment risk assessment.

Evaluate the risk profile of ${state.companyName} (${state.ticker}) based on:

${state.financials ? `
Debt-to-Equity: ${state.financials.debtToEquity}
Free Cash Flow: $${state.financials.freeCashflow}
Profit Margin: ${state.financials.profitMargin}
` : 'Financial data limited.'}
${state.marketData ? `
Beta: ${state.marketData.beta}
52-Week High: $${state.marketData.fiftyTwoWeekHigh}
52-Week Low: $${state.marketData.fiftyTwoWeekLow}
Current Price: $${state.marketData.currentPrice}
` : ''}
${state.profile ? `
Industry: ${state.profile.industry}
Sector: ${state.profile.sector}
` : ''}

Return ONLY this JSON:
{
  "overallRisk": "Low" | "Medium" | "High",
  "marketRisk": <number 0-100>,
  "financialRisk": <number 0-100>,
  "executionRisk": <number 0-100>,
  "regulatoryRisk": <number 0-100>,
  "summary": "<2-3 sentence risk assessment>",
  "topRisks": ["risk1 with citation (Source)", "risk2 with citation (Source)"]
}`;

  try {
    const response = await llm.invoke([{ role: 'human', content: prompt }]);
    const report = parseLLMJson(response.content);
    console.log(`   ✅ Risk analysis complete: ${report.overallRisk} risk`);
    return { riskReport: report };
  } catch (err) {
    console.error(`   ❌ Risk agent error:`, err.message);
    return { riskReport: null };
  }
}

// ─── Chief Analyst (Final Synthesis) ─────────────────────────────────

/**
 * Chief Analyst Agent: Synthesizes all sub-agent reports + raw data
 * into the final comprehensive investment recommendation.
 */
async function chiefAnalystNode(state) {
  if (state.error) return {};
  console.log(`📍 [Chief Analyst Agent] Synthesizing final report...`);

  const llm = createLLM(1536, 'llama-3.3-70b-versatile');

  // Build the full prompt with sub-agent context injected
  let subAgentContext = '\n### Sub-Agent Reports\n\n';

  if (state.financialReport) {
    subAgentContext += `**Financial Analyst Report:**
- Health Score: ${state.financialReport.healthScore}/100
- Growth Score: ${state.financialReport.growthScore}/100
- Valuation Score: ${state.financialReport.valuationScore}/100
- Summary: ${state.financialReport.summary}
- Key Metrics: ${state.financialReport.keyMetrics?.join('; ')}
- Concerns: ${state.financialReport.concerns?.join('; ')}

`;
  }

  if (state.newsReport) {
    subAgentContext += `**News Analyst Report:**
- Overall Sentiment: ${state.newsReport.overallSentiment} (${state.newsReport.sentimentScore}/100)
- Breakdown: +${state.newsReport.positivePercent}% / =${state.newsReport.neutralPercent}% / -${state.newsReport.negativePercent}%
- Summary: ${state.newsReport.summary}
- Key Headlines: ${state.newsReport.keyHeadlines?.join('; ')}

`;
  }

  if (state.riskReport) {
    subAgentContext += `**Risk Analyst Report:**
- Overall Risk: ${state.riskReport.overallRisk}
- Market Risk: ${state.riskReport.marketRisk}%, Financial Risk: ${state.riskReport.financialRisk}%, Execution Risk: ${state.riskReport.executionRisk}%, Regulatory Risk: ${state.riskReport.regulatoryRisk}%
- Summary: ${state.riskReport.summary}
- Top Risks: ${state.riskReport.topRisks?.join('; ')}

`;
  }

  const basePrompt = buildAnalysisPrompt({
    companyName: state.companyName,
    ticker: state.ticker,
    profile: state.profile,
    financials: state.financials,
    marketData: state.marketData,
    news: state.news,
  });

  // Insert sub-agent context before the Instructions section
  const finalPrompt = basePrompt.replace(
    '### Instructions',
    subAgentContext + '### Instructions'
  );

  try {
    const response = await llm.invoke([
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'human', content: finalPrompt },
    ]);

    let content = response.content;
    const parsed = parseLLMJson(content);
    const validated = InvestmentAnalysisSchema.parse(parsed);

    console.log(`   ✅ Chief Analyst verdict: ${validated.decision} (${validated.confidence}% confidence, score ${validated.overallScore})`);
    return { analysisResult: validated };
  } catch (err) {
    console.error('   ❌ Chief Analyst error:', err.message);
    return {
      analysisResult: {
        decision: 'PASS',
        confidence: 30,
        overallScore: 50,
        scores: { financialHealth: 3, growthPotential: 3, riskLevel: 3, marketPosition: 3 },
        reasons: ['Analysis could not be completed reliably. Insufficient data confidence.'],
        risks: ['Data parsing error occurred during analysis', 'Recommendation may not reflect full picture'],
        reasoning: 'The AI analysis encountered an error during processing. The data was gathered successfully but the final reasoning step could not be completed reliably. We recommend conducting manual research before making any investment decision.',
        sources: ['Yahoo Finance'],
        executiveSummary: 'Analysis incomplete due to processing error.',
        timeHorizon: 'Long Term',
        confidenceEvidence: { quality: 'Low', factors: ['Processing error', 'Incomplete analysis'] },
        riskBreakdown: { market: 50, financial: 50, execution: 50, regulatory: 50 },
        debate: {
          bull: { arguments: ['Data collection succeeded', 'Company data is available'] },
          bear: { arguments: ['Analysis parsing failed', 'Cannot provide reliable recommendation'] },
          chiefAnalystSynthesis: 'Due to processing errors, a manual review is recommended.',
        },
        swot: { strengths: ['N/A'], weaknesses: ['Analysis incomplete'], opportunities: ['N/A'], threats: ['N/A'] },
        newsSentiment: { overall: 'Neutral', breakdown: { positive: 33, neutral: 34, negative: 33 }, reason: 'Insufficient analysis.' },
        eli15: 'We tried to analyze this company but ran into a technical issue. Try again!',
        decisionCatalysts: { currentTopFactors: ['Processing error'], whatWouldChangeDecision: ['Successful re-analysis'] },
        scoreBreakdown: { financialHealth: 0, growthPotential: 0, newsSentiment: 0, competitivePosition: 0, riskAdjustment: 0, valuationAdjustment: 0 },
        scenarios: [],
      },
    };
  }
}

function shouldContinueAfterTicker(state) {
  return state.error ? 'error_end' : 'fetchProfile';
}

// ─── Build Multi-Agent Graph ─────────────────────────────────────────
//
// Architecture:
//
//   Start → resolveTicker →(conditional)→ fetchProfile → fetchFinancials → fetchMarketData → fetchNews
//                                                                                               ↓
//                                                              ┌────────────────────────────────────┐
//                                                              │  PARALLEL SPECIALIST AGENTS        │
//                                                              │  financialAnalyst ─┐               │
//                                                              │  newsAnalyst ──────┤               │
//                                                              │  riskAnalyst ──────┘               │
//                                                              └────────────────────────────────────┘
//                                                                                               ↓
//                                                                                        chiefAnalyst → End
//

function buildInvestmentGraph() {
  const graph = new StateGraph(AgentState)
    // Data collection nodes
    .addNode('resolveTicker', resolveTickerNode)
    .addNode('fetchProfile', fetchProfileNode)
    .addNode('fetchFinancials', fetchFinancialsNode)
    .addNode('fetchMarketData', fetchMarketDataNode)
    .addNode('fetchNews', fetchNewsNode)
    // Specialist AI agents (run in parallel after data collection)
    .addNode('financialAnalyst', financialAnalystNode)
    .addNode('newsAnalyst', newsAnalystNode)
    .addNode('riskAnalyst', riskAnalystNode)
    // Chief Analyst synthesizes everything
    .addNode('chiefAnalyst', chiefAnalystNode)

    // Entry
    .addEdge('__start__', 'resolveTicker')

    // Conditional: abort early if ticker not found
    .addConditionalEdges('resolveTicker', shouldContinueAfterTicker, {
      fetchProfile: 'fetchProfile',
      error_end: '__end__',
    })

    // Sequential data collection
    .addEdge('fetchProfile', 'fetchFinancials')
    .addEdge('fetchFinancials', 'fetchMarketData')
    .addEdge('fetchMarketData', 'fetchNews')

    // After news is fetched, fan out to 3 specialist agents IN PARALLEL
    .addEdge('fetchNews', 'financialAnalyst')
    .addEdge('fetchNews', 'newsAnalyst')
    .addEdge('fetchNews', 'riskAnalyst')

    // All 3 specialists converge into the Chief Analyst
    .addEdge('financialAnalyst', 'chiefAnalyst')
    .addEdge('newsAnalyst', 'chiefAnalyst')
    .addEdge('riskAnalyst', 'chiefAnalyst')

    // Chief Analyst outputs final result
    .addEdge('chiefAnalyst', '__end__');

  return graph.compile();
}

// ─── Exported Runner ─────────────────────────────────────────────────

/**
 * Runs the full multi-agent investment research pipeline.
 * 
 * Architecture: Orchestrator → Data Agents → [Financial | News | Risk] Analysts (parallel) → Chief Analyst
 * 
 * @param {string} companyName - The company to analyze
 * @param {function} [onProgress] - Optional SSE callback: onProgress({ step, label, status })
 * @returns {Promise<object>} - The complete analysis result
 */
export async function runInvestmentAgent(companyName, onProgress) {
  console.log(`\n${'═'.repeat(60)}`);
  console.log(`  🔬 Starting Multi-Agent Investment Analysis: "${companyName}"`);
  console.log(`  📐 Agents: Financial Analyst, News Analyst, Risk Analyst, Chief Analyst`);
  console.log(`${'═'.repeat(60)}\n`);

  const app = buildInvestmentGraph();

  // Stream graph execution to emit progress events
  const stepLabels = {
    resolveTicker: '🔍 Resolving company ticker',
    fetchProfile: '🏢 Fetching company profile',
    fetchFinancials: '📊 Collecting financial statements',
    fetchMarketData: '📈 Loading live market data',
    fetchNews: '📰 Scanning recent news articles',
    financialAnalyst: '💰 Financial Analyst evaluating health',
    newsAnalyst: '📰 News Analyst assessing sentiment',
    riskAnalyst: '🛡️ Risk Analyst profiling risk',
    chiefAnalyst: '👔 Chief Analyst synthesizing final report',
  };

  let result;

  // Use streamEvents to provide live progress
  try {
    for await (const event of app.streamEvents(
      { companyName },
      { version: 'v2' }
    )) {
      if (event.event === 'on_chain_start' && event.name && stepLabels[event.name]) {
        if (onProgress) {
          onProgress({ step: event.name, label: stepLabels[event.name], status: 'running' });
        }
      }
      if (event.event === 'on_chain_end') {
        if (event.name && stepLabels[event.name]) {
          if (onProgress) {
            onProgress({ step: event.name, label: stepLabels[event.name], status: 'done' });
          }
        }
        if (event.name === 'LangGraph') {
          result = event.data.output;
        }
      }
    }
  } catch (streamErr) {
    console.warn('   ⚠️ streamEvents failed, falling back to invoke...', streamErr.message);
  }

  // Fallback: use regular invoke if streaming didn't produce a final state
  if (!result) {
    result = await app.invoke({ companyName });
  }

  if (result.error) {
    return { success: false, error: result.error };
  }

  return {
    success: true,
    data: {
      company: {
        name: result.tickerInfo?.name || companyName,
        ticker: result.ticker,
        exchange: result.tickerInfo?.exchange,
      },
      profile: result.profile,
      financials: result.financials,
      marketData: result.marketData,
      news: result.news,
      analysis: result.analysisResult,
      // Expose sub-agent reports for transparency
      agentReports: {
        financial: result.financialReport,
        news: result.newsReport,
        risk: result.riskReport,
      },
    },
  };
}
