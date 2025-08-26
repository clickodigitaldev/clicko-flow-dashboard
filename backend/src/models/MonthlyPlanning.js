const mongoose = require('mongoose');

const overheadPositionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  salary: {
    type: Number,
    required: true,
    min: 0
  },
  team: {
    type: String,
    enum: ['service', 'product', 'management'],
    default: 'service',
    required: true
  },
  // Currency fields for multi-currency support
  salaryCurrency: {
    type: String,
    enum: ['AED', 'USD', 'BDT'],
    default: 'AED',
    required: true
  },
  salaryInBase: {
    type: Number,
    required: true,
    min: 0
  }
});

const generalExpenseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  // Currency fields for multi-currency support
  amountCurrency: {
    type: String,
    enum: ['AED', 'USD', 'BDT'],
    default: 'AED',
    required: true
  },
  amountInBase: {
    type: Number,
    required: true,
    min: 0
  }
});

const revenueStreamSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  // Currency fields for multi-currency support
  amountCurrency: {
    type: String,
    enum: ['AED', 'USD', 'BDT'],
    default: 'AED',
    required: true
  },
  amountInBase: {
    type: Number,
    required: true,
    min: 0
  }
});

const monthlyPlanningSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  month: {
    type: String,
    required: true,
    trim: true
  },
  monthDate: {
    type: Date,
    required: true
  },
  revenue: {
    type: Number,
    default: 0,
    min: 0
  },
  // Currency fields for multi-currency support
  revenueCurrency: {
    type: String,
    enum: ['AED', 'USD', 'BDT'],
    default: 'AED',
    required: true
  },
  revenueInBase: {
    type: Number,
    default: 0,
    min: 0
  },
  overhead: [overheadPositionSchema],
  generalExpenses: [generalExpenseSchema],
  revenueStreams: [revenueStreamSchema],
  breakEven: {
    type: Number,
    default: 0,
    min: 0
  },
  // Currency fields for break-even
  breakEvenCurrency: {
    type: String,
    enum: ['AED', 'USD', 'BDT'],
    default: 'AED',
    required: true
  },
  breakEvenInBase: {
    type: Number,
    default: 0,
    min: 0
  },
  notes: {
    type: String,
    trim: true,
    default: ''
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Index for efficient queries
monthlyPlanningSchema.index({ userId: 1, month: 1 });
monthlyPlanningSchema.index({ userId: 1, monthDate: 1 });

// Virtual for total overhead in base currency
monthlyPlanningSchema.virtual('totalOverheadInBase').get(function() {
  return this.overhead.reduce((sum, pos) => sum + (pos.salaryInBase || 0), 0);
});

// Virtual for total overhead in current currency (for display)
monthlyPlanningSchema.virtual('totalOverhead').get(function() {
  return this.overhead.reduce((sum, pos) => sum + (pos.salary || 0), 0);
});

// Team-specific overhead virtuals
monthlyPlanningSchema.virtual('serviceTeamOverheadInBase').get(function() {
  return this.overhead
    .filter(pos => pos.team === 'service')
    .reduce((sum, pos) => sum + (pos.salaryInBase || 0), 0);
});

monthlyPlanningSchema.virtual('serviceTeamOverhead').get(function() {
  return this.overhead
    .filter(pos => pos.team === 'service')
    .reduce((sum, pos) => sum + (pos.salary || 0), 0);
});

monthlyPlanningSchema.virtual('productTeamOverheadInBase').get(function() {
  return this.overhead
    .filter(pos => pos.team === 'product')
    .reduce((sum, pos) => sum + (pos.salaryInBase || 0), 0);
});

monthlyPlanningSchema.virtual('productTeamOverhead').get(function() {
  return this.overhead
    .filter(pos => pos.team === 'product')
    .reduce((sum, pos) => sum + (pos.salary || 0), 0);
});

monthlyPlanningSchema.virtual('managementTeamOverheadInBase').get(function() {
  return this.overhead
    .filter(pos => pos.team === 'management')
    .reduce((sum, pos) => sum + (pos.salaryInBase || 0), 0);
});

monthlyPlanningSchema.virtual('managementTeamOverhead').get(function() {
  return this.overhead
    .filter(pos => pos.team === 'management')
    .reduce((sum, pos) => sum + (pos.salary || 0), 0);
});

// Virtual for total general expenses in base currency
monthlyPlanningSchema.virtual('totalGeneralExpensesInBase').get(function() {
  return this.generalExpenses.reduce((sum, exp) => sum + (exp.amountInBase || 0), 0);
});

// Virtual for total general expenses in current currency (for display)
monthlyPlanningSchema.virtual('totalGeneralExpenses').get(function() {
  return this.generalExpenses.reduce((sum, exp) => sum + (exp.amount || 0), 0);
});

// Virtual for total expenses in base currency
monthlyPlanningSchema.virtual('totalExpensesInBase').get(function() {
  return this.totalOverheadInBase + this.totalGeneralExpensesInBase;
});

// Virtual for total expenses in current currency (for display)
monthlyPlanningSchema.virtual('totalExpenses').get(function() {
  return this.totalOverhead + this.totalGeneralExpenses;
});

// Virtual for profit in base currency
monthlyPlanningSchema.virtual('profitInBase').get(function() {
  return this.revenueInBase - this.totalExpensesInBase;
});

// Virtual for profit in current currency (for display)
monthlyPlanningSchema.virtual('profit').get(function() {
  return this.revenue - this.totalExpenses;
});

// Virtual for break-even status in base currency
monthlyPlanningSchema.virtual('isBreakEvenAchievedInBase').get(function() {
  return this.revenueInBase >= this.totalExpensesInBase;
});

// Virtual for break-even status in current currency (for display)
monthlyPlanningSchema.virtual('isBreakEvenAchieved').get(function() {
  return this.revenue >= this.totalExpenses;
});

// Virtual for break-even progress in base currency
monthlyPlanningSchema.virtual('breakEvenProgressInBase').get(function() {
  if (this.totalExpensesInBase <= 0) return 100;
  return Math.min(100, (this.revenueInBase / this.totalExpensesInBase) * 100);
});

// Virtual for break-even progress in current currency (for display)
monthlyPlanningSchema.virtual('breakEvenProgress').get(function() {
  if (this.totalExpenses <= 0) return 100;
  return Math.min(100, (this.revenue / this.totalExpenses) * 100);
});

// Ensure virtuals are included when converting to JSON
monthlyPlanningSchema.set('toJSON', { virtuals: true });
monthlyPlanningSchema.set('toObject', { virtuals: true });

// Static method to get monthly planning by month
monthlyPlanningSchema.statics.findByMonth = function(userId, month) {
  return this.findOne({ userId, month, isActive: true });
};

// Static method to get monthly planning by date range
monthlyPlanningSchema.statics.findByDateRange = function(userId, startDate, endDate) {
  return this.find({
    userId,
    monthDate: { $gte: startDate, $lte: endDate },
    isActive: true
  }).sort({ monthDate: 1 });
};

// Instance method to update overhead
monthlyPlanningSchema.methods.updateOverhead = function(overheadData) {
  this.overhead = overheadData;
  return this.save();
};

// Instance method to update general expenses
monthlyPlanningSchema.methods.updateGeneralExpenses = function(expensesData) {
  this.generalExpenses = expensesData;
  return this.save();
};

// Instance method to update revenue streams
monthlyPlanningSchema.methods.updateRevenueStreams = function(streamsData) {
  this.revenueStreams = streamsData;
  return this.save();
};

module.exports = mongoose.model('MonthlyPlanning', monthlyPlanningSchema);
