const mongoose = require('mongoose');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/clicko-flow', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ Connected to MongoDB'))
.catch(err => console.error('❌ MongoDB connection error:', err));

// Import User model
const User = require('./backend/src/models/User');

async function createDemoUser() {
  try {
    // Check if demo user already exists
    const existingUser = await User.findOne({ email: 'demo@clicko.com' });
    
    if (existingUser) {
      console.log('✅ Demo user already exists:', existingUser._id);
      return existingUser._id;
    }
    
    // Create demo user
    const demoUser = new User({
      email: 'demo@clicko.com',
      password: 'demo123456',
      firstName: 'Demo',
      lastName: 'User',
      company: 'Clicko Digital',
      role: 'admin'
    });
    
    const savedUser = await demoUser.save();
    console.log('✅ Demo user created:', savedUser._id);
    return savedUser._id;
    
  } catch (error) {
    console.error('❌ Error creating demo user:', error);
    throw error;
  }
}

// Run the function
createDemoUser()
  .then(() => {
    console.log('🎉 Demo user setup completed!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Demo user setup failed:', error);
    process.exit(1);
  });
