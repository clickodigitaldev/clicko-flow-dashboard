const mongoose = require('mongoose');

const memberSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  position: {
    type: String,
    required: true,
    trim: true
  },
  salary: {
    type: Number,
    required: true,
    min: 0
  },
  salaryCurrency: {
    type: String,
    default: 'AED',
    enum: ['AED', 'USD', 'EUR', 'GBP', 'BDT']
  },
  salaryInBase: {
    type: Number,
    required: true
  },
  imageUrl: {
    type: String,
    default: null
  },
  email: {
    type: String,
    trim: true,
    lowercase: true
  },
  phone: {
    type: String,
    trim: true
  },
  joinDate: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['Active', 'Hiring', 'Warning'],
    default: 'Active'
  }
}, { timestamps: true });

const teamSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  role: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  imageUrl: {
    type: String,
    default: null
  },
  members: [memberSchema]
}, { timestamps: true });

const orgChartSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  ceo: {
    name: {
      type: String,
      required: true,
      default: 'Masud Rana'
    },
    position: {
      type: String,
      required: true,
      default: 'CEO / Founder'
    },
    salary: {
      type: Number,
      default: 0,
      min: 0
    },
    salaryCurrency: {
      type: String,
      default: 'AED',
      enum: ['AED', 'USD', 'EUR', 'GBP', 'BDT']
    },
    salaryInBase: {
      type: Number,
      default: 0
    },
    imageUrl: {
      type: String,
      default: null
    },
    email: {
      type: String,
      trim: true,
      lowercase: true
    },
    phone: {
      type: String,
      trim: true
    }
  },
  teams: [teamSchema],
  companyName: {
    type: String,
    trim: true,
    default: 'Clicko Flow'
  },
  companyLogo: {
    type: String,
    default: null
  },
  settings: {
    defaultCurrency: {
      type: String,
      default: 'AED',
      enum: ['AED', 'USD', 'EUR', 'GBP', 'BDT']
    },
    showSalaries: {
      type: Boolean,
      default: true
    },
    showImages: {
      type: Boolean,
      default: true
    }
  }
}, { timestamps: true });

// Virtual for total teams count
orgChartSchema.virtual('totalTeams').get(function() {
  return this.teams.length;
});

// Virtual for total members count
orgChartSchema.virtual('totalMembers').get(function() {
  const ceoCount = this.ceo?.name ? 1 : 0;
  const teamMembers = this.teams.reduce((sum, team) => sum + team.members.length, 0);
  return ceoCount + teamMembers;
});

// Virtual for total salary in base currency
orgChartSchema.virtual('totalSalaryInBase').get(function() {
  const ceoSalary = this.ceo?.salaryInBase || 0;
  const teamSalaries = this.teams.reduce((sum, team) => 
    sum + team.members.reduce((teamSum, member) => teamSum + member.salaryInBase, 0), 0
  );
  return ceoSalary + teamSalaries;
});

// Virtual for average salary in base currency
orgChartSchema.virtual('averageSalaryInBase').get(function() {
  const totalMembers = this.totalMembers;
  return totalMembers > 0 ? this.totalSalaryInBase / totalMembers : 0;
});

// Ensure virtuals are included when converting to JSON
orgChartSchema.set('toJSON', { virtuals: true });
orgChartSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('OrgChart', orgChartSchema);

