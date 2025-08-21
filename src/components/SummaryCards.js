import React from 'react';
import { TrendingUp, DollarSign, Calendar, Target, TrendingDown, PiggyBank } from 'lucide-react';

const SummaryCards = ({ projects, currentMonth }) => {
  const currentMonthProjects = projects.filter(p => p.monthOfPayment === currentMonth);
  
  const totalProjects = currentMonthProjects.length;
  const totalDeposits = currentMonthProjects.reduce((sum, p) => sum + p.depositPaid, 0);
  const totalExpectedPayments = currentMonthProjects.reduce((sum, p) => sum + (p.totalAmount - p.depositPaid), 0);
  const targetAchievement = ((totalDeposits / 150000) * 100).toFixed(1);

  // Calculate meaningful progress metrics
  const completedProjects = currentMonthProjects.filter(p => p.status === 'Completed').length;
  const completionRate = totalProjects > 0 ? ((completedProjects / totalProjects) * 100).toFixed(1) : 0;
  
  const totalProjectValue = currentMonthProjects.reduce((sum, p) => sum + p.totalAmount, 0);
  const depositRate = totalProjectValue > 0 ? ((totalDeposits / totalProjectValue) * 100).toFixed(1) : 0;

  // Break-even calculations
  const monthlyFixedCosts = 50000; // Demo fixed costs
  const totalRevenue = totalDeposits + totalExpectedPayments;
  const breakEvenPercentage = ((totalRevenue / monthlyFixedCosts) * 100).toFixed(1);
  const isBreakEvenAchieved = totalRevenue >= monthlyFixedCosts;
  
  // Profit calculations
  const estimatedProfit = totalRevenue - monthlyFixedCosts;
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
      title: "Expected Payments",
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
      progressLabel: "Monthly Target",
      subtitle: parseFloat(targetAchievement) >= 100 ? "Target exceeded!" : `${targetAchievement}% of $150K`
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
      subtitle: `${breakEvenPercentage}% of $50K target`
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
      progressValue: isProfitPositive ? 100 : Math.min(100, Math.abs(estimatedProfit) / monthlyFixedCosts * 100),
      progressLabel: isProfitPositive ? "Profit Status" : "Loss Status",
      subtitle: isProfitPositive ? "Profit earned 🎉" : "Loss incurred"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
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
              <p className="text-sm text-white opacity-70">{card.subtitle}</p>
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
