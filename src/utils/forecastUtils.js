import { parseISO, isSameMonth, isSameYear, startOfMonth, endOfMonth } from 'date-fns';

export const calculateMonthlyExpenses = (settings) => {
  const totalOverhead = settings?.overhead?.reduce((sum, item) => sum + (item.salary || 0), 0) || 0;
  const totalGeneralExpenses = settings?.generalExpenses?.reduce((sum, item) => sum + (item.amount || 0), 0) || 0;
  return totalOverhead + totalGeneralExpenses;
};

// Helper function to check if a project should be shown in a specific month
export const isProjectVisibleInMonth = (project, targetMonth) => {
  const targetMonthDate = new Date(targetMonth);
  
  // Check if project start date is in target month
  if (project.expectedStartDate) {
    const startDate = parseISO(project.expectedStartDate);
    if (isSameMonth(startDate, targetMonthDate) && isSameYear(startDate, targetMonthDate)) {
      return true;
    }
  }
  
  // Check if project due date is in target month
  if (project.expectedCompletion) {
    const dueDate = parseISO(project.expectedCompletion);
    if (isSameMonth(dueDate, targetMonthDate) && isSameYear(dueDate, targetMonthDate)) {
      return true;
    }
  }
  
  return false;
};

// Helper function to calculate deposits received in a specific month
export const getDepositsReceivedInMonth = (projects, targetMonth) => {
  const targetMonthDate = new Date(targetMonth);
  
  return projects.reduce((total, project) => {
    // Check payment history for deposits received in target month
    if (project.paymentHistory && Array.isArray(project.paymentHistory)) {
      const monthDeposits = project.paymentHistory
        .filter(payment => {
          const paymentDate = new Date(payment.date);
          return payment.type === 'deposit' && 
                 isSameMonth(paymentDate, targetMonthDate) && 
                 isSameYear(paymentDate, targetMonthDate);
        })
        .reduce((sum, payment) => sum + (payment.amount || 0), 0);
      
      return total + monthDeposits;
    }
    
    // Fallback: check depositDate if no payment history
    if (project.depositDate) {
      const depositDate = parseISO(project.depositDate);
      if (isSameMonth(depositDate, targetMonthDate) && isSameYear(depositDate, targetMonthDate)) {
        return total + (project.depositPaid || 0);
      }
    }
    
    return total;
  }, 0);
};

// Helper function to calculate payments due in a specific month
export const getPaymentsDueInMonth = (projects, targetMonth) => {
  const targetMonthDate = new Date(targetMonth);
  
  return projects.reduce((total, project) => {
    // Check if project is due in target month
    if (project.expectedCompletion) {
      const dueDate = parseISO(project.expectedCompletion);
      if (isSameMonth(dueDate, targetMonthDate) && isSameYear(dueDate, targetMonthDate)) {
        // Calculate remaining payment for this project
        const totalAmount = project.totalAmount || 0;
        const totalDepositsReceived = project.paymentHistory && Array.isArray(project.paymentHistory) 
          ? project.paymentHistory
              .filter(payment => payment.type === 'deposit')
              .reduce((sum, payment) => sum + (payment.amount || 0), 0)
          : (project.depositPaid || 0);
        
        const remainingPayment = Math.max(0, totalAmount - totalDepositsReceived);
        return total + remainingPayment;
      }
    }
    
    return total;
  }, 0);
};

export const getFinancialSummary = (projects, currentMonth, settings) => {
  // Get current month date for calculations
  const currentMonthDate = new Date(currentMonth);
  
  // Filter projects for current month (projects with start date OR due date in current month)
  const currentMonthProjects = projects.filter(p => isProjectVisibleInMonth(p, currentMonth));
  
  // Calculate deposits received in current month
  const depositsReceivedThisMonth = getDepositsReceivedInMonth(projects, currentMonth);
  
  // Calculate expected payments due in current month
  const expectedPayments = getPaymentsDueInMonth(projects, currentMonth);

  // Calculate total deal value for current month projects
  const totalDealValue = currentMonthProjects.reduce((sum, p) => sum + (p.totalAmount || 0), 0);

  // Calculate total deposits for current month projects (regardless of when received)
  const totalDepositsForCurrentMonth = currentMonthProjects.reduce((sum, p) => {
    if (p.paymentHistory && Array.isArray(p.paymentHistory)) {
      return sum + p.paymentHistory
        .filter(payment => payment.type === 'deposit')
        .reduce((sum, payment) => sum + (payment.amount || 0), 0);
    }
    return sum + (p.depositPaid || 0);
  }, 0);

  // Calculate KPIs
  const totalProjects = currentMonthProjects.length;
  const completedProjects = currentMonthProjects.filter(p => p.status === 'Completed').length;
  const completionRate = totalProjects > 0 ? ((completedProjects / totalProjects) * 100) : 0;
  const depositRate = totalDealValue > 0 ? ((totalDepositsForCurrentMonth / totalDealValue) * 100) : 0;

  // Calculate break-even analysis
  const totalExpenses = settings.overheadExpenses + settings.generalExpenses;
  
  // Total monthly revenue = deposits received this month + expected payments
  const monthlyRevenue = depositsReceivedThisMonth + expectedPayments;
  
  // Check if break-even is achieved
  const isBreakEvenAchieved = monthlyRevenue >= totalExpenses;
  
  // Calculate break-even progress
  const breakEvenProgress = totalExpenses > 0 ? Math.min(100, (monthlyRevenue / totalExpenses) * 100) : 0;
  
  // Calculate actual profit after deducting expenses
  const profit = monthlyRevenue - totalExpenses;
  const isProfitPositive = profit >= 0;

  // Calculate target achievement
  const monthlyTarget = settings.monthlyTarget;
  const targetAchievement = monthlyTarget > 0 ? Math.min(100, (monthlyRevenue / monthlyTarget) * 100) : 0;
  const isTargetAchieved = monthlyRevenue >= monthlyTarget;

  return {
    // Project KPIs
    totalProjects,
    completedProjects,
    completionRate: completionRate.toFixed(1),
    
    // Financial KPIs
    depositsReceived: depositsReceivedThisMonth,
    totalDepositsForCurrentMonth,
    expectedPayments,
    totalDealValue,
    depositRate: depositRate.toFixed(1),
    
    // Revenue and Target KPIs
    monthlyRevenue,
    targetAchievement: targetAchievement.toFixed(1),
    isTargetAchieved,
    monthlyTarget,
    
    // Break-even and Profit KPIs
    breakEvenAnalysis: {
      isBreakEvenAchieved,
      breakEvenProgress: breakEvenProgress.toFixed(1),
      breakEvenTarget: totalExpenses, // Break-even point is total expenses
      totalExpenses,
      profit,
      isProfitPositive
    }
  };
};

export const getMonthlyData = (projects, month) => {
  const monthDate = new Date(month);
  
  // Filter projects for this month (start date OR due date)
  const monthProjects = projects.filter(p => isProjectVisibleInMonth(p, month));
  
  // Calculate deposits received in the specific month
  const monthDeposits = getDepositsReceivedInMonth(projects, month);
  
  // Calculate payments due in the specific month
  const monthPaymentsDue = getPaymentsDueInMonth(projects, month);

  const totalRevenue = monthProjects.reduce((sum, p) => sum + (p.totalAmount || 0), 0);
  const totalDeposits = monthProjects.reduce((sum, p) => {
    if (p.paymentHistory && Array.isArray(p.paymentHistory)) {
      return sum + p.paymentHistory
        .filter(payment => payment.type === 'deposit')
        .reduce((sum, payment) => sum + (payment.amount || 0), 0);
    }
    return sum + (p.depositPaid || 0);
  }, 0);

  return {
    deposits: monthDeposits,
    paymentsDue: monthPaymentsDue,
    totalRevenue,
    totalDeposits,
    projectCount: monthProjects.length,
    completedProjects: monthProjects.filter(p => p.status === 'Completed').length
  };
};

// New function to get monthly trends data for charts
export const getMonthlyTrendsData = (projects, months) => {
  return months.map(month => {
    const monthData = getMonthlyData(projects, month);
    return {
      month,
      deposits: monthData.deposits,
      paymentsDue: monthData.paymentsDue,
      totalRevenue: monthData.totalRevenue,
      projectCount: monthData.projectCount
    };
  });
};

export const getProjectStatusColor = (status) => {
  switch (status) {
    case 'Completed': return 'text-green-400';
    case 'In Progress': return 'text-blue-400';
    case 'Pending': return 'text-yellow-400';
    case 'On Hold': return 'text-orange-400';
    case 'Cancelled': return 'text-red-400';
    default: return 'text-gray-400';
  }
};

export const getPriorityColor = (priority) => {
  switch (priority) {
    case 'Critical': return 'text-red-400';
    case 'High': return 'text-orange-400';
    case 'Medium': return 'text-yellow-400';
    case 'Low': return 'text-green-400';
    default: return 'text-gray-400';
  }
};
