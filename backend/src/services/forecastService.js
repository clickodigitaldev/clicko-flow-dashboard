const moment = require('moment');
const Project = require('../models/Project');
const Settings = require('../models/Settings');

class ForecastService {
  constructor() {
    this.months = 24;
  }

  // Generate 24-month forecast
  async generateForecast(userId) {
    try {
      const settings = await Settings.findOne({ userId });
      const projects = await Project.find({ userId });

      if (!settings) {
        throw new Error('User settings not found');
      }

      const forecast = {
        months: [],
        summary: {
          totalRevenue: 0,
          totalExpenses: 0,
          totalProfit: 0,
          averageMonthlyRevenue: 0,
          averageMonthlyExpenses: 0,
          averageMonthlyProfit: 0,
          breakEvenMonth: null,
          profitableMonths: 0
        }
      };

      const startDate = moment().startOf('month');
      let totalRevenue = 0;
      let totalExpenses = 0;
      let breakEvenMonth = null;
      let profitableMonths = 0;

      // Generate forecast for each month
      for (let i = 0; i < this.months; i++) {
        const currentMonth = moment(startDate).add(i, 'months');
        const monthKey = currentMonth.format('MMMM YYYY');

        const monthForecast = await this.calculateMonthForecast(
          currentMonth,
          projects,
          settings
        );

        forecast.months.push({
          month: monthKey,
          date: currentMonth.toDate(),
          ...monthForecast
        });

        totalRevenue += monthForecast.revenue;
        totalExpenses += monthForecast.expenses;

        // Check for break-even month
        if (!breakEvenMonth && monthForecast.profit >= 0) {
          breakEvenMonth = monthKey;
        }

        if (monthForecast.profit > 0) {
          profitableMonths++;
        }
      }

      // Calculate summary
      forecast.summary = {
        totalRevenue,
        totalExpenses,
        totalProfit: totalRevenue - totalExpenses,
        averageMonthlyRevenue: totalRevenue / this.months,
        averageMonthlyExpenses: totalExpenses / this.months,
        averageMonthlyProfit: (totalRevenue - totalExpenses) / this.months,
        breakEvenMonth,
        profitableMonths
      };

      return forecast;
    } catch (error) {
      throw new Error(`Forecast generation failed: ${error.message}`);
    }
  }

  // Calculate forecast for a specific month
  async calculateMonthForecast(currentMonth, projects, settings) {
    const monthKey = currentMonth.format('MMMM YYYY');
    const monthStart = currentMonth.clone().startOf('month');
    const monthEnd = currentMonth.clone().endOf('month');

    // Calculate revenue from projects
    const revenue = this.calculateMonthRevenue(projects, monthStart, monthEnd);

    // Calculate expenses
    const expenses = this.calculateMonthExpenses(settings, monthStart, monthEnd);

    // Calculate profit
    const profit = revenue - expenses;

    // Calculate profit margin
    const profitMargin = revenue > 0 ? (profit / revenue) * 100 : 0;

    return {
      revenue,
      expenses,
      profit,
      profitMargin,
      target: settings.monthlyTargets.get(monthKey) || 0,
      targetAchievement: revenue > 0 ? (revenue / (settings.monthlyTargets.get(monthKey) || 1)) * 100 : 0,
      breakEvenGap: profit - (settings.breakEvenAmount || 0)
    };
  }

  // Calculate revenue for a specific month
  calculateMonthRevenue(projects, monthStart, monthEnd) {
    let revenue = 0;

    projects.forEach(project => {
      const completionDate = moment(project.expectedCompletion);
      const monthOfPayment = completionDate.format('MMMM YYYY');
      const targetMonth = monthStart.format('MMMM YYYY');

      // If project completes in this month, add to revenue
      if (monthOfPayment === targetMonth && project.status !== 'Cancelled') {
        revenue += project.totalAmount;
      }

      // Add milestone payments
      if (project.milestones && project.milestones.length > 0) {
        project.milestones.forEach(milestone => {
          const milestoneDate = moment(milestone.dueDate);
          if (milestoneDate.isBetween(monthStart, monthEnd, 'day', '[]') && milestone.isCompleted) {
            revenue += milestone.amount;
          }
        });
      }
    });

    return revenue;
  }

  // Calculate expenses for a specific month
  calculateMonthExpenses(settings, monthStart, monthEnd) {
    let expenses = 0;

    // Add overhead expenses (staff salaries)
    settings.overheadExpenses.forEach(expense => {
      if (expense.isActive) {
        const startDate = moment(expense.startDate);
        const endDate = expense.endDate ? moment(expense.endDate) : null;

        // Check if expense is active in this month
        if (startDate.isSameOrBefore(monthEnd) && (!endDate || endDate.isSameOrAfter(monthStart))) {
          expenses += expense.salary;
        }
      }
    });

    // Add general expenses
    settings.generalExpenses.forEach(expense => {
      if (expense.isActive) {
        const startDate = moment(expense.startDate);
        const endDate = expense.endDate ? moment(expense.endDate) : null;

        // Check if expense is active in this month
        if (startDate.isSameOrBefore(monthEnd) && (!endDate || endDate.isSameOrAfter(monthStart))) {
          switch (expense.frequency) {
            case 'monthly':
              expenses += expense.amount;
              break;
            case 'quarterly':
              // Check if this is a quarter boundary month
              if (monthStart.month() % 3 === 0) {
                expenses += expense.amount;
              }
              break;
            case 'yearly':
              // Check if this is January
              if (monthStart.month() === 0) {
                expenses += expense.amount;
              }
              break;
            case 'one-time':
              // Check if this is the month of the expense
              if (startDate.isBetween(monthStart, monthEnd, 'day', '[]')) {
                expenses += expense.amount;
              }
              break;
          }
        }
      }
    });

    return expenses;
  }

  // Get cash flow projection
  async getCashFlowProjection(userId) {
    try {
      const settings = await Settings.findOne({ userId });
      const projects = await Project.find({ userId });

      if (!settings) {
        throw new Error('User settings not found');
      }

      const projection = [];
      const startDate = moment().startOf('month');

      for (let i = 0; i < 12; i++) {
        const currentMonth = moment(startDate).add(i, 'months');
        const monthKey = currentMonth.format('MMMM YYYY');

        const monthForecast = await this.calculateMonthForecast(
          currentMonth,
          projects,
          settings
        );

        projection.push({
          month: monthKey,
          projected: monthForecast.revenue,
          actual: 0, // This would be calculated from actual payments
          expenses: monthForecast.expenses,
          profit: monthForecast.profit
        });
      }

      return projection;
    } catch (error) {
      throw new Error(`Cash flow projection failed: ${error.message}`);
    }
  }

  // Get profitability analysis
  async getProfitabilityAnalysis(userId) {
    try {
      const settings = await Settings.findOne({ userId });
      const projects = await Project.find({ userId });

      if (!settings) {
        throw new Error('User settings not found');
      }

      const analysis = {
        totalProjectValue: projects.reduce((sum, p) => sum + p.totalAmount, 0),
        totalDeposits: projects.reduce((sum, p) => sum + p.depositPaid, 0),
        totalRemaining: projects.reduce((sum, p) => sum + (p.totalAmount - p.depositPaid), 0),
        monthlyExpenses: settings.getTotalMonthlyExpenses(),
        breakEvenAmount: settings.breakEvenAmount,
        projectsByStatus: {},
        averageProjectValue: 0,
        completionRate: 0
      };

      // Calculate projects by status
      projects.forEach(project => {
        analysis.projectsByStatus[project.status] = (analysis.projectsByStatus[project.status] || 0) + 1;
      });

      // Calculate averages
      analysis.averageProjectValue = projects.length > 0 ? analysis.totalProjectValue / projects.length : 0;
      analysis.completionRate = projects.length > 0 ? 
        ((analysis.projectsByStatus['Completed'] || 0) / projects.length) * 100 : 0;

      return analysis;
    } catch (error) {
      throw new Error(`Profitability analysis failed: ${error.message}`);
    }
  }
}

module.exports = ForecastService;
