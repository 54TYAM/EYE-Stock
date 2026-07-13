import YahooFinance from 'yahoo-finance2';
const yahooFinance = new YahooFinance();


const KNOWN_TICKERS = {
  'apple': { ticker: 'AAPL', name: 'Apple Inc.' },
  'microsoft': { ticker: 'MSFT', name: 'Microsoft Corporation' },
  'google': { ticker: 'GOOGL', name: 'Alphabet Inc.' },
  'alphabet': { ticker: 'GOOGL', name: 'Alphabet Inc.' },
  'amazon': { ticker: 'AMZN', name: 'Amazon.com Inc.' },
  'tesla': { ticker: 'TSLA', name: 'Tesla, Inc.' },
  'nvidia': { ticker: 'NVDA', name: 'NVIDIA Corporation' },
  'meta': { ticker: 'META', name: 'Meta Platforms, Inc.' },
  'facebook': { ticker: 'META', name: 'Meta Platforms, Inc.' },
  'netflix': { ticker: 'NFLX', name: 'Netflix, Inc.' },
  'disney': { ticker: 'DIS', name: 'The Walt Disney Company' },
  'amd': { ticker: 'AMD', name: 'Advanced Micro Devices, Inc.' },
  'intel': { ticker: 'INTC', name: 'Intel Corporation' },
  'ibm': { ticker: 'IBM', name: 'IBM' },
  'oracle': { ticker: 'ORCL', name: 'Oracle Corporation' },
  'salesforce': { ticker: 'CRM', name: 'Salesforce, Inc.' },
  'adobe': { ticker: 'ADBE', name: 'Adobe Inc.' },
  'uber': { ticker: 'UBER', name: 'Uber Technologies, Inc.' },
  'airbnb': { ticker: 'ABNB', name: 'Airbnb, Inc.' },
  'spotify': { ticker: 'SPOT', name: 'Spotify Technology S.A.' },
  'snapchat': { ticker: 'SNAP', name: 'Snap Inc.' },
  'snap': { ticker: 'SNAP', name: 'Snap Inc.' },
  'twitter': { ticker: 'X', name: 'X Corp.' },
  'walmart': { ticker: 'WMT', name: 'Walmart Inc.' },
  'coca cola': { ticker: 'KO', name: 'The Coca-Cola Company' },
  'coca-cola': { ticker: 'KO', name: 'The Coca-Cola Company' },
  'pepsi': { ticker: 'PEP', name: 'PepsiCo, Inc.' },
  'nike': { ticker: 'NKE', name: 'NIKE, Inc.' },
  'boeing': { ticker: 'BA', name: 'The Boeing Company' },
  'jpmorgan': { ticker: 'JPM', name: 'JPMorgan Chase & Co.' },
  'goldman sachs': { ticker: 'GS', name: 'The Goldman Sachs Group, Inc.' },
  'berkshire hathaway': { ticker: 'BRK-B', name: 'Berkshire Hathaway Inc.' },
  'visa': { ticker: 'V', name: 'Visa Inc.' },
  'mastercard': { ticker: 'MA', name: 'Mastercard Incorporated' },
  'paypal': { ticker: 'PYPL', name: 'PayPal Holdings, Inc.' },
  'samsung': { ticker: '005930.KS', name: 'Samsung Electronics Co., Ltd.' },
  'toyota': { ticker: 'TM', name: 'Toyota Motor Corporation' },
  'sony': { ticker: 'SONY', name: 'Sony Group Corporation' },
  'tata': { ticker: 'TCS.NS', name: 'Tata Consultancy Services' },
  'reliance': { ticker: 'RELIANCE.NS', name: 'Reliance Industries Limited' },
  'infosys': { ticker: 'INFY', name: 'Infosys Limited' },
  'wipro': { ticker: 'WIT', name: 'Wipro Limited' },
};

/**
 * Resolves a company name to a stock ticker symbol.
 * Uses 3 strategies: known mapping → Yahoo search → direct ticker lookup.
 * @param {string} companyName - Company name or ticker (e.g. "Tesla", "AAPL")
 * @returns {Promise<{ticker: string, name: string, exchange: string} | null>}
 */
export async function resolveTicker(companyName) {
  const input = companyName.trim();
  const lowerInput = input.toLowerCase();

  // ── Strategy 1: Check known company mapping ────────────────────
  const known = KNOWN_TICKERS[lowerInput];
  if (known) {
    console.log(`   📋 Found in known tickers: ${known.ticker}`);
    return { ticker: known.ticker, name: known.name, exchange: 'Known' };
  }

  // ── Strategy 2: Yahoo Finance search ───────────────────────────
  try {
    const result = await yahooFinance.search(input, { quotesCount: 6 });

    if (result.quotes && result.quotes.length > 0) {
      // Prefer equity type results
      const equity = result.quotes.find(
        (q) => q.quoteType === 'EQUITY' || q.typeDisp === 'Equity'
      );
      const best = equity || result.quotes[0];

      if (best && best.symbol) {
        return {
          ticker: best.symbol,
          name: best.shortname || best.longname || companyName,
          exchange: best.exchange || 'Unknown',
        };
      }
    }
  } catch (error) {
    console.warn('   ⚠️ Yahoo search failed, trying fallback:', error.message);
  }

  // ── Strategy 3: Try input directly as a ticker symbol ──────────
  try {
    const upperInput = input.toUpperCase();
    const quote = await yahooFinance.quote(upperInput);
    if (quote && quote.symbol) {
      return {
        ticker: quote.symbol,
        name: quote.shortName || quote.longName || companyName,
        exchange: quote.fullExchangeName || quote.exchange || 'Unknown',
      };
    }
  } catch (error) {
    console.warn('   ⚠️ Direct ticker lookup failed:', error.message);
  }

  return null;
}
