import { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { useAuth } from './AuthContext';
import { FALLBACK_RATES_TO_INR, convertAmount, formatCurrency } from '../utils/currencies';

const CurrencyContext = createContext(null);

export function CurrencyProvider({ children }) {
  const { user, updateUser } = useAuth();
  const [displayCurrency, setDisplayCurrencyState] = useState(
    localStorage.getItem('etp_display_currency') || user?.baseCurrency || 'INR'
  );
  const [rates] = useState(FALLBACK_RATES_TO_INR);

  useEffect(() => {
    if (user?.baseCurrency && !localStorage.getItem('etp_display_currency')) {
      setDisplayCurrencyState(user.baseCurrency);
    }
  }, [user?.baseCurrency]);

  const setDisplayCurrency = useCallback((code) => {
    setDisplayCurrencyState(code);
    localStorage.setItem('etp_display_currency', code);
  }, []);

  const convert = useCallback(
    (amount, fromCode) => convertAmount(amount, fromCode, displayCurrency, rates),
    [displayCurrency, rates]
  );

  const format = useCallback(
    (amount, code = displayCurrency) => formatCurrency(amount, code),
    [displayCurrency]
  );

  const value = useMemo(
    () => ({ displayCurrency, setDisplayCurrency, convert, format, rates, updateBaseCurrency: updateUser }),
    [displayCurrency, setDisplayCurrency, convert, format, rates, updateUser]
  );

  return <CurrencyContext.Provider value={value}>{children}</CurrencyContext.Provider>;
}

export function useCurrency() {
  const ctx = useContext(CurrencyContext);
  if (!ctx) throw new Error('useCurrency must be used within CurrencyProvider');
  return ctx;
}
