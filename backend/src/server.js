const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const projectRoutes = require('./routes/projects');
const settingsRoutes = require('./routes/settings');
const forecastRoutes = require('./routes/forecast');
const monthlyPlanningRoutes = require('./routes/monthlyPlanning');
const orgChartRoutes = require('./routes/orgChart');

const app = express();

// Middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      connectSrc: ["'self'", "https://clicko-flow-production.up.railway.app"]
    }
  }
}));
app.use(morgan('combined'));

// CORS configuration - allow both localhost and production domains
const allowedOrigins = [
  'http://localhost:3000', 
  'http://localhost:3001',
  process.env.CORS_ORIGIN,
  'https://clicko-flow-frontend.onrender.com',
  'https://clicko-flow-api.onrender.com',
  process.env.RAILWAY_STATIC_URL,
  process.env.RAILWAY_PUBLIC_DOMAIN,
  'https://clicko-flow-production.up.railway.app'
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Database connection - use Railway MongoDB or local MongoDB
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/clicko-flow';

console.log('🔌 Attempting to connect to MongoDB...');
console.log('🌍 Environment:', process.env.NODE_ENV);
console.log('📡 MONGODB_URI set:', !!MONGODB_URI);
if (MONGODB_URI) {
  console.log('🔗 Connection string preview:', MONGODB_URI.substring(0, 50) + '...');
}

mongoose.connect(MONGODB_URI)
.then(async () => {
  console.log('✅ Connected to MongoDB');
  
  // Initialize database with default data if it's empty
  try {
    const OrgChart = require('./models/OrgChart');
    const Project = require('./models/Project');
    const MonthlyPlanning = require('./models/MonthlyPlanning');
    
    // Check if collections exist and have data
    const existingOrgChart = await OrgChart.findOne();
    const existingProjects = await Project.findOne();
    const existingMonthlyPlanning = await MonthlyPlanning.findOne();
    
    console.log('📊 Database status:');
    console.log('   - Org Chart data:', existingOrgChart ? 'Found' : 'Not found');
    console.log('   - Projects data:', existingProjects ? 'Found' : 'Not found');
    console.log('   - Monthly Planning data:', existingMonthlyPlanning ? 'Found' : 'Not found');
    
    if (!existingOrgChart) {
      console.log('📊 Creating default org chart...');
      const defaultOrgChart = new OrgChart({
        userId: '68a79730091b06b0654ec04a',
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
            role: 'Product Development',
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
            role: 'Customer Service',
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
            role: 'Business Operations',
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
      await defaultOrgChart.save();
      console.log('✅ Default org chart created');
    }
    
    if (!existingProjects) {
      console.log('📋 Creating sample projects...');
      const sampleProjects = [
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
        }
      ];
      await Project.insertMany(sampleProjects);
      console.log('✅ Sample projects created');
    }
    
    if (!existingMonthlyPlanning) {
      console.log('📅 Creating sample monthly planning...');
      const sampleMonthlyPlanning = new MonthlyPlanning({
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
          }
        ]
      });
      await sampleMonthlyPlanning.save();
      console.log('✅ Sample monthly planning created');
    }
  } catch (error) {
    console.error('❌ Error initializing database:', error);
  }
})
.catch(err => {
  console.error('❌ MongoDB connection error:', err);
});

// Routes - API endpoints
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/monthly-planning', monthlyPlanningRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/forecast', forecastRoutes);
app.use('/api/org-chart', orgChartRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Clicko Flow API is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    mongodb_uri_set: !!process.env.MONGODB_URI
  });
});

// Serve static files from the React app build directory
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../../build')));
  
  // Handle React routing, return all requests to React app
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../../build', 'index.html'));
  });
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Something went wrong!',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// 404 handler for API routes
app.use('/api/*', (req, res) => {
  res.status(404).json({ error: 'API route not found' });
});

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 API available at http://localhost:${PORT}/api`);
  console.log(`🏥 Health check at http://localhost:${PORT}/api/health`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
});

