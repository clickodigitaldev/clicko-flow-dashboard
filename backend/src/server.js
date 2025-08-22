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

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/forecast', forecastRoutes);
app.use('/api/salesmate', salesmateRoutes);
app.use('/api/monthly-planning', monthlyPlanningRoutes);

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
    const jwt = require('jsonwebtoken');
    const token = jwt.sign(
      { id: demoUserId }, 
      process.env.JWT_SECRET || 'demo-secret-key',
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
});
