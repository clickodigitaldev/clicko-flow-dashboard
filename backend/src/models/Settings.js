const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  // Business targets
  monthlyTargets: {
    type: Map,
    of: Number,
    default: new Map()
  },
  breakEvenAmount: {
    type: Number,
    default: 0
  },
  // Overhead expenses (staff positions)
  overheadExpenses: [{
    positionName: {
      type: String,
      required: true,
      trim: true
    },
    salary: {
      type: Number,
      required: true,
      min: 0
    },
    isActive: {
      type: Boolean,
      default: true
    },
    startDate: {
      type: Date,
      default: Date.now
    },
    endDate: Date
  }],
  // General expenses
  generalExpenses: [{
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
    category: {
      type: String,
      enum: ['rent', 'subscriptions', 'utilities', 'marketing', 'equipment', 'misc'],
      default: 'misc'
    },
    frequency: {
      type: String,
      enum: ['monthly', 'quarterly', 'yearly', 'one-time'],
      default: 'monthly'
    },
    isActive: {
      type: Boolean,
      default: true
    },
    startDate: {
      type: Date,
      default: Date.now
    },
    endDate: Date,
    notes: String
  }],
  // Business information
  businessInfo: {
    companyName: {
      type: String,
      trim: true
    },
    industry: {
      type: String,
      trim: true
    },
    currency: {
      type: String,
      default: 'USD'
    },
    timezone: {
      type: String,
      default: 'UTC'
    }
  },
  // Notification settings
  notifications: {
    emailAlerts: {
      type: Boolean,
      default: true
    },
    paymentReminders: {
      type: Boolean,
      default: true
    },
    projectDeadlines: {
      type: Boolean,
      default: true
    },
    weeklyReports: {
      type: Boolean,
      default: false
    }
  },
  // Salesmate integration settings
  salesmateSettings: {
    autoCreateProjects: {
      type: Boolean,
      default: true
    },
    syncFrequency: {
      type: String,
      enum: ['hourly', 'daily', 'weekly'],
      default: 'daily'
    },
    lastSync: Date
  }
}, {
  timestamps: true
});

// Index for better query performance
settingsSchema.index({ userId: 1 });

// Method to get total monthly overhead
settingsSchema.methods.getTotalMonthlyOverhead = function() {
  return this.overheadExpenses
    .filter(expense => expense.isActive)
    .reduce((total, expense) => total + expense.salary, 0);
};

// Method to get total monthly general expenses
settingsSchema.methods.getTotalMonthlyGeneralExpenses = function() {
  return this.generalExpenses
    .filter(expense => expense.isActive && expense.frequency === 'monthly')
    .reduce((total, expense) => total + expense.amount, 0);
};

// Method to get total quarterly general expenses
settingsSchema.methods.getTotalQuarterlyGeneralExpenses = function() {
  return this.generalExpenses
    .filter(expense => expense.isActive && expense.frequency === 'quarterly')
    .reduce((total, expense) => total + expense.amount, 0);
};

// Method to get total yearly general expenses
settingsSchema.methods.getTotalYearlyGeneralExpenses = function() {
  return this.generalExpenses
    .filter(expense => expense.isActive && expense.frequency === 'yearly')
    .reduce((total, expense) => total + expense.amount, 0);
};

// Method to get total monthly expenses
settingsSchema.methods.getTotalMonthlyExpenses = function() {
  const overhead = this.getTotalMonthlyOverhead();
  const general = this.getTotalMonthlyGeneralExpenses();
  const quarterly = this.getTotalQuarterlyGeneralExpenses() / 3;
  const yearly = this.getTotalYearlyGeneralExpenses() / 12;
  
  return overhead + general + quarterly + yearly;
};

module.exports = mongoose.model('Settings', settingsSchema);
