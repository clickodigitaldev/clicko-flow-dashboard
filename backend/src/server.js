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

// Get port from environment or use default
const PORT = process.env.PORT || 5001;

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
let isDatabaseConnected = false;

// MongoDB connection with better error handling
const connectToMongoDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/clicko-flow';
    console.log(`🔗 Attempting to connect to MongoDB: ${mongoURI.replace(/\/\/.*@/, '//***:***@')}`);
    
    if (!mongoURI || mongoURI === 'mongodb://localhost:27017/clicko-flow') {
      console.log('⚠️ No remote MongoDB URI provided, using local fallback');
      isDatabaseConnected = false;
      return;
    }
    
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 30000, // 30 second timeout
      socketTimeoutMS: 60000, // 60 second timeout
      bufferMaxEntries: 0,
      bufferCommands: false,
    });
    
    console.log('✅ Successfully connected to MongoDB');
    isDatabaseConnected = true;
  } catch (err) {
    console.error('❌ MongoDB connection error:', err.message);
    console.log('⚠️ Running in demo mode without database connection');
    isDatabaseConnected = false;
    
    // Try to reconnect after 30 seconds
    setTimeout(connectToMongoDB, 30000);
  }
};

// Initial connection
connectToMongoDB();

// Simple working routes - no complex imports
console.log('🚀 Setting up simple working routes...');

// Projects endpoints
app.get('/api/projects', async (req, res) => {
  try {
    if (!isDatabaseConnected) {
      console.log('⚠️ Database not connected, serving demo projects');
      // Return demo projects when database is not available
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
      return res.json(demoProjects);
    }
    
    // Query the actual database for projects
    const Project = require('./models/Project');
    const projects = await Project.find({}).sort({ monthOfPayment: 1, expectedStartDate: 1 });
    
    console.log(`📊 Database query returned ${projects.length} projects`);
    res.json(projects);
  } catch (error) {
    console.error('Projects database error:', error);
    res.status(500).json({ error: 'Failed to get projects from database' });
  }
});

// Create new project
app.post('/api/projects', async (req, res) => {
  try {
    const Project = require('./models/Project');
    const projectData = req.body;
    
    // Add creation timestamp and default values
    projectData.createdAt = new Date();
    projectData.updatedAt = new Date();
    
    // Ensure required fields have default values
    if (!projectData.status) projectData.status = 'Planning';
    if (!projectData.priority) projectData.priority = 'Medium';
    if (!projectData.depositPaid) projectData.depositPaid = 0;
    if (!projectData.projectId) projectData.projectId = `PROJ${Date.now()}`;
    
    const newProject = new Project(projectData);
    const savedProject = await newProject.save();
    
    console.log('✅ New project created:', savedProject._id);
    res.status(201).json(savedProject);
  } catch (error) {
    console.error('Create project error:', error);
    res.status(500).json({ error: 'Failed to create project: ' + error.message });
  }
});

// Update project
app.put('/api/projects/:id', async (req, res) => {
  try {
    const Project = require('./models/Project');
    const { id } = req.params;
    const updateData = req.body;
    
    // Add update timestamp
    updateData.updatedAt = new Date();
    
    const updatedProject = await Project.findByIdAndUpdate(
      id, 
      updateData, 
      { new: true, runValidators: true }
    );
    
    if (!updatedProject) {
      return res.status(404).json({ error: 'Project not found' });
    }
    
    console.log('✅ Project updated:', id);
    res.json(updatedProject);
  } catch (error) {
    console.error('Update project error:', error);
    res.status(500).json({ error: 'Failed to update project' });
  }
});

// Monthly planning endpoints
app.get('/api/monthly-planning/:month', async (req, res) => {
  try {
    const month = req.params.month;
    
    if (!isDatabaseConnected) {
      console.log(`⚠️ Database not connected, serving demo monthly planning for ${month}`);
      // Return demo monthly planning when database is not available
      const demoData = {
        month: month,
        revenueStreams: [
          { name: 'Product & Service', amount: 25000 },
          { name: 'Ecommerce', amount: 15000 }
        ],
        overhead: [
          { name: 'Product Developer Team', salary: 8000 },
          { name: 'Service Team', salary: 6000 },
          { name: 'Management Team', salary: 4000 }
        ],
        generalExpenses: [
          { name: 'Office Rent', amount: 2000 },
          { name: 'Utilities', amount: 500 }
        ],
        notes: 'Demo data for testing purposes. Replace with real data when available.'
      };
      return res.json(demoData);
    }
    
    // Try to get data from database first
    const MonthlyPlanning = require('./models/MonthlyPlanning');
    const monthData = await MonthlyPlanning.findOne({ month: month });
    
    if (monthData) {
      console.log(`✅ Found monthly planning data for ${month}`);
      res.json(monthData);
    } else {
      console.log(`❌ No monthly planning data found for ${month}`);
      res.status(404).json({ error: `No monthly planning data found for ${month}` });
    }
  } catch (error) {
    console.error('Monthly planning database error:', error);
    res.status(500).json({ error: 'Failed to get monthly planning data' });
  }
});

// Save monthly planning data
app.post('/api/monthly-planning', async (req, res) => {
  try {
    const MonthlyPlanning = require('./models/MonthlyPlanning');
    const planningData = req.body;
    
    // Add timestamps
    planningData.createdAt = new Date();
    planningData.updatedAt = new Date();
    
    // Check if data for this month already exists
    const existingData = await MonthlyPlanning.findOne({ month: planningData.month });
    
    if (existingData) {
      // Update existing data
      const updatedData = await MonthlyPlanning.findByIdAndUpdate(
        existingData._id,
        planningData,
        { new: true, runValidators: true }
      );
      console.log(`✅ Monthly planning updated for ${planningData.month}`);
      res.json(updatedData);
    } else {
      // Create new data
      const newPlanning = new MonthlyPlanning(planningData);
      const savedPlanning = await newPlanning.save();
      console.log(`✅ New monthly planning created for ${planningData.month}`);
      res.status(201).json(savedPlanning);
    }
  } catch (error) {
    console.error('Save monthly planning error:', error);
    res.status(500).json({ error: 'Failed to save monthly planning data' });
  }
});

console.log('✅ Simple routes setup complete');

// Update project endpoint
app.put('/api/projects/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    console.log('✅ Project updated:', id);
    res.json({ 
      _id: id,
      ...updateData,
      updatedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('Update project error:', error);
    res.status(500).json({ error: 'Failed to update project' });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Clicko Flow API is running',
    timestamp: new Date().toISOString(),
    database: isDatabaseConnected ? 'Connected' : 'Demo Mode',
    environment: process.env.NODE_ENV || 'development',
    port: PORT,
    mongodb_uri: process.env.MONGODB_URI ? 'Set' : 'Not Set'
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

// Test endpoint with authentication (temporarily disabled)
// app.get('/api/test-auth', protect, (req, res) => {
//   try {
//     res.json({ 
//       status: 'Authentication working',
//       user: req.user,
//       timestamp: new Date().toISOString()
//     });
//   } catch (error) {
//     res.status(500).json({ error: 'Auth test failed' });
//   }
// });

console.log('🔧 Auth test endpoint temporarily disabled');

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

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 API available at http://localhost:${PORT}/api`);
  console.log(`🏥 Health check at http://localhost:${PORT}/api/health`);
  console.log(`🎭 Demo token endpoint at http://localhost:${PORT}/api/demo/token`);
  console.log(`🔐 Demo authentication enabled for user: demo-user-123`);
  console.log(`📊 Backend ready for demo users and real database access`);
  console.log(`🚀 FORCE REDEPLOY: Backend updated at ${new Date().toISOString()}`);
});
