import React, { useState, useEffect } from 'react';
import { TrendingUp, DollarSign, Calendar, Target, TrendingDown, PiggyBank } from 'lucide-react';
import { useCurrency } from '../contexts/CurrencyContext';
import monthlyPlanningService from '../services/monthlyPlanningService';
import { getDepositsReceivedInMonth, getPaymentsDueInMonth, isProjectVisibleInMonth } from '../utils/forecastUtils';

const SummaryCards = ({ projects, currentMonth, settings }) => {
  const [forecastData, setForecastData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { formatCurrency, convertFromBase } = useCurrency();
  
  // Get the actual forecasting data from database
  useEffect(() => {
    const fetchForecastData = async () => {
      try {
        console.log('🔍 Starting to fetch forecast data...');
        setLoading(true);
        setError(null);
        
        // Try to get data from database first
        const monthData = await monthlyPlanningService.getMonthlyPlanningByMonth(currentMonth);
        console.log('🔍 API response:', monthData);
        
        if (monthData && monthData.success && monthData.data) {
          console.log('✅ Got data from database:', monthData.data);
          setForecastData(monthData.data);
        } else if (monthData && monthData.data) {
          // Handle case where success field might be missing
          console.log('✅ Got data from database (no success field):', monthData.data);
          setForecastData(monthData.data);
        } else if (monthData) {
          // Handle case where data is directly in monthData
          console.log('✅ Got data from database (direct):', monthData);
          setForecastData(monthData);
        } else {
          console.log('⚠️ No data from database');
        }
      } catch (error) {
        console.error('❌ Error fetching forecast data:', error);
        
        // Provide more specific error messages
        if (error.message.includes('401')) {
          setError('Authentication failed. Please refresh the page to get a new token.');
        } else if (error.message.includes('500')) {
          setError('Server error. Please try again later.');
        } else {
          setError(error.message);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchForecastData();
  }, [currentMonth]);

  if (loading) {
    return (
      <div className="glass-card p-6 text-center">
        <p className="text-white">Loading forecast data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="glass-card p-6 text-center">
        <p className="text-red-400 text-lg font-semibold">Error: {error}</p>
        <p className="text-white text-sm mt-2">Using fallback data</p>
        {error.includes('Authentication failed') && (
          <div className="mt-4 p-3 bg-blue-900 bg-opacity-50 rounded-lg">
            <p className="text-blue-200 text-sm">
              💡 <strong>Quick Fix:</strong> Refresh the page to get a new token.
            </p>
            <p className="text-blue-100 text-xs mt-1">
              Or open browser console and run: <code className="bg-blue-800 px-2 py-1 rounded">localStorage.removeItem('authToken')</code>
            </p>
          </div>
        )}
      </div>
    );
  }

  // Filter projects for current month (start date OR due date)
  const currentMonthProjects = projects.filter(p => isProjectVisibleInMonth(p, currentMonth));
  
  // Use database forecast data for calculations
  const totalProjects = currentMonthProjects.length;
  
  // Get forecast data for current month
  const forecastRevenueStreams = forecastData?.revenueStreams || [];
  const forecastOverhead = forecastData?.overhead || [];
  const forecastGeneralExpenses = forecastData?.generalExpenses || [];
  
  // Calculate totals from forecast data (these are in base currency)
  const expectedRevenueInBase = forecastRevenueStreams.reduce((sum, stream) => sum + (stream.amountInBase || stream.amount || 0), 0);
  const totalOverheadInBase = forecastOverhead.reduce((sum, pos) => sum + (pos.salaryInBase || pos.salary || 0), 0);
  const totalGeneralExpensesInBase = forecastGeneralExpenses.reduce((sum, exp) => sum + (exp.amountInBase || exp.amount || 0), 0);
  const totalExpensesInBase = totalOverheadInBase + totalGeneralExpensesInBase;
  
  // Convert to current currency for display
  const expectedRevenue = convertFromBase(expectedRevenueInBase);
  const totalExpenses = convertFromBase(totalExpensesInBase);
  
  // Calculate deposits received in current month using new logic
  const depositsReceivedInBase = getDepositsReceivedInMonth(projects, currentMonth);
  const totalDeposits = convertFromBase(depositsReceivedInBase);
  
  // Calculate payments due in current month using new logic
  const paymentsDueInBase = getPaymentsDueInMonth(projects, currentMonth);
  const totalExpectedPayments = convertFromBase(paymentsDueInBase);
  
  // Target Achievement = (Deposits received / Expected Revenue from forecast) * 100
  const targetAchievement = expectedRevenue > 0 ? Math.round((totalDeposits / expectedRevenue) * 100) : 0;

  // Calculate meaningful progress metrics
  const completedProjects = currentMonthProjects.filter(p => p.status === 'Completed').length;
  const completionRate = totalProjects > 0 ? ((completedProjects / totalProjects) * 100).toFixed(1) : 0;
  
  const totalProjectValueInBase = currentMonthProjects.reduce((sum, p) => sum + (p.totalAmountInBase || p.totalAmount || 0), 0);
  const totalProjectValue = convertFromBase(totalProjectValueInBase);
  const depositRate = totalProjectValue > 0 ? ((totalDeposits / totalProjectValue) * 100).toFixed(1) : 0;

  // Break-even Status = Deposits received vs Total Expenses
  const isBreakEvenAchieved = totalDeposits >= totalExpenses;
  const breakEvenPercentage = totalExpenses > 0 ? Math.round((totalDeposits / totalExpenses) * 100) : 100;
  
  // Estimated Profit = Deposits received - Total Expenses
  const estimatedProfit = totalDeposits - totalExpenses;
  const isProfitPositive = estimatedProfit >= 0;

  const cards = [
    {
      title: "Total Projects",
      value: totalProjects,
      icon: <Calendar className="w-6 h-6" />,
      gradient: "gradient-card-cyan",
      glow: "glow-cyan",
      delay: "0ms",
      color: "#06b6d4",
      showProgress: true,
      progressValue: completionRate,
      progressLabel: "Completion Rate",
      subtitle: `${completedProjects} completed`
    },
    {
      title: "Deposits Received",
      value: `${formatCurrency(totalDeposits)}`,
      icon: <DollarSign className="w-6 h-6" />,
      gradient: "gradient-card-green",
      glow: "glow-green",
      delay: "100ms",
      color: "#10b981",
      showProgress: true,
      progressValue: depositRate,
      progressLabel: "Deposit Rate",
      subtitle: `${depositRate}% collected`
    },
    {
      title: "Due in this Month",
      value: `${formatCurrency(totalExpectedPayments)}`,
      icon: <TrendingUp className="w-6 h-6" />,
      gradient: "gradient-card-purple",
      glow: "glow-purple",
      delay: "200ms",
      color: "#8b5cf6",
      showProgress: true,
      progressValue: completionRate,
      progressLabel: "Completion Rate",
      subtitle: `${completionRate}% completion`
    },
    {
      title: "Target Achievement",
      value: `${targetAchievement}%`,
      icon: <Target className="w-6 h-6" />,
      gradient: parseFloat(targetAchievement) >= 100 ? "gradient-card-green" : "gradient-card-pink",
      glow: parseFloat(targetAchievement) >= 100 ? "glow-green" : "glow-pink",
      delay: "300ms",
      color: parseFloat(targetAchievement) >= 100 ? "#10b981" : "#ec4899",
      showProgress: true,
      progressValue: Math.min(100, parseFloat(targetAchievement)),
      progressLabel: "Target Progress",
      subtitle: parseFloat(targetAchievement) >= 100 ? "Target exceeded!" : `${targetAchievement}% of ${formatCurrency(expectedRevenue)}`
    },
    {
      title: "Break-even Status",
      value: isBreakEvenAchieved ? "Achieved 🎉" : "Pending",
      icon: <TrendingDown className="w-6 h-6" />,
      gradient: isBreakEvenAchieved ? "gradient-card-green" : "gradient-card-orange",
      glow: isBreakEvenAchieved ? "glow-green" : "glow-orange",
      delay: "400ms",
      color: isBreakEvenAchieved ? "#10b981" : "#f97316",
      showProgress: true,
      progressValue: Math.min(100, parseFloat(breakEvenPercentage)),
      progressLabel: "Break-even Progress",
      subtitle: `${breakEvenPercentage}% of ${formatCurrency(totalExpenses)}`
    },
    {
      title: "Estimated Profit",
      value: `${formatCurrency(estimatedProfit)}`,
      icon: <PiggyBank className="w-6 h-6" />,
      gradient: isProfitPositive ? "gradient-card-green" : "gradient-card-red",
      glow: isProfitPositive ? "glow-green" : "glow-red",
      delay: "500ms",
      color: isProfitPositive ? "#10b981" : "#ef4444",
      showProgress: false,
      subtitle: isProfitPositive ? "Positive cash flow" : "Negative cash flow"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {cards.map((card, index) => (
        <div
          key={index}
          className={`glass-card p-6 ${card.gradient} ${card.glow} animate-fade-in-up`}
          style={{ animationDelay: card.delay }}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div 
                className="p-3 rounded-lg bg-white bg-opacity-10 backdrop-blur-sm"
                style={{ color: card.color }}
              >
                {card.icon}
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">{card.title}</h3>
                <p className="text-sm text-white opacity-70">{card.subtitle}</p>
              </div>
            </div>
          </div>
          
          <div className="mb-4">
            <div className="text-3xl font-bold text-white mb-2">{card.value}</div>
            {card.showProgress && (
              <div className="w-full bg-white bg-opacity-20 rounded-full h-2">
                <div 
                  className="h-2 rounded-full transition-all duration-500"
                  style={{ 
                    width: `${card.progressValue}%`,
                    backgroundColor: card.color
                  }}
                ></div>
              </div>
            )}
          </div>
          
          {card.showProgress && (
            <div className="flex justify-between items-center text-sm">
              <span className="text-white opacity-70">{card.progressLabel}</span>
              <span className="text-white font-medium">{card.progressValue}%</span>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default SummaryCards;
