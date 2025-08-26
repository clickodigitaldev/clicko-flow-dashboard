const axios = require('axios');

const API_BASE_URL = 'https://clicko-flow-api.onrender.com/api';

// Dummy projects with all required fields
const dummyProjects = [
  {
    projectName: 'E-commerce Website',
    clientName: 'TechCorp Solutions',
    totalAmount: 45000,
    depositPaid: 15000,
    status: 'In Progress',
    priority: 'High',
    category: 'Web Development',
    description: 'Modern e-commerce platform with payment integration',
    assignedTo: 'John Developer',
    progress: 65,
    monthOfPayment: 'August 2025',
    expectedStartDate: '2025-08-01',
    expectedCompletion: '2025-09-30'
  },
  {
    projectName: 'Mobile App Development',
    clientName: 'Retail Innovations',
    totalAmount: 38000,
    depositPaid: 12000,
    status: 'Planning',
    priority: 'Medium',
    category: 'Mobile Development',
    description: 'Cross-platform mobile application for retail',
    assignedTo: 'Sarah Mobile',
    progress: 25,
    monthOfPayment: 'August 2025',
    expectedStartDate: '2025-08-15',
    expectedCompletion: '2025-10-15'
  },
  {
    projectName: 'SEO Campaign',
    clientName: 'Local Business Hub',
    totalAmount: 18000,
    depositPaid: 6000,
    status: 'Completed',
    priority: 'Low',
    category: 'Digital Marketing',
    description: 'Comprehensive SEO strategy implementation',
    assignedTo: 'Alex Marketing',
    progress: 100,
    monthOfPayment: 'August 2025',
    expectedStartDate: '2025-07-01',
    expectedCompletion: '2025-08-31'
  },
  {
    projectName: 'UI/UX Design',
    clientName: 'Creative Studios',
    totalAmount: 22000,
    depositPaid: 7000,
    status: 'In Progress',
    priority: 'Medium',
    category: 'Design',
    description: 'Complete design system and component library',
    assignedTo: 'Lisa Designer',
    progress: 45,
    monthOfPayment: 'August 2025',
    expectedStartDate: '2025-08-10',
    expectedCompletion: '2025-09-20'
  },
  {
    projectName: 'API Development',
    clientName: 'Fintech Startup',
    totalAmount: 48000,
    depositPaid: 16000,
    status: 'Planning',
    priority: 'High',
    category: 'Backend Development',
    description: 'RESTful API for financial services platform',
    assignedTo: 'Ryan API',
    progress: 10,
    monthOfPayment: 'August 2025',
    expectedStartDate: '2025-08-20',
    expectedCompletion: '2025-11-30'
  }
];

async function addDummyProjects() {
  console.log('🚀 Adding dummy projects to database...');
  console.log(`📊 Total projects to add: ${dummyProjects.length}`);
  
  let successCount = 0;
  let failCount = 0;
  
  for (const project of dummyProjects) {
    try {
      console.log(`📋 Adding: ${project.projectName}`);
      const response = await axios.post(`${API_BASE_URL}/projects`, project);
      console.log(`✅ Success: ${project.projectName} (ID: ${response.data._id})`);
      successCount++;
    } catch (error) {
      console.log(`❌ Failed: ${project.projectName} - ${error.response?.data?.error || error.message}`);
      failCount++;
    }
    
    // Small delay between requests
    await new Promise(resolve => setTimeout(resolve, 2000));
  }
  
  console.log('\n🎉 Finished adding dummy projects!');
  console.log(`✅ Successfully added: ${successCount} projects`);
  console.log(`❌ Failed to add: ${failCount} projects`);
  console.log('\n📊 Check your dashboard to see the new data!');
}

// Run the script
addDummyProjects();
