import React, { createContext, useContext, useState, useEffect } from 'react';

// Currency configuration
const CURRENCIES = {
  AED: {
    code: 'AED',
    name: 'UAE Dirham',
    symbol: 'د.إ',
    flag: '🇦🇪',
    isBase: true,
    rate: 1.0
  },
  USD: {
    code: 'USD',
    name: 'US Dollar',
    symbol: '$',
    flag: '🇺🇸',
    isBase: false,
    rate: 0.27 // 1 AED = 0.27 USD (approximate)
  },
  BDT: {
    code: 'BDT',
    name: 'Bangladeshi Taka',
    symbol: '৳',
    flag: '🇧🇩',
    isBase: false,
    rate: 32.82 // 1 AED = 32.82 BDT (correct rate)
  }
};

// Exchange rate service (in real app, this would fetch from API)
const getExchangeRates = async () => {
  // Simulate API call - in production, fetch from currency API
  return {
    USD: 0.27,
    BDT: 32.82, // Correct rate: 1 AED = 32.82 BDT
    AED: 1.0
  };
};

const CurrencyContext = createContext();

export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
};

export const CurrencyProvider = ({ children }) => {
  const [currentCurrency, setCurrentCurrency] = useState('AED');
  const [exchangeRates, setExchangeRates] = useState(CURRENCIES);
  const [loading, setLoading] = useState(false);

  // Load exchange rates on mount
  useEffect(() => {
    const loadExchangeRates = async () => {
      setLoading(true);
      try {
        const rates = await getExchangeRates();
        setExchangeRates(prev => ({
          ...prev,
          USD: { ...prev.USD, rate: rates.USD },
          BDT: { ...prev.BDT, rate: rates.BDT }
        }));
      } catch (error) {
        console.error('Failed to load exchange rates:', error);
        // Use default rates if API fails
      } finally {
        setLoading(false);
      }
    };

    loadExchangeRates();
  }, []);

  // Convert amount from base currency (AED) to current currency
  const convertFromBase = (amountInAED) => {
    if (!amountInAED || amountInAED === 0) return 0;
    const currency = exchangeRates[currentCurrency];
    return amountInAED * currency.rate;
  };

  // Convert amount from current currency to base currency (AED)
  const convertToBase = (amountInCurrentCurrency) => {
    if (!amountInCurrentCurrency || amountInCurrentCurrency === 0) return 0;
    const currency = exchangeRates[currentCurrency];
    return amountInCurrentCurrency / currency.rate;
  };

  // Format amount in current currency
  const formatCurrency = (amount, currencyCode = currentCurrency) => {
    if (amount === null || amount === undefined) return '0';
    
    const currency = exchangeRates[currencyCode];
    if (!currency) return amount.toString();

    // Format based on currency
    switch (currencyCode) {
      case 'AED':
        return `د.إ${amount.toLocaleString('en-AE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
      case 'USD':
        return `$${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
      case 'BDT':
        return `৳${amount.toLocaleString('en-BD', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
      default:
        return amount.toLocaleString();
    }
  };

  // Get current currency info
  const getCurrentCurrency = () => exchangeRates[currentCurrency];

  // Get all available currencies
  const getAvailableCurrencies = () => Object.values(exchangeRates);

  // Check if amount is in base currency
  const isBaseCurrency = (currencyCode) => currencyCode === 'AED';

  const value = {
    currentCurrency,
    setCurrentCurrency,
    exchangeRates,
    loading,
    convertFromBase,
    convertToBase,
    formatCurrency,
    getCurrentCurrency,
    getAvailableCurrencies,
    isBaseCurrency,
    CURRENCIES
  };

  return (
    <CurrencyContext.Provider value={value}>
      {children}
    </CurrencyContext.Provider>
  );
};

export default CurrencyContext;
