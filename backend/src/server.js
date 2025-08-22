const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const projectRoutes = require('./routes/projects');
const settingsRoutes = require('./routes/settings');
const forecastRoutes = require('./routes/forecast');
const salesmateRoutes = require('./routes/salesmate');
const monthlyPlanningRoutes = require('./routes/monthlyPlanning');

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
  'https://clicko-flow-api.onrender.com'
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

// Database connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/clicko-flow', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ Connected to MongoDB'))
.catch(err => console.error('❌ MongoDB connection error:', err));

// Routes - temporarily disabled to isolate issues
// app.use('/api/auth', authRoutes);
// app.use('/api/projects', projectRoutes);
// app.use('/api/settings', settingsRoutes);
// app.use('/api/forecast', forecastRoutes);
// app.use('/api/salesmate', salesmateRoutes);
// app.use('/api/monthly-planning', monthlyPlanningRoutes);

console.log('🔧 Routes temporarily disabled for debugging');

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Clicko Flow API is running',
    timestamp: new Date().toISOString()
  });
});

// Demo endpoint for development/testing
app.get('/api/demo/token', (req, res) => {
  try {
    // Create a demo user ID
    const demoUserId = 'demo-user-123';
    
    // Generate a JWT token that expires in 30 days
    // IMPORTANT: Use the same JWT_SECRET as the auth middleware
    const jwt = require('jsonwebtoken');
    
    if (!process.env.JWT_SECRET) {
      return res.status(500).json({ 
        error: 'JWT_SECRET not configured. Please set JWT_SECRET environment variable.' 
      });
    }
    
    const token = jwt.sign(
      { id: demoUserId }, 
      process.env.JWT_SECRET, // Use the exact same secret
      { expiresIn: '30d' }
    );
    
    res.json({
      success: true,
      token,
      user: {
        id: demoUserId,
        email: 'demo@clicko.com',
        firstName: 'Demo',
        lastName: 'User',
        company: 'Clicko Digital'
      }
    });
  } catch (error) {
    console.error('Demo token generation error:', error);
    res.status(500).json({ error: 'Failed to generate demo token' });
  }
});

// Demo data endpoints (no authentication required)
app.get('/api/demo/projects', (req, res) => {
  try {
    // Return demo projects data
    const demoProjects = [
      {
        _id: 'demo-proj-1',
        projectId: 'PROJ001',
        clientName: 'TechCorp Inc',
        projectName: 'E-commerce Platform',
        totalAmount: 50000,
        depositPaid: 15000,
        depositDate: '2025-08-01',
        expectedStartDate: '2025-08-01',
        expectedCompletion: '2025-09-30',
        status: 'In Progress',
        monthOfPayment: 'August 2025',
        priority: 'High',
        description: 'Modern e-commerce platform with payment integration',
        category: 'Web Development',
        assignedTo: 'John Developer',
        progress: 65
      },
      {
        _id: 'demo-proj-2',
        projectId: 'PROJ002',
        clientName: 'Digital Solutions',
        projectName: 'Mobile App Development',
        totalAmount: 35000,
        depositPaid: 10000,
        depositDate: '2025-08-05',
        expectedStartDate: '2025-08-05',
        expectedCompletion: '2025-10-15',
        status: 'Planning',
        monthOfPayment: 'August 2025',
        priority: 'Medium',
        description: 'Cross-platform mobile application',
        category: 'Mobile Development',
        assignedTo: 'Sarah Mobile',
        progress: 25
      }
    ];
    
    res.json(demoProjects);
  } catch (error) {
    console.error('Demo projects error:', error);
    res.status(500).json({ error: 'Failed to get demo projects' });
  }
});

// Test endpoint to check backend health
app.get('/api/test', (req, res) => {
  try {
    res.json({ 
      status: 'Backend is working',
      timestamp: new Date().toISOString(),
      message: 'If you see this, the backend is responding correctly'
    });
  } catch (error) {
    res.status(500).json({ error: 'Test endpoint failed' });
  }
});

// Test endpoint with authentication
app.get('/api/test-auth', protect, (req, res) => {
  try {
    res.json({ 
      status: 'Authentication working',
      user: req.user,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ error: 'Auth test failed' });
  }
});

app.get('/api/demo/monthly-planning/:month', (req, res) => {
  try {
    const month = req.params.month;
    
    // Return demo monthly planning data
    const demoData = {
      month: month,
      revenueStreams: [
        { name: 'Product & Service', amount: 25000 },
        { name: 'Ecommerce', amount: 15000 }
      ],
      overheadExpenses: [
        { name: 'Product Developer Team', amount: 8000 },
        { name: 'Service Team', amount: 6000 },
        { name: 'Management Team', amount: 4000 }
      ],
      generalExpenses: [
        { name: 'Office Rent', amount: 2000 },
        { name: 'Utilities', amount: 500 }
      ],
      notes: 'Demo data for testing purposes. Replace with real data when available.'
    };
    
    res.json({ data: demoData });
  } catch (error) {
    console.error('Demo monthly planning error:', error);
    res.status(500).json({ error: 'Failed to get demo monthly planning' });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Something went wrong!',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 API available at http://localhost:${PORT}/api`);
  console.log(`🏥 Health check at http://localhost:${PORT}/api/health`);
  console.log(`🎭 Demo token endpoint at http://localhost:${PORT}/api/demo/token`);
  console.log(`🔐 Demo authentication enabled for user: demo-user-123`);
  console.log(`📊 Backend ready for demo users and real database access`);
  console.log(`🚀 FORCE REDEPLOY: Backend updated at ${new Date().toISOString()}`);
});
