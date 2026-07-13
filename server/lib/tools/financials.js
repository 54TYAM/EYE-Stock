import YahooFinance from 'yahoo-finance2';
const yahooFinance = new YahooFinance();

/**
 * Fetches financial statements and key statistics from Yahoo Finance.
 * @param {string} ticker - Stock ticker symbol
 * @returns {Promise<object|null>}
 */
export async function fetchFinancials(ticker) {
  try {
    const result = await yahooFinance.quoteSummary(ticker, {
      modules: [
        'incomeStatementHistory',
        'balanceSheetHistory',
        'cashflowStatementHistory',
        'defaultKeyStatistics',
        'financialData',
      ],
    });

    const income = result.incomeStatementHistory?.incomeStatementHistory || [];
    const balance = result.balanceSheetHistory?.balanceSheetStatements || [];
    const cashflow = result.cashflowStatementHistory?.cashflowStatements || [];
    const keyStats = result.defaultKeyStatistics || {};
    const finData = result.financialData || {};

    // Format revenue history (last 3 years)
    const revenueHistory = income.slice(0, 3).map((stmt) => ({
      date: stmt.endDate ? new Date(stmt.endDate).getFullYear() : 'N/A',
      revenue: stmt.totalRevenue || 0,
      netIncome: stmt.netIncome || 0,
      grossProfit: stmt.grossProfit || 0,
    }));

    // Calculate revenue growth if we have at least 2 years
    let revenueGrowth = null;
    if (revenueHistory.length >= 2 && revenueHistory[1].revenue > 0) {
      revenueGrowth = (
        ((revenueHistory[0].revenue - revenueHistory[1].revenue) /
          revenueHistory[1].revenue) *
        100
      ).toFixed(2);
    }

    // Latest balance sheet
    const latestBalance = balance[0] || {};

    return {
      revenueHistory,
      revenueGrowth: revenueGrowth ? `${revenueGrowth}%` : finData.revenueGrowth
        ? `${(finData.revenueGrowth * 100).toFixed(2)}%`
        : 'N/A',
      latestRevenue: finData.totalRevenue || (income[0]?.totalRevenue) || 'N/A',
      netIncome: income[0]?.netIncome || 'N/A',
      totalDebt: finData.totalDebt || latestBalance.longTermDebt || 'N/A',
      totalCash: finData.totalCash || latestBalance.cash || 'N/A',
      eps: keyStats.trailingEps || 'N/A',
      forwardEps: keyStats.forwardEps || 'N/A',
      profitMargin: finData.profitMargins
        ? `${(finData.profitMargins * 100).toFixed(2)}%`
        : 'N/A',
      operatingMargin: finData.operatingMargins
        ? `${(finData.operatingMargins * 100).toFixed(2)}%`
        : 'N/A',
      returnOnEquity: finData.returnOnEquity
        ? `${(finData.returnOnEquity * 100).toFixed(2)}%`
        : 'N/A',
      operatingCashflow: finData.operatingCashflow || (cashflow[0]?.totalCashFromOperatingActivities) || 'N/A',
      freeCashflow: finData.freeCashflow || 'N/A',
      debtToEquity: finData.debtToEquity || 'N/A',
    };
  } catch (error) {
    console.error('Financials fetch failed:', error.message);
    return null;
  }
}
