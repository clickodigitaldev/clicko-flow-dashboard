const mongoose = require('mongoose');
require('dotenv').config();

async function testConnection() {
  try {
    console.log('🔌 Testing MongoDB connection...');
    console.log('MONGODB_URI:', process.env.MONGODB_URI ? 'Set' : 'Not set');
    
    if (!process.env.MONGODB_URI) {
      console.error('❌ MONGODB_URI environment variable is not set!');
      return;
    }

    // Test connection with timeout
    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    
    console.log('✅ MongoDB connection successful!');
    
    // Test a simple query
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('📊 Collections found:', collections.map(c => c.name));
    
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
}

testConnection();
