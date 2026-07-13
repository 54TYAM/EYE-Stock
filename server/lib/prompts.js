/**
 * LLM prompt templates for the investment analysis agent.
 */

export const SYSTEM_PROMPT = `You are a senior investment research analyst at a top-tier financial institution. You have decades of experience analyzing companies across all sectors and making investment recommendations.

Your analysis style:
- Data-driven and objective
- Consider both quantitative metrics and qualitative factors
- Always acknowledge risks and uncertainties
- Provide clear, actionable recommendations
- Cite specific data points to support your reasoning

You will receive comprehensive research data about a company including its profile, financial statements, market data, and recent news. Your job is to synthesize all of this into a clear investment recommendation.

IMPORTANT: You must respond ONLY with valid JSON matching the exact schema provided. Do not include any text outside the JSON object.`;

export function buildAnalysisPrompt(data) {
  const { companyName, ticker, profile, financials, marketData, news } = data;

  let prompt = `## Investment Analysis Request

Analyze **${companyName}** (Ticker: ${ticker || 'Unknown'}) and provide a complete investment recommendation.

`;

  // Company Profile
  if (profile) {
    prompt += `### Company Profile
- **Name:** ${profile.name}
- **Industry:** ${profile.industry}
- **Sector:** ${profile.sector}
- **Headquarters:** ${profile.headquarters}
- **Employees:** ${typeof profile.employees === 'number' ? profile.employees.toLocaleString() : profile.employees}
- **Website:** ${profile.website}
- **Key Officers:** ${profile.officers?.map(o => `${o.name} (${o.title})`).join(', ') || 'N/A'}
- **Description:** ${profile.description}

`;
  } else {
    prompt += `### Company Profile\nData unavailable.\n\n`;
  }

  // Financials
  if (financials) {
    prompt += `### Financial Data
- **Latest Revenue:** $${formatNumber(financials.latestRevenue)}
- **Revenue Growth:** ${financials.revenueGrowth}
- **Net Income:** $${formatNumber(financials.netIncome)}
- **EPS (Trailing):** ${financials.eps}
- **EPS (Forward):** ${financials.forwardEps}
- **Profit Margin:** ${financials.profitMargin}
- **Operating Margin:** ${financials.operatingMargin}
- **Return on Equity:** ${financials.returnOnEquity}
- **Total Debt:** $${formatNumber(financials.totalDebt)}
- **Total Cash:** $${formatNumber(financials.totalCash)}
- **Debt-to-Equity:** ${financials.debtToEquity}
- **Operating Cash Flow:** $${formatNumber(financials.operatingCashflow)}
- **Free Cash Flow:** $${formatNumber(financials.freeCashflow)}

**Revenue History (Last 3 Years):**
${financials.revenueHistory?.map(r =>
  `  - ${r.date}: Revenue $${formatNumber(r.revenue)}, Net Income $${formatNumber(r.netIncome)}`
).join('\n') || 'N/A'}

`;
  } else {
    prompt += `### Financial Data\nData unavailable.\n\n`;
  }

  // Market Data
  if (marketData) {
    prompt += `### Market Data
- **Current Price:** $${marketData.currentPrice}
- **Day Change:** ${marketData.dayChange} (${marketData.dayChangePercent})
- **Market Cap:** $${formatNumber(marketData.marketCap)}
- **P/E Ratio (Trailing):** ${marketData.peRatio}
- **P/E Ratio (Forward):** ${marketData.forwardPE}
- **52-Week High:** $${marketData.fiftyTwoWeekHigh}
- **52-Week Low:** $${marketData.fiftyTwoWeekLow}
- **Beta:** ${marketData.beta}
- **Dividend Yield:** ${marketData.dividendYield}
- **Analyst Rating:** ${marketData.analystRating}
- **Price Target (Mean):** $${marketData.targetMeanPrice}
- **Price Target (High):** $${marketData.targetHighPrice}
- **Price Target (Low):** $${marketData.targetLowPrice}

**Analyst Recommendations:**
  - Strong Buy: ${marketData.analystRecommendations?.strongBuy || 0}
  - Buy: ${marketData.analystRecommendations?.buy || 0}
  - Hold: ${marketData.analystRecommendations?.hold || 0}
  - Sell: ${marketData.analystRecommendations?.sell || 0}
  - Strong Sell: ${marketData.analystRecommendations?.strongSell || 0}

${marketData.recentUpgrades?.length ? `**Recent Upgrades/Downgrades:**\n${marketData.recentUpgrades.map(u =>
  `  - ${u.firm}: ${u.fromGrade || 'N/A'} → ${u.toGrade} (${u.action})`
).join('\n')}` : ''}

`;
  } else {
    prompt += `### Market Data\nData unavailable.\n\n`;
  }

  // News
  if (news && news.length > 0) {
    prompt += `### Recent News (Last 30 Days)
${news.map((n, i) => `${i + 1}. **${n.headline}** (${n.source}, ${new Date(n.datetime).toLocaleDateString()})
   ${n.summary || ''}`).join('\n')}

`;
  } else {
    prompt += `### Recent News\nNo recent news available.\n\n`;
  }

  prompt += `### Instructions

Based on ALL the data above, provide your investment analysis as a JSON object with this EXACT structure:

{
  "decision": "INVEST" or "PASS",
  "confidence": <number 0-100>,
  "overallScore": <number 0-100>,
  "scores": {
    "financialHealth": <number 1-5>,
    "growthPotential": <number 1-5>,
    "riskLevel": <number 1-5, where 5 = lowest risk>,
    "marketPosition": <number 1-5>
  },
  "reasons": ["reason1", "reason2", ...],
  "risks": ["risk1", "risk2", ...],
  "reasoning": "<detailed 2-3 paragraph analysis explaining your decision>",
  "sources": ["Yahoo Finance", "Company Filings", ...],
  "executiveSummary": "<One concise sentence summarizing the entire recommendation>",
  "timeHorizon": "Short Term" | "Medium Term" | "Long Term",
  "confidenceEvidence": {
    "quality": "High" | "Medium" | "Low",
    "factors": ["Recent financial data available", "Multiple sources agree", ...]
  },
  "riskBreakdown": {
    "market": <number 0-100>,
    "financial": <number 0-100>,
    "execution": <number 0-100>,
    "regulatory": <number 0-100>
  },
  "debate": {
    "bull": { "arguments": ["Bull argument 1", "Bull argument 2"] },
    "bear": { "arguments": ["Bear argument 1", "Bear argument 2"] },
    "chiefAnalystSynthesis": "After evaluating both opinions..."
  },
  "swot": {
    "strengths": ["...", "..."],
    "weaknesses": ["...", "..."],
    "opportunities": ["...", "..."],
    "threats": ["...", "..."]
  },
  "newsSentiment": {
    "overall": "Positive" | "Neutral" | "Negative",
    "breakdown": { "positive": <percentage>, "neutral": <percentage>, "negative": <percentage> },
    "reason": "Brief reason for this sentiment..."
  },
  "eli15": "Imagine this company is... (Explain simply to a 15-year-old)",
  "decisionCatalysts": {
    "currentTopFactors": ["Factor 1", "Factor 2"],
    "whatWouldChangeDecision": ["If X happens...", "If Y happens..."]
  },
  "scoreBreakdown": {
    "financialHealth": <points contributed, can be negative>,
    "growthPotential": <points contributed>,
    "newsSentiment": <points contributed>,
    "competitivePosition": <points contributed>,
    "riskAdjustment": <negative number representing risk penalty>,
    "valuationAdjustment": <negative number if overvalued, positive if undervalued>
  },
  "scenarios": [
    { "name": "Base Case", "assumption": "Current trends continue", "decision": "INVEST" | "HOLD" | "PASS", "score": <number> },
    { "name": "Bear Case", "assumption": "Revenue -15%, margins compress", "decision": "INVEST" | "HOLD" | "PASS", "score": <number> },
    { "name": "Bull Case", "assumption": "New product launch succeeds", "decision": "INVEST" | "HOLD" | "PASS", "score": <number> }
  ]
}

Rules:
- "decision" must be exactly "INVEST" or "PASS"
- "confidence" is your confidence in the decision (0-100)
- "overallScore" is a company quality score (0-100)
- "scores" are category ratings from 1 (worst) to 5 (best)
- "riskLevel" uses INVERTED scale: 5 = very safe, 1 = very risky
- Provide 3-6 reasons supporting your decision. IMPORTANT: You MUST append a citation to the end of each reason (e.g. "Revenue grew by 20% (Source: Yahoo Finance)").
- Provide 3-5 key risks. IMPORTANT: You MUST append a citation to the end of each risk (e.g. "High debt-to-equity ratio (Source: Yahoo Finance)").
- "reasoning" should be a detailed multi-paragraph analysis
- "sources" should list the data sources used
- "executiveSummary" is a single concise sentence summarizing the entire investment thesis
- "timeHorizon" indicates the ideal investment horizon for this company
- "confidenceEvidence.quality" reflects how reliable the data is: High = recent data from multiple sources, Medium = some gaps, Low = limited data
- "confidenceEvidence.factors" lists 2-4 reasons why you are confident or not confident
- "riskBreakdown" assigns a 0-100 risk percentage for each category (higher = riskier)
- "debate" must feature a strong Bull case and Bear case, and a final synthesis from the Chief Analyst
- "swot" must have 2-4 points in each array
- "newsSentiment.breakdown" percentages must sum to 100
- "eli15" must use an easy-to-understand analogy
- "decisionCatalysts" demonstrates causal reasoning (what factors drove this decision, and what future events would change it)
- "scoreBreakdown" values must sum approximately to the "overallScore". Use negative values for risk and valuation penalties
- "scenarios" must include at least a Base Case and a Bear Case. Each has a different assumption and resulting decision/score

Respond with ONLY the JSON object, no other text.`;

  return prompt;
}

function formatNumber(num) {
  if (num === 'N/A' || num === null || num === undefined) return 'N/A';
  if (typeof num !== 'number') return String(num);
  if (Math.abs(num) >= 1e12) return `${(num / 1e12).toFixed(2)}T`;
  if (Math.abs(num) >= 1e9) return `${(num / 1e9).toFixed(2)}B`;
  if (Math.abs(num) >= 1e6) return `${(num / 1e6).toFixed(2)}M`;
  return num.toLocaleString();
}
