import YahooFinance from 'yahoo-finance2';
const yahooFinance = new YahooFinance();

/**
 * Fetches the company profile/overview from Yahoo Finance.
 * @param {string} ticker - Stock ticker symbol (e.g. "TSLA")
 * @returns {Promise<object|null>}
 */
export async function fetchCompanyProfile(ticker) {
  try {
    const result = await yahooFinance.quoteSummary(ticker, {
      modules: ['assetProfile', 'summaryProfile', 'quoteType'],
    });

    const asset = result.assetProfile || {};
    const summary = result.summaryProfile || {};
    const quoteType = result.quoteType || {};

    // Extract top officers (CEO, CFO, etc.)
    const officers = (asset.companyOfficers || [])
      .slice(0, 5)
      .map((o) => ({
        name: o.name,
        title: o.title,
      }));

    return {
      name: quoteType.longName || quoteType.shortName || ticker,
      industry: asset.industry || 'N/A',
      sector: asset.sector || 'N/A',
      headquarters: [asset.city, asset.state, asset.country]
        .filter(Boolean)
        .join(', ') || 'N/A',
      employees: asset.fullTimeEmployees || 'N/A',
      website: asset.website || 'N/A',
      description: asset.longBusinessSummary || summary.longBusinessSummary || 'N/A',
      officers,
    };
  } catch (error) {
    console.error('Company profile fetch failed:', error.message);
    return null;
  }
}
