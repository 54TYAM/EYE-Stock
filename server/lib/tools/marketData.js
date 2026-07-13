import YahooFinance from 'yahoo-finance2';
const yahooFinance = new YahooFinance();

/**
 * Fetches current market data and analyst recommendations.
 * @param {string} ticker - Stock ticker symbol
 * @returns {Promise<object|null>}
 */
export async function fetchMarketData(ticker) {
  try {
    const [quote, summaryResult] = await Promise.all([
      yahooFinance.quote(ticker),
      yahooFinance.quoteSummary(ticker, {
        modules: ['recommendationTrend', 'upgradeDowngradeHistory'],
      }).catch(() => ({})),
    ]);

    if (!quote) return null;

    // Extract analyst recommendations
    const recTrend = summaryResult?.recommendationTrend?.trend || [];
    const currentRec = recTrend.find((t) => t.period === '0m') || {};

    // Compile upgrade/downgrade history (last 5)
    const upgrades = (summaryResult?.upgradeDowngradeHistory?.history || [])
      .slice(0, 5)
      .map((u) => ({
        firm: u.firm,
        toGrade: u.toGrade,
        fromGrade: u.fromGrade,
        action: u.action,
      }));

    return {
      currentPrice: quote.regularMarketPrice || 'N/A',
      previousClose: quote.regularMarketPreviousClose || 'N/A',
      dayChange: quote.regularMarketChange
        ? quote.regularMarketChange.toFixed(2)
        : 'N/A',
      dayChangePercent: quote.regularMarketChangePercent
        ? `${quote.regularMarketChangePercent.toFixed(2)}%`
        : 'N/A',
      marketCap: quote.marketCap || 'N/A',
      fiftyTwoWeekHigh: quote.fiftyTwoWeekHigh || 'N/A',
      fiftyTwoWeekLow: quote.fiftyTwoWeekLow || 'N/A',
      avgVolume: quote.averageDailyVolume3Month || 'N/A',
      peRatio: quote.trailingPE ? quote.trailingPE.toFixed(2) : 'N/A',
      forwardPE: quote.forwardPE ? quote.forwardPE.toFixed(2) : 'N/A',
      dividendYield: quote.trailingAnnualDividendYield
        ? `${(quote.trailingAnnualDividendYield * 100).toFixed(2)}%`
        : 'N/A',
      beta: quote.beta ? quote.beta.toFixed(2) : 'N/A',
      analystRating: quote.averageAnalystRating || 'N/A',
      targetMeanPrice: quote.targetMeanPrice || 'N/A',
      targetHighPrice: quote.targetHighPrice || 'N/A',
      targetLowPrice: quote.targetLowPrice || 'N/A',
      analystRecommendations: {
        strongBuy: currentRec.strongBuy || 0,
        buy: currentRec.buy || 0,
        hold: currentRec.hold || 0,
        sell: currentRec.sell || 0,
        strongSell: currentRec.strongSell || 0,
      },
      recentUpgrades: upgrades,
    };
  } catch (error) {
    console.error('Market data fetch failed:', error.message);
    return null;
  }
}
