const mongoose = require('mongoose');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/clicko-flow', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const User = require('./backend/src/models/User');

async function createDemoUser() {
  try {
    // Check if demo user already exists
    let demoUser = await User.findOne({ email: 'demo@clickoflow.com' });
    
    if (!demoUser) {
      // Create demo user
      demoUser = await User.create({
        email: 'demo@clickoflow.com',
        password: 'demo123456',
        firstName: 'Demo',
        lastName: 'User',
        company: 'Clicko Digital',
        role: 'admin',
        salesmateApiKey: 'e55130c0-d0b7-11ee-9435-517682d0b702',
        salesmateBaseUrl: 'https://clickodigital.salesmate.io'
      });
      
      console.log('✅ Demo user created:', demoUser._id);
    } else {
      console.log('✅ Demo user already exists:', demoUser._id);
    }
    
    // Update Salesmate credentials
    demoUser.salesmateApiKey = 'e55130c0-d0b7-11ee-9435-517682d0b702';
    demoUser.salesmateBaseUrl = 'https://clickodigital.salesmate.io';
    await demoUser.save();
    
    console.log('✅ Demo user updated with Salesmate credentials');
    console.log('📋 User ID for testing:', demoUser._id);
    
    mongoose.connection.close();
  } catch (error) {
    console.error('❌ Error creating demo user:', error);
    mongoose.connection.close();
  }
}

createDemoUser();




