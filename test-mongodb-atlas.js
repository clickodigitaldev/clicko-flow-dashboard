const mongoose = require('mongoose');

// Test MongoDB Atlas connection
async function testAtlasConnection() {
  console.log('🔍 Testing MongoDB Atlas connection...');
  
  try {
    const MONGODB_URI = 'mongodb+srv://clickoflow:clickoflow123@cluster0.iyzvuzc.mongodb.net/clicko-flow?retryWrites=true&w=majority&appName=Cluster0';
    
    console.log('🔗 Attempting to connect to MongoDB Atlas...');
    
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
    });
    
    console.log('✅ Successfully connected to MongoDB Atlas!');
    
    // Test creating a simple document
    const TestSchema = new mongoose.Schema({
      name: String,
      timestamp: { type: Date, default: Date.now }
    });
    
    const TestModel = mongoose.model('Test', TestSchema);
    const testDoc = new TestModel({ name: 'Atlas Connection Test' });
    await testDoc.save();
    
    console.log('✅ Successfully created test document in Atlas database');
    
    // Clean up test document
    await TestModel.deleteOne({ name: 'Atlas Connection Test' });
    console.log('✅ Test document cleaned up');
    
    await mongoose.disconnect();
    console.log('✅ Disconnected from MongoDB Atlas');
    
  } catch (error) {
    console.error('❌ MongoDB Atlas connection failed:', error.message);
    console.log('\n🔧 Troubleshooting tips:');
    console.log('1. Check if IP address 59.153.102.56 is whitelisted in Atlas');
    console.log('2. Verify username/password are correct');
    console.log('3. Check if cluster is running');
  }
}

// Run the test
testAtlasConnection();
