const mongoose = require('mongoose');

// Test MongoDB Atlas connection
async function testConnection() {
  console.log('🔍 Testing MongoDB Atlas connection...');
  
  try {
    // This will be set in Render environment variables
    const MONGODB_URI = process.env.MONGODB_URI;
    
    if (!MONGODB_URI) {
      console.log('❌ MONGODB_URI environment variable not set');
      console.log('💡 Please set MONGODB_URI in Render environment variables');
      return;
    }
    
    console.log('🔗 Attempting to connect to MongoDB Atlas...');
    
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('✅ Successfully connected to MongoDB Atlas!');
    
    // Test creating a simple document
    const TestSchema = new mongoose.Schema({
      name: String,
      timestamp: { type: Date, default: Date.now }
    });
    
    const TestModel = mongoose.model('Test', TestSchema);
    const testDoc = new TestModel({ name: 'Connection Test' });
    await testDoc.save();
    
    console.log('✅ Successfully created test document in database');
    
    // Clean up test document
    await TestModel.deleteOne({ name: 'Connection Test' });
    console.log('✅ Test document cleaned up');
    
    await mongoose.disconnect();
    console.log('✅ Disconnected from MongoDB Atlas');
    
  } catch (error) {
    console.error('❌ MongoDB Atlas connection failed:', error.message);
    console.log('\n🔧 Troubleshooting tips:');
    console.log('1. Check if MONGODB_URI is set in Render environment variables');
    console.log('2. Verify the connection string format');
    console.log('3. Ensure IP address is whitelisted in Atlas Network Access');
    console.log('4. Check if username/password are correct');
  }
}

// Run the test
testConnection();
