import React, { useState, useEffect } from 'react';
import { TrendingUp, DollarSign, Calendar, Target, TrendingDown, PiggyBank } from 'lucide-react';
import monthlyPlanningService from '../services/monthlyPlanningService';

const SummaryCards = ({ projects, currentMonth, settings }) => {
  const [forecastData, setForecastData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
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
        
        if (monthData) {
          console.log('✅ Got data from database:', monthData);
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

  // Filter projects by current month
  const currentMonthProjects = projects.filter(p => p.monthOfPayment === currentMonth);
  
  // Use database forecast data for calculations
  const totalProjects = currentMonthProjects.length;
  
  // Get forecast data for current month
  const forecastRevenueStreams = forecastData?.revenueStreams || [];
  const forecastOverhead = forecastData?.overheadExpenses || []; // Fixed property name
  const forecastGeneralExpenses = forecastData?.generalExpenses || [];
  
  // Calculate totals from forecast data
  const expectedRevenue = forecastRevenueStreams.reduce((sum, stream) => sum + (stream.amount || 0), 0);
  const totalOverhead = forecastOverhead.reduce((sum, pos) => sum + (pos.amount || 0), 0); // Fixed property name
  const totalGeneralExpenses = forecastGeneralExpenses.reduce((sum, exp) => sum + (exp.amount || 0), 0);
  const totalExpenses = totalOverhead + totalGeneralExpenses;
  
  // Use project data for deposits (actual received money) - current month projects
  const totalDeposits = currentMonthProjects.reduce((sum, p) => sum + p.depositPaid, 0);
  
  // Expected Payments = remaining payments from projects (current month projects)
  const totalExpectedPayments = currentMonthProjects.reduce((sum, p) => sum + (p.totalAmount - p.depositPaid), 0);
  
  // Use database target or fallback to default (commented out as not used in current calculation)
  // const monthlyTarget = settings?.monthlyTarget || 150000;
  
  // Target Achievement = (Deposits received / Expected Revenue from forecast) * 100
  const targetAchievement = expectedRevenue > 0 ? Math.round((totalDeposits / expectedRevenue) * 100) : 0;

  // Calculate meaningful progress metrics
  const completedProjects = currentMonthProjects.filter(p => p.status === 'Completed').length;
  const completionRate = totalProjects > 0 ? ((completedProjects / totalProjects) * 100).toFixed(1) : 0;
  
  const totalProjectValue = currentMonthProjects.reduce((sum, p) => sum + p.totalAmount, 0);
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
      value: `$${totalDeposits.toLocaleString()}`,
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
      value: `$${totalExpectedPayments.toLocaleString()}`,
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
      subtitle: parseFloat(targetAchievement) >= 100 ? "Target exceeded!" : `${targetAchievement}% of $${(expectedRevenue/1000).toFixed(0)}K`
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
      subtitle: `${breakEvenPercentage}% of $${(totalExpenses/1000).toFixed(0)}K expenses`
    },
    {
      title: "Estimated Profit",
      value: `$${estimatedProfit.toLocaleString()}`,
      icon: <PiggyBank className="w-6 h-6" />,
      gradient: isProfitPositive ? "gradient-card-green" : "gradient-card-orange",
      glow: isProfitPositive ? "glow-green" : "glow-orange",
      delay: "500ms",
      color: isProfitPositive ? "#10b981" : "#f97316",
      showProgress: true,
      progressValue: isProfitPositive ? 100 : Math.min(100, Math.abs(estimatedProfit) / totalExpenses * 100),
      progressLabel: "Profit Status",
      subtitle: isProfitPositive ? "Profit earned 🎉" : "Loss incurred"
    }
  ];

  return (
    <div className="widget-grid">
      {cards.map((card, index) => (
        <div 
          key={index} 
          className={`glass-card glass-card-hover p-6 animate-fade-in-up ${card.glow}`}
          style={{ animationDelay: card.delay }}
        >
          <div className="flex items-center justify-between mb-4">
            <div className={`icon-container ${card.gradient} text-white`}>
              {card.icon}
            </div>
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: card.color, opacity: 0.6 }}></div>
          </div>
          
          <div className="space-y-3">
            <p className="text-white text-sm font-medium opacity-90">{card.title}</p>
            <p className="text-3xl font-bold text-white">
              {card.value}
            </p>
            
            {/* Show subtitle for all cards */}
            {card.subtitle && (
              <p className="text-white text-sm opacity-70">{card.subtitle}</p>
            )}
            
            {/* Show progress bar for all cards */}
            {card.showProgress && (
              <>
                <div className="w-full bg-white bg-opacity-10 rounded-full h-2 mt-2">
                  <div 
                    className={`h-2 rounded-full ${card.gradient}`}
                    style={{ width: `${Math.min(100, parseFloat(card.progressValue))}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-xs text-white opacity-70 mt-1">
                  <span>{card.progressLabel}</span>
                  <span>{card.progressValue}%</span>
                </div>
              </>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default SummaryCards;
