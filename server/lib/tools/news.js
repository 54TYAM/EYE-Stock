/**
 * Fetches company-specific news from Finnhub API.
 * Falls back gracefully if API key is missing.
 * @param {string} ticker - Stock ticker symbol
 * @returns {Promise<Array>}
 */
export async function fetchNews(ticker) {
  const apiKey = process.env.FINNHUB_API_KEY;

  if (!apiKey || apiKey === 'your_finnhub_api_key_here') {
    console.warn('Finnhub API key not configured — skipping news fetch');
    return [];
  }

  try {
    const today = new Date();
    const thirtyDaysAgo = new Date(today);
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const from = thirtyDaysAgo.toISOString().split('T')[0];
    const to = today.toISOString().split('T')[0];

    const url = `https://finnhub.io/api/v1/company-news?symbol=${ticker}&from=${from}&to=${to}&token=${apiKey}`;

    const response = await fetch(url);

    if (!response.ok) {
      console.error(`Finnhub API error: ${response.status}`);
      return [];
    }

    const articles = await response.json();

    // Return top 3 most recent articles (to prevent LLM token limits)
    return articles
      .slice(0, 3)
      .map((article) => ({
        headline: article.headline,
        summary: article.summary ? article.summary.substring(0, 200) + (article.summary.length > 200 ? '...' : '') : '',
        source: article.source,
        url: article.url,
        datetime: new Date(article.datetime * 1000).toISOString(),
        category: article.category,
      }));
  } catch (error) {
    console.error('News fetch failed:', error.message);
    return [];
  }
}
