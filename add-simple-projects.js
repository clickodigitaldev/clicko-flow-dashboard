const axios = require('axios');

const API_BASE_URL = 'https://clicko-flow-api.onrender.com/api';

// Simple test projects
const testProjects = [
  {
    projectName: 'Website Redesign',
    clientName: 'Tech Startup Inc',
    totalAmount: 25000,
    depositPaid: 8000,
    status: 'In Progress',
    priority: 'High',
    category: 'Web Development',
    description: 'Modern website redesign with responsive design',
    assignedTo: 'John Developer',
    progress: 45,
    monthOfPayment: 'August 2025',
    expectedStartDate: '2025-08-01',
    expectedCompletion: '2025-09-30'
  },
  {
    projectName: 'Mobile App Development',
    clientName: 'Retail Solutions',
    totalAmount: 35000,
    depositPaid: 12000,
    status: 'Planning',
    priority: 'Medium',
    category: 'Mobile Development',
    description: 'Cross-platform mobile app for retail management',
    assignedTo: 'Sarah Mobile',
    progress: 20,
    monthOfPayment: 'August 2025',
    expectedStartDate: '2025-08-15',
    expectedCompletion: '2025-10-15'
  },
  {
    projectName: 'SEO Campaign',
    clientName: 'Local Business Hub',
    totalAmount: 15000,
    depositPaid: 5000,
    status: 'Completed',
    priority: 'Low',
    category: 'Digital Marketing',
    description: 'Comprehensive SEO strategy and implementation',
    assignedTo: 'Alex Marketing',
    progress: 100,
    monthOfPayment: 'August 2025',
    expectedStartDate: '2025-07-01',
    expectedCompletion: '2025-08-31'
  }
];

async function addSimpleProjects() {
  console.log('🚀 Adding simple test projects...');
  
  for (const project of testProjects) {
    try {
      console.log(`📋 Adding: ${project.projectName}`);
      const response = await axios.post(`${API_BASE_URL}/projects`, project);
      console.log(`✅ Success: ${project.projectName} (ID: ${response.data._id})`);
    } catch (error) {
      console.log(`❌ Failed: ${project.projectName} - ${error.response?.data?.error || error.message}`);
    }
    
    // Small delay
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  console.log('\n🎉 Finished adding test projects!');
  console.log('📊 Check your dashboard to see the new data!');
}

// Run the script
addSimpleProjects();
