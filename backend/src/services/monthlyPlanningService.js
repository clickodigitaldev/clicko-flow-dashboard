const MonthlyPlanning = require('../models/MonthlyPlanning');
const moment = require('moment');

class MonthlyPlanningService {
  // Get all monthly planning data for a user
  async getAllMonthlyPlanning(userId) {
    try {
      // Handle demo user differently
      let query = {};
      if (userId !== 'demo-user-123') {
        query.userId = userId;
      }
      query.isActive = true;
      
      const monthlyData = await MonthlyPlanning.find(query).sort({ monthDate: 1 });
      console.log(`📊 Found ${monthlyData.length} monthly planning records for user ${userId}`);
      
      return monthlyData;
    } catch (error) {
      throw new Error(`Failed to get monthly planning: ${error.message}`);
    }
  }

  // Get monthly planning by month
  async getMonthlyPlanningByMonth(userId, month) {
    try {
      let monthDate;
      if (month.includes('-')) {
        monthDate = moment(month, 'YYYY-MM');
      } else {
        monthDate = moment(month, 'MMMM YYYY');
      }

      if (!monthDate.isValid()) {
        throw new Error('Invalid month format');
      }

      // Handle demo user differently
      let monthData;
      if (userId === 'demo-user-123') {
        // For demo user, try to find by month only (no userId filter)
        monthData = await MonthlyPlanning.findOne({ month: month, isActive: true });
      } else {
        monthData = await MonthlyPlanning.findByMonth(userId, month);
      }
      
      console.log(`📊 Monthly planning for ${month}: ${monthData ? 'Found' : 'Not found'}`);
      return monthData;
    } catch (error) {
      throw new Error(`Failed to get monthly planning by month: ${error.message}`);
    }
  }

  // Create or update monthly planning
  async saveMonthlyPlanning(userId, monthData) {
    try {
      const { month, revenue, overhead, generalExpenses, revenueStreams, breakEven, notes } = monthData;

      if (!month) {
        throw new Error('Month is required');
      }

      // Parse month to date
      let monthDate;
      if (month.includes('-')) {
        monthDate = moment(month, 'YYYY-MM');
      } else {
        monthDate = moment(month, 'MMMM YYYY');
      }

      if (!monthDate.isValid()) {
        throw new Error('Invalid month format');
      }

      // Process currency fields for overhead positions
      const processedOverhead = (overhead || []).map(position => ({
        name: position.name || '',
        salary: position.salary || 0,
        team: position.team || 'service',
        salaryCurrency: 'AED', // Default to AED as base currency
        salaryInBase: position.salary || 0 // Store in base currency
      }));

      // Process currency fields for general expenses
      const processedGeneralExpenses = (generalExpenses || []).map(expense => ({
        name: expense.name || '',
        amount: expense.amount || 0,
        amountCurrency: 'AED', // Default to AED as base currency
        amountInBase: expense.amount || 0 // Store in base currency
      }));

      // Process currency fields for revenue streams
      const processedRevenueStreams = (revenueStreams || []).map(stream => ({
        name: stream.name || '',
        amount: stream.amount || 0,
        amountCurrency: 'AED', // Default to AED as base currency
        amountInBase: stream.amount || 0 // Store in base currency
      }));

      // Check if monthly planning already exists for this month
      let monthlyPlanning = await MonthlyPlanning.findOne({
        userId,
        month: month
      });

      if (monthlyPlanning) {
        // Update existing monthly planning
        monthlyPlanning.revenue = revenue || 0;
        monthlyPlanning.revenueCurrency = 'AED';
        monthlyPlanning.revenueInBase = revenue || 0;
        monthlyPlanning.overhead = processedOverhead;
        monthlyPlanning.generalExpenses = processedGeneralExpenses;
        monthlyPlanning.revenueStreams = processedRevenueStreams;
        monthlyPlanning.breakEven = breakEven || 0;
        monthlyPlanning.breakEvenCurrency = 'AED';
        monthlyPlanning.breakEvenInBase = breakEven || 0;
        monthlyPlanning.notes = notes || '';
        monthlyPlanning.monthDate = monthDate.toDate();
      } else {
        // Create new monthly planning
        monthlyPlanning = new MonthlyPlanning({
          userId,
          month: month,
          monthDate: monthDate.toDate(),
          revenue: revenue || 0,
          revenueCurrency: 'AED',
          revenueInBase: revenue || 0,
          overhead: processedOverhead,
          generalExpenses: processedGeneralExpenses,
          revenueStreams: processedRevenueStreams,
          breakEven: breakEven || 0,
          breakEvenCurrency: 'AED',
          breakEvenInBase: breakEven || 0,
          notes: notes || ''
        });
      }

      await monthlyPlanning.save();
      return monthlyPlanning;
    } catch (error) {
      throw new Error(`Failed to save monthly planning: ${error.message}`);
    }
  }

  // Initialize 24 months of monthly planning data
  async initializeMonthlyPlanning(userId) {
    try {
      const initialData = [];
      const currentDate = new Date();

      for (let i = 0; i < 24; i++) {
        const month = new Date(currentDate);
        month.setMonth(currentDate.getMonth() + i);
        const monthName = month.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

        // Check if month already exists
        const existingMonth = await MonthlyPlanning.findOne({
          userId,
          month: monthName
        });

        if (!existingMonth) {
          initialData.push({
            userId,
            month: monthName,
            monthDate: month,
            revenue: 150000,
            overhead: [
              { name: 'Developer', salary: 8000 },
              { name: 'Designer', salary: 6000 },
              { name: 'Project Manager', salary: 7000 }
            ],
            generalExpenses: [
              { name: 'Office Rent', amount: 3000 },
              { name: 'Software Subscriptions', amount: 500 },
              { name: 'Internet & Utilities', amount: 200 },
              { name: 'Marketing', amount: 1000 }
            ],
            revenueStreams: [
              { name: 'Web Development', amount: 80000 },
              { name: 'Mobile Development', amount: 70000 }
            ],
            breakEven: 120000,
            notes: ''
          });
        }
      }

      if (initialData.length > 0) {
        await MonthlyPlanning.insertMany(initialData);
      }

      return {
        initialized: initialData.length,
        message: `Initialized ${initialData.length} months of planning data`
      };
    } catch (error) {
      throw new Error(`Failed to initialize monthly planning: ${error.message}`);
    }
  }

  // Get monthly planning summary
  async getMonthlyPlanningSummary(userId) {
    try {
      const monthlyData = await MonthlyPlanning.find({ 
        userId, 
        isActive: true 
      }).sort({ monthDate: 1 });

      const summary = {
        totalRevenue: monthlyData.reduce((sum, month) => sum + month.revenue, 0),
        totalExpenses: monthlyData.reduce((sum, month) => sum + month.totalExpenses, 0),
        totalProfit: monthlyData.reduce((sum, month) => sum + month.profit, 0),
        averageMonthlyRevenue: monthlyData.length > 0 ? monthlyData.reduce((sum, month) => sum + month.revenue, 0) / monthlyData.length : 0,
        averageMonthlyExpenses: monthlyData.length > 0 ? monthlyData.reduce((sum, month) => sum + month.totalExpenses, 0) / monthlyData.length : 0,
        monthsAboveBreakEven: monthlyData.filter(month => month.isBreakEvenAchieved).length,
        totalMonths: monthlyData.length
      };

      return summary;
    } catch (error) {
      throw new Error(`Failed to get monthly planning summary: ${error.message}`);
    }
  }

  // Update specific fields of monthly planning
  async updateMonthlyPlanningFields(userId, monthId, updates) {
    try {
      const monthlyPlanning = await MonthlyPlanning.findOne({
        _id: monthId,
        userId
      });

      if (!monthlyPlanning) {
        throw new Error('Monthly planning not found');
      }

      // Update only the fields that are provided
      Object.keys(updates).forEach(key => {
        if (updates[key] !== undefined) {
          monthlyPlanning[key] = updates[key];
        }
      });

      await monthlyPlanning.save();
      return monthlyPlanning;
    } catch (error) {
      throw new Error(`Failed to update monthly planning fields: ${error.message}`);
    }
  }

  // Delete monthly planning (soft delete)
  async deleteMonthlyPlanning(userId, monthId) {
    try {
      const monthlyPlanning = await MonthlyPlanning.findOne({
        _id: monthId,
        userId
      });

      if (!monthlyPlanning) {
        throw new Error('Monthly planning not found');
      }

      // Soft delete by setting isActive to false
      monthlyPlanning.isActive = false;
      await monthlyPlanning.save();

      return { success: true, message: 'Monthly planning deleted successfully' };
    } catch (error) {
      throw new Error(`Failed to delete monthly planning: ${error.message}`);
    }
  }
}

module.exports = MonthlyPlanningService;
