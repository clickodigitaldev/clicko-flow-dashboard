const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  projectId: {
    type: String,
    required: true,
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
  depositPaid: {
    type: Number,
    default: 0,
    min: [0, 'Deposit paid cannot be negative']
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
    enum: ['Pending', 'In Progress', 'Completed', 'On Hold', 'Cancelled'],
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
  // Salesmate integration fields
  salesmateDealId: {
    type: String,
    unique: true,
    sparse: true
  },
  salesmateDealValue: {
    type: Number
  },
  salesmateDealStage: {
    type: String
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
  // Payment tracking
  paymentHistory: [{
    amount: {
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
  // Milestones
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
projectSchema.index({ salesmateDealId: 1 });

// Virtual for remaining payment
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
