export const CURRENCIES = [
  { code: 'INR', symbol: '₹', name: 'Indian Rupee', locale: 'en-IN' },
  { code: 'USD', symbol: '$', name: 'US Dollar', locale: 'en-US' },
  { code: 'EUR', symbol: '€', name: 'Euro', locale: 'de-DE' },
  { code: 'GBP', symbol: '£', name: 'British Pound', locale: 'en-GB' },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen', locale: 'ja-JP' },
  { code: 'AUD', symbol: 'A$', name: 'Australian Dollar', locale: 'en-AU' },
  { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar', locale: 'en-CA' },
];

// Approximate static fallback rates (to INR), used if live rates unavailable.
// Mirrors backend/utils/currency.js fallback so client-side estimates stay consistent.
export const FALLBACK_RATES_TO_INR = {
  INR: 1,
  USD: 83.5,
  EUR: 90.5,
  GBP: 105.8,
  JPY: 0.56,
  AUD: 54.9,
  CAD: 61.2,
};

export function getCurrencyMeta(code) {
  return CURRENCIES.find((c) => c.code === code) || CURRENCIES[0];
}

export function convertAmount(amount, fromCode, toCode, rates = FALLBACK_RATES_TO_INR) {
  if (fromCode === toCode) return amount;
  const fromRate = rates[fromCode] || FALLBACK_RATES_TO_INR[fromCode] || 1;
  const toRate = rates[toCode] || FALLBACK_RATES_TO_INR[toCode] || 1;
  return (amount * fromRate) / toRate;
}

export function formatCurrency(amount, code) {
  const meta = getCurrencyMeta(code);
  try {
    return new Intl.NumberFormat(meta.locale, {
      style: 'currency',
      currency: code,
      maximumFractionDigits: code === 'JPY' ? 0 : 2,
    }).format(amount);
  } catch {
    return `${meta.symbol}${amount.toFixed(2)}`;
  }
}
