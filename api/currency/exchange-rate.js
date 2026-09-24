
/**
 * Get the exchange rate between two currencies.
 *
 * Example:
 * getExchangeRate("USD", "UGX")
 * getExchangeRate("USD", "GHS")
 * getExchangeRate("USD", "KES")
 */
export async function getExchangeRate(fromCurrency, toCurrency) {
  const apiKey = process.env.EXCHANGE_RATE_API_KEY;

  if (!apiKey) {
    throw new Error("EXCHANGE_RATE_API_KEY is not configured.");
  }

  const from = String(fromCurrency || "").trim().toUpperCase();
  const to = String(toCurrency || "").trim().toUpperCase();

  if (!from || !to) {
    throw new Error("Source and destination currencies are required.");
  }

  // No conversion needed
  if (from === to) {
    return 1;
  }

  const url = `https://v6.exchangerate-api.com/v6/${apiKey}/latest/${from}`;

  const response = await fetch(url);
  const data = await response.json();

  if (!response.ok || data.result !== "success") {
    throw new Error(
      data["error-type"] ||
        `Unable to fetch ${from} to ${to} exchange rate.`,
    );
  }

  const rate = Number(data.conversion_rates?.[to]);

  if (!Number.isFinite(rate) || rate <= 0) {
    throw new Error(
      `Invalid exchange rate for ${from} to ${to}.`,
    );
  }

  return rate;
}

/**
 * Convert USD to any supported currency.
 *
 * Example:
 * getUsdToCurrencyRate("UGX")
 * getUsdToCurrencyRate("GHS")
 * getUsdToCurrencyRate("KES")
 */
export async function getUsdToCurrencyRate(currency) {
  return getExchangeRate("USD", currency);
}

