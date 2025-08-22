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
  overhead: [overheadPositionSchema],
  generalExpenses: [generalExpenseSchema],
  revenueStreams: [revenueStreamSchema],
  breakEven: {
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

// Virtual for total overhead
monthlyPlanningSchema.virtual('totalOverhead').get(function() {
  return this.overhead.reduce((sum, pos) => sum + (pos.salary || 0), 0);
});

// Virtual for total general expenses
monthlyPlanningSchema.virtual('totalGeneralExpenses').get(function() {
  return this.generalExpenses.reduce((sum, exp) => sum + (exp.amount || 0), 0);
});

// Virtual for total expenses
monthlyPlanningSchema.virtual('totalExpenses').get(function() {
  return this.totalOverhead + this.totalGeneralExpenses;
});

// Virtual for profit
monthlyPlanningSchema.virtual('profit').get(function() {
  return this.revenue - this.totalExpenses;
});

// Virtual for break-even status
monthlyPlanningSchema.virtual('isBreakEvenAchieved').get(function() {
  return this.revenue >= this.totalExpenses;
});

// Virtual for break-even progress
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
