// Lightweight currency conversion helper.
// Tries a live exchange rate API (if configured), and falls back to
// reasonable static approximate rates so the app works with zero setup.

const FALLBACK_RATES_TO_INR = {
  INR: 1,
  USD: 83.5,
  EUR: 90.5,
  GBP: 105.8,
  JPY: 0.56,
  AUD: 54.9,
  CAD: 61.2,
};

let cachedRates = null;
let cachedAt = 0;
const CACHE_TTL_MS = 1000 * 60 * 60; // 1 hour

async function fetchLiveRates() {
  const apiUrl = process.env.EXCHANGE_RATE_API_URL;
  if (!apiUrl) return null;

  try {
    const res = await fetch(`${apiUrl}/INR`);
    if (!res.ok) return null;
    const data = await res.json();
    if (!data || !data.rates) return null;

    // API gives rates FROM INR to X, we want TO INR, so invert
    const toInr = {};
    Object.entries(data.rates).forEach(([code, rate]) => {
      if (rate > 0) toInr[code] = 1 / rate;
    });
    toInr.INR = 1;
    return toInr;
  } catch (err) {
    console.warn('Live exchange rate fetch failed, using fallback rates:', err.message);
    return null;
  }
}

async function getRatesToINR() {
  const now = Date.now();
  if (cachedRates && now - cachedAt < CACHE_TTL_MS) {
    return cachedRates;
  }

  const live = await fetchLiveRates();
  cachedRates = live || FALLBACK_RATES_TO_INR;
  cachedAt = now;
  return cachedRates;
}

// Converts an amount from one currency to another using INR as the pivot
async function convert(amount, fromCurrency, toCurrency) {
  if (fromCurrency === toCurrency) return amount;
  const rates = await getRatesToINR();
  const fromRate = rates[fromCurrency] || FALLBACK_RATES_TO_INR[fromCurrency] || 1;
  const toRate = rates[toCurrency] || FALLBACK_RATES_TO_INR[toCurrency] || 1;
  const amountInInr = amount * fromRate;
  return amountInInr / toRate;
}

module.exports = { convert, getRatesToINR, FALLBACK_RATES_TO_INR };
