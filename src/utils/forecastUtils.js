import { parseISO, isSameMonth, isSameYear } from 'date-fns';

export const calculateMonthlyExpenses = (settings) => {
  const totalOverhead = settings?.overhead?.reduce((sum, item) => sum + (item.salary || 0), 0) || 0;
  const totalGeneralExpenses = settings?.generalExpenses?.reduce((sum, item) => sum + (item.amount || 0), 0) || 0;
  return totalOverhead + totalGeneralExpenses;
};



export const getFinancialSummary = (projects, currentMonth, settings) => {
  // Get current month date for calculations
  const currentMonthDate = new Date(currentMonth);
  
  // For financial calculations (revenue, deposits, expected payments):
  // Only include projects that are DUE this month or have deposits RECEIVED this month
  const currentMonthProjects = projects.filter(project => {
    const depositDate = project.depositDate ? parseISO(project.depositDate) : null;
    
    // Check if deposit was received this month
    const depositReceivedThisMonth = depositDate && 
      isSameMonth(depositDate, currentMonthDate) && 
      isSameYear(depositDate, currentMonthDate);
    
    // Check if project is due this month
    const dueThisMonth = project.monthOfPayment === currentMonth;
    
    return depositReceivedThisMonth || dueThisMonth;
  });
  
  // Calculate deposits received in current month (Revenue this month)
  // Rule: If deposit date is this month → count deposit under "Revenue this month"
  const depositsReceivedThisMonth = projects.reduce((total, project) => {
    if (project.depositDate) {
      const depositDate = parseISO(project.depositDate);
      
      // Check if deposit was received in current month
      if (isSameMonth(depositDate, currentMonthDate) && isSameYear(depositDate, currentMonthDate)) {
        return total + project.depositPaid;
      }
    }
    return total;
  }, 0);

  // Calculate expected payments (remaining payments for projects due this month)
  // Rule: If due date is this month → count remaining value under "Expected Payments"
  const expectedPayments = currentMonthProjects.reduce((total, project) => {
    // Only count remaining payments for projects that are not completed
    if (project.status !== 'Completed') {
      const remainingPayment = project.totalAmount - project.depositPaid;
      return total + remainingPayment;
    }
    return total;
  }, 0);

  // Calculate total deal value for current month
  const totalDealValue = currentMonthProjects.reduce((sum, p) => sum + p.totalAmount, 0);

  // Calculate total deposits for current month projects (regardless of when received)
  const totalDepositsForCurrentMonth = currentMonthProjects.reduce((sum, p) => sum + p.depositPaid, 0);

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

// Separate function for project table filtering (shows all active projects)
export const getActiveProjectsForTable = (projects, currentMonth) => {
  const currentMonthDate = new Date(currentMonth);
  
  return projects.filter(project => {
    const projectStartDate = project.expectedStartDate ? parseISO(project.expectedStartDate) : null;
    const depositDate = project.depositDate ? parseISO(project.depositDate) : null;
    
    // Check if project started this month
    const startedThisMonth = projectStartDate && 
      isSameMonth(projectStartDate, currentMonthDate) && 
      isSameYear(projectStartDate, currentMonthDate);
    
    // Check if deposit was received this month
    const depositReceivedThisMonth = depositDate && 
      isSameMonth(depositDate, currentMonthDate) && 
      isSameYear(depositDate, currentMonthDate);
    
    // Check if project is due this month
    const dueThisMonth = project.monthOfPayment === currentMonth;
    
    // Check if project is ongoing (started before this month and not completed)
    const isOngoing = projectStartDate && 
      projectStartDate < currentMonthDate && 
      project.status !== 'Completed';
    
    return startedThisMonth || depositReceivedThisMonth || dueThisMonth || isOngoing;
  });
};

export const getMonthlyData = (projects, month) => {
  const monthDate = new Date(month);
  const monthProjects = projects.filter(p => p.monthOfPayment === month);
  
  // Calculate deposits received in the specific month
  const monthDeposits = projects.reduce((total, project) => {
    if (project.depositDate) {
      const depositDate = parseISO(project.depositDate);
      
      if (isSameMonth(depositDate, monthDate) && isSameYear(depositDate, monthDate)) {
        return total + project.depositPaid;
      }
    }
    return total;
  }, 0);

  const totalRevenue = monthProjects.reduce((sum, p) => sum + p.totalAmount, 0);
  const remainingPayments = monthProjects.reduce((sum, p) => {
    // Only count remaining payments for projects that are not completed
    if (p.status !== 'Completed') {
      return sum + (p.totalAmount - p.depositPaid);
    }
    return sum;
  }, 0);
  const totalDeposits = monthProjects.reduce((sum, p) => sum + p.depositPaid, 0);

  return {
    deposits: monthDeposits,
    totalRevenue,
    remainingPayments,
    totalDeposits,
    projectCount: monthProjects.length,
    completedProjects: monthProjects.filter(p => p.status === 'Completed').length
  };
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
