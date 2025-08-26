import React, { useState } from 'react';
import { ChevronDown, Globe } from 'lucide-react';
import { useCurrency } from '../contexts/CurrencyContext';

const CurrencySwitcher = () => {
  const { currentCurrency, setCurrentCurrency, getAvailableCurrencies, loading } = useCurrency();
  const [isOpen, setIsOpen] = useState(false);

  const currencies = getAvailableCurrencies();
  const currentCurrencyInfo = currencies.find(c => c.code === currentCurrency);

  const handleCurrencyChange = (currencyCode) => {
    setCurrentCurrency(currencyCode);
    setIsOpen(false);
  };

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  if (loading) {
    return (
      <div className="flex items-center space-x-2 px-3 py-2 bg-white bg-opacity-10 rounded-lg">
        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
        <span className="text-white text-sm">Loading...</span>
      </div>
    );
  }

  return (
    <div className="relative currency-switcher">
      <button
        onClick={toggleDropdown}
        className="flex items-center space-x-3 px-5 py-2.5 bg-white bg-opacity-10 hover:bg-white hover:bg-opacity-20 rounded-lg border border-white border-opacity-20 transition-all duration-200 text-white min-w-[120px] justify-between"
      >
        <div className="flex items-center space-x-2">
          <Globe className="w-4 h-4 flex-shrink-0" />
          <span className="text-sm font-medium whitespace-nowrap">{currentCurrencyInfo?.flag} {currentCurrencyInfo?.code}</span>
        </div>
        <ChevronDown className={`w-4 h-4 transition-transform duration-200 flex-shrink-0 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-64 bg-gray-900 bg-opacity-95 backdrop-blur-lg border border-white border-opacity-30 rounded-lg shadow-xl z-50 dropdown">
          <div className="py-2">
            {currencies.map((currency) => (
              <button
                key={currency.code}
                onClick={() => handleCurrencyChange(currency.code)}
                className={`w-full flex items-center space-x-4 px-4 py-3 text-left hover:bg-white hover:bg-opacity-15 transition-colors duration-200 ${
                  currentCurrency === currency.code 
                    ? 'bg-blue-600 bg-opacity-50 text-blue-100' 
                    : 'text-white'
                }`}
              >
                <span className="text-lg flex-shrink-0 w-8 text-center">{currency.flag}</span>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm truncate">{currency.code}</div>
                </div>
                {currency.isBase && (
                  <span className="text-xs bg-green-500 bg-opacity-80 text-green-100 px-2 py-1 rounded-full flex-shrink-0">
                    Base
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CurrencySwitcher;
