// Exchange rates (in production, these would come from a currency API)
const EXCHANGE_RATES = {
  AED: 1.0,    // Base currency
  USD: 0.27,   // 1 AED = 0.27 USD
  BDT: 32.82   // 1 AED = 32.82 BDT (correct rate)
};

// Convert amount from one currency to another
const convertCurrency = (amount, fromCurrency, toCurrency) => {
  if (!amount || amount === 0) return 0;
  
  // First convert to base currency (AED)
  const amountInBase = amount / EXCHANGE_RATES[fromCurrency];
  
  // Then convert to target currency
  return amountInBase * EXCHANGE_RATES[toCurrency];
};

// Convert amount to base currency (AED)
const convertToBase = (amount, fromCurrency) => {
  return convertCurrency(amount, fromCurrency, 'AED');
};

// Convert amount from base currency (AED) to target currency
const convertFromBase = (amountInBase, toCurrency) => {
  return convertCurrency(amountInBase, 'AED', toCurrency);
};

// Validate currency code
const isValidCurrency = (currencyCode) => {
  return Object.keys(EXCHANGE_RATES).includes(currencyCode);
};

// Get all supported currencies
const getSupportedCurrencies = () => {
  return Object.keys(EXCHANGE_RATES).map(code => ({
    code,
    rate: EXCHANGE_RATES[code],
    isBase: code === 'AED'
  }));
};

// Get exchange rate between two currencies
const getExchangeRate = (fromCurrency, toCurrency) => {
  if (!isValidCurrency(fromCurrency) || !isValidCurrency(toCurrency)) {
    throw new Error('Invalid currency code');
  }
  
  if (fromCurrency === toCurrency) return 1;
  
  // Convert through base currency
  const fromRate = EXCHANGE_RATES[fromCurrency];
  const toRate = EXCHANGE_RATES[toCurrency];
  
  return toRate / fromRate;
};

// Update exchange rates (in production, this would fetch from API)
const updateExchangeRates = async () => {
  try {
    // Simulate API call to currency service
    // In production, this would be something like:
    // const response = await fetch('https://api.exchangerate-api.com/v4/latest/AED');
    // const data = await response.json();
    // EXCHANGE_RATES.USD = data.rates.USD;
    // EXCHANGE_RATES.BDT = data.rates.BDT;
    
    console.log('Exchange rates updated successfully');
    return true;
  } catch (error) {
    console.error('Failed to update exchange rates:', error);
    return false;
  }
};

// Process project data to include currency conversions
const processProjectData = (projectData) => {
  const processed = { ...projectData };
  
  // Convert total amount to base currency if not already
  if (projectData.totalAmount && projectData.totalAmountCurrency && !projectData.totalAmountInBase) {
    processed.totalAmountInBase = convertToBase(projectData.totalAmount, projectData.totalAmountCurrency);
  }
  
  // Convert deposit paid to base currency if not already
  if (projectData.depositPaid && projectData.depositPaidCurrency && !projectData.depositPaidInBase) {
    processed.depositPaidInBase = convertToBase(projectData.depositPaid, projectData.depositPaidCurrency);
  }
  
  // Process payment history
  if (projectData.paymentHistory) {
    processed.paymentHistory = projectData.paymentHistory.map(payment => ({
      ...payment,
      amountInBase: payment.amountInBase || convertToBase(payment.amount, payment.amountCurrency || 'AED')
    }));
  }
  
  // Process milestones
  if (projectData.milestones) {
    processed.milestones = projectData.milestones.map(milestone => ({
      ...milestone,
      amountInBase: milestone.amountInBase || convertToBase(milestone.amount, milestone.amountCurrency || 'AED')
    }));
  }
  
  return processed;
};

// Process monthly planning data to include currency conversions
const processMonthlyPlanningData = (planningData) => {
  const processed = { ...planningData };
  
  // Convert revenue to base currency if not already
  if (planningData.revenue && planningData.revenueCurrency && !planningData.revenueInBase) {
    processed.revenueInBase = convertToBase(planningData.revenue, planningData.revenueCurrency);
  }
  
  // Convert break-even to base currency if not already
  if (planningData.breakEven && planningData.breakEvenCurrency && !planningData.breakEvenInBase) {
    processed.breakEvenInBase = convertToBase(planningData.breakEven, planningData.breakEvenCurrency);
  }
  
  // Process overhead positions
  if (planningData.overhead) {
    processed.overhead = planningData.overhead.map(position => ({
      ...position,
      salaryInBase: position.salaryInBase || convertToBase(position.salary, position.salaryCurrency || 'AED')
    }));
  }
  
  // Process general expenses
  if (planningData.generalExpenses) {
    processed.generalExpenses = planningData.generalExpenses.map(expense => ({
      ...expense,
      amountInBase: expense.amountInBase || convertToBase(expense.amount, expense.amountCurrency || 'AED')
    }));
  }
  
  // Process revenue streams
  if (planningData.revenueStreams) {
    processed.revenueStreams = planningData.revenueStreams.map(stream => ({
      ...stream,
      amountInBase: stream.amountInBase || convertToBase(stream.amount, stream.amountCurrency || 'AED')
    }));
  }
  
  return processed;
};

module.exports = {
  convertCurrency,
  convertToBase,
  convertFromBase,
  isValidCurrency,
  getSupportedCurrencies,
  getExchangeRate,
  updateExchangeRates,
  processProjectData,
  processMonthlyPlanningData,
  EXCHANGE_RATES
};
