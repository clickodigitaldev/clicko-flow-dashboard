const mongoose = require('mongoose');
require('dotenv').config();

// Import models
const OrgChart = require('./backend/src/models/OrgChart');
const Project = require('./backend/src/models/Project');
const MonthlyPlanning = require('./backend/src/models/MonthlyPlanning');

// MongoDB connection string
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/clicko-flow';

async function initializeDatabase() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    console.log('🧹 Clearing existing data...');
    await OrgChart.deleteMany({});
    await Project.deleteMany({});
    await MonthlyPlanning.deleteMany({});
    console.log('✅ Existing data cleared');

    // Create Org Chart
    console.log('📊 Creating org chart data...');
    const orgChart = new OrgChart({
      ceo: {
        name: 'John Doe',
        position: 'CEO',
        email: 'ceo@clickoflow.com',
        phone: '+1234567890',
        salary: 150000,
        salaryCurrency: 'USD',
        salaryInBase: 150000,
        imageUrl: null
      },
      teams: [
        {
          name: 'Product Team',
          description: 'Product development and management',
          members: [
            {
              name: 'Alice Johnson',
              position: 'Product Manager',
              email: 'alice@clickoflow.com',
              phone: '+1234567891',
              salary: 80000,
              salaryCurrency: 'USD',
              salaryInBase: 80000,
              status: 'Active',
              imageUrl: null
            },
            {
              name: 'Bob Smith',
              position: 'UI/UX Designer',
              email: 'bob@clickoflow.com',
              phone: '+1234567892',
              salary: 70000,
              salaryCurrency: 'USD',
              salaryInBase: 70000,
              status: 'Active',
              imageUrl: null
            }
          ]
        },
        {
          name: 'Service Team',
          description: 'Customer service and support',
          members: [
            {
              name: 'Carol Davis',
              position: 'Customer Success Manager',
              email: 'carol@clickoflow.com',
              phone: '+1234567893',
              salary: 65000,
              salaryCurrency: 'USD',
              salaryInBase: 65000,
              status: 'Active',
              imageUrl: null
            }
          ]
        },
        {
          name: 'Management Team',
          description: 'Business operations and management',
          members: [
            {
              name: 'David Wilson',
              position: 'Operations Manager',
              email: 'david@clickoflow.com',
              phone: '+1234567894',
              salary: 75000,
              salaryCurrency: 'USD',
              salaryInBase: 75000,
              status: 'Active',
              imageUrl: null
            }
          ]
        }
      ]
    });

    await orgChart.save();
    console.log('✅ Org chart created');

    // Create Projects
    console.log('📋 Creating sample projects...');
    const projects = [
      {
        projectId: 'CL001',
        projectName: 'E-commerce Website',
        clientName: 'TechCorp Inc.',
        totalAmount: 50000,
        totalAmountCurrency: 'AED',
        totalAmountInBase: 50000,
        depositPaid: 15000,
        depositPaidCurrency: 'AED',
        depositPaidInBase: 15000,
        expectedStartDate: '2025-08-01',
        expectedCompletion: '2025-10-31',
        status: 'In Progress',
        priority: 'High',
        description: 'Full-stack e-commerce website development',
        tags: ['Web Development', 'E-commerce'],
        notes: 'Client requires payment gateway integration',
        userId: '68a79730091b06b0654ec04a',
        monthOfPayment: 'August 2025'
      },
      {
        projectId: 'CL002',
        projectName: 'Mobile App Development',
        clientName: 'StartupXYZ',
        totalAmount: 75000,
        totalAmountCurrency: 'AED',
        totalAmountInBase: 75000,
        depositPaid: 25000,
        depositPaidCurrency: 'AED',
        depositPaidInBase: 25000,
        expectedStartDate: '2025-09-01',
        expectedCompletion: '2025-12-31',
        status: 'Pending',
        priority: 'Medium',
        description: 'Cross-platform mobile application',
        tags: ['Mobile Development', 'React Native'],
        notes: 'Requires push notification setup',
        userId: '68a79730091b06b0654ec04a',
        monthOfPayment: 'September 2025'
      },
      {
        projectId: 'CL003',
        projectName: 'Corporate Website',
        clientName: 'Global Solutions Ltd.',
        totalAmount: 30000,
        totalAmountCurrency: 'AED',
        totalAmountInBase: 30000,
        depositPaid: 10000,
        depositPaidCurrency: 'AED',
        depositPaidInBase: 10000,
        expectedStartDate: '2025-08-15',
        expectedCompletion: '2025-09-30',
        status: 'Completed',
        priority: 'Low',
        description: 'Corporate website redesign',
        tags: ['Web Design', 'Corporate'],
        notes: 'Project completed successfully',
        userId: '68a79730091b06b0654ec04a',
        monthOfPayment: 'August 2025'
      }
    ];

    await Project.insertMany(projects);
    console.log('✅ Sample projects created');

    // Create Monthly Planning
    console.log('📅 Creating monthly planning data...');
    const monthlyPlanning = new MonthlyPlanning({
      userId: '68a79730091b06b0654ec04a',
      month: 'August 2025',
      revenueStreams: [
        {
          name: 'Web Development',
          amount: 50000,
          amountCurrency: 'AED',
          amountInBase: 50000
        },
        {
          name: 'Consulting',
          amount: 20000,
          amountCurrency: 'AED',
          amountInBase: 20000
        },
        {
          name: 'Mobile Development',
          amount: 30000,
          amountCurrency: 'AED',
          amountInBase: 30000
        }
      ],
      overheadExpenses: [
        {
          name: 'Developer Salary',
          amount: 15000,
          amountCurrency: 'AED',
          amountInBase: 15000
        },
        {
          name: 'Office Rent',
          amount: 8000,
          amountCurrency: 'AED',
          amountInBase: 8000
        },
        {
          name: 'Designer Salary',
          amount: 12000,
          amountCurrency: 'AED',
          amountInBase: 12000
        }
      ],
      generalExpenses: [
        {
          name: 'Software Subscriptions',
          amount: 2000,
          amountCurrency: 'AED',
          amountInBase: 2000
        },
        {
          name: 'Marketing',
          amount: 3000,
          amountCurrency: 'AED',
          amountInBase: 3000
        },
        {
          name: 'Utilities',
          amount: 1500,
          amountCurrency: 'AED',
          amountInBase: 1500
        }
      ]
    });

    await monthlyPlanning.save();
    console.log('✅ Monthly planning created');

    console.log('🎉 Database initialization completed successfully!');
    console.log('📊 Created:');
    console.log('   - 1 Org Chart with CEO and 3 teams');
    console.log('   - 3 Sample Projects');
    console.log('   - 1 Monthly Planning record');

  } catch (error) {
    console.error('❌ Error initializing database:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
}

// Run the initialization
initializeDatabase();
