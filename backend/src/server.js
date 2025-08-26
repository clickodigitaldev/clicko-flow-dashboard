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
app.use(helmet());
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
  'https://clicko-flow-dashboard-production-7c2e.up.railway.app'
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
mongoose.connect(MONGODB_URI)
.then(async () => {
  console.log('✅ Connected to MongoDB');
  
  // Initialize database with default data if it's empty
  try {
    const OrgChart = require('./models/OrgChart');
    const existingOrgChart = await OrgChart.findOne();
    
    if (!existingOrgChart) {
      console.log('📊 Initializing database with default org chart data...');
      const defaultOrgChart = new OrgChart({
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
      
      await defaultOrgChart.save();
      console.log('✅ Default org chart data created');
    }
  } catch (error) {
    console.error('❌ Error initializing database:', error);
  }
})
.catch(err => console.error('❌ MongoDB connection error:', err));

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
    environment: process.env.NODE_ENV || 'development'
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

