const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  projectId: {
    type: String,
    required: false,
    unique: true
  },
  projectName: {
    type: String,
    required: [true, 'Project name is required'],
    trim: true
  },
  clientName: {
    type: String,
    required: [true, 'Client name is required'],
    trim: true
  },
  totalAmount: {
    type: Number,
    required: [true, 'Total amount is required'],
    min: [0, 'Total amount cannot be negative']
  },
  // Currency fields for multi-currency support
  totalAmountCurrency: {
    type: String,
    enum: ['AED', 'USD', 'BDT'],
    default: 'AED',
    required: true
  },
  totalAmountInBase: {
    type: Number,
    required: [true, 'Total amount in base currency (AED) is required'],
    min: [0, 'Total amount in base currency cannot be negative']
  },
  depositPaid: {
    type: Number,
    default: 0,
    min: [0, 'Deposit paid cannot be negative']
  },
  // Currency fields for deposit
  depositPaidCurrency: {
    type: String,
    enum: ['AED', 'USD', 'BDT'],
    default: 'AED',
    required: true
  },
  depositPaidInBase: {
    type: Number,
    default: 0,
    min: [0, 'Deposit paid in base currency cannot be negative']
  },
  depositDate: {
    type: Date
  },
  expectedStartDate: {
    type: Date,
    required: [true, 'Expected start date is required']
  },
  expectedCompletion: {
    type: Date,
    required: [true, 'Expected completion date is required']
  },
  status: {
    type: String,
    enum: ['Pending', 'In Progress', 'Completed', 'On Hold', 'Cancelled', 'Planning'],
    default: 'Pending'
  },
  priority: {
    type: String,
    enum: ['Low', 'Medium', 'High', 'Critical'],
    default: 'Medium'
  },
  monthOfPayment: {
    type: String,
    required: true
  },
  // Additional project details
  description: {
    type: String,
    trim: true
  },
  tags: [{
    type: String,
    trim: true
  }],
  notes: {
    type: String,
    trim: true
  },
  // Salesmate integration fields
  salesmateDealId: {
    type: String,
    trim: true
  },
  salesmateDealValue: {
    type: String,
    trim: true
  },
  // Nifty integration fields
  niftyProjectId: {
    type: String,
    trim: true
  },
  // Payment tracking with currency support
  paymentHistory: [{
    amount: {
      type: Number,
      required: true
    },
    amountCurrency: {
      type: String,
      enum: ['AED', 'USD', 'BDT'],
      default: 'AED',
      required: true
    },
    amountInBase: {
      type: Number,
      required: true
    },
    date: {
      type: Date,
      required: true
    },
    type: {
      type: String,
      enum: ['deposit', 'milestone', 'final'],
      required: true
    },
    description: String
  }],
  // Milestones with currency support
  milestones: [{
    name: {
      type: String,
      required: true
    },
    dueDate: {
      type: Date,
      required: true
    },
    amount: {
      type: Number,
      required: true
    },
    amountCurrency: {
      type: String,
      enum: ['AED', 'USD', 'BDT'],
      default: 'AED',
      required: true
    },
    amountInBase: {
      type: Number,
      required: true
    },
    isCompleted: {
      type: Boolean,
      default: false
    },
    completedDate: Date
  }]
}, {
  timestamps: true
});

// Index for better query performance
projectSchema.index({ userId: 1, status: 1 });
projectSchema.index({ userId: 1, expectedCompletion: 1 });

// Virtual for remaining payment in base currency
projectSchema.virtual('remainingPaymentInBase').get(function() {
  return this.totalAmountInBase - this.depositPaidInBase;
});

// Virtual for remaining payment in current currency (for display)
projectSchema.virtual('remainingPayment').get(function() {
  return this.totalAmount - this.depositPaid;
});

// Virtual for project duration in days
projectSchema.virtual('duration').get(function() {
  const start = new Date(this.expectedStartDate);
  const end = new Date(this.expectedCompletion);
  return Math.ceil((end - start) / (1000 * 60 * 60 * 24));
});

// Ensure virtuals are serialized
projectSchema.set('toJSON', { virtuals: true });
projectSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Project', projectSchema);
