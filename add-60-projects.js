const axios = require('axios');

const API_BASE_URL = 'https://clicko-flow-api.onrender.com/api';

// 6 months of data
const months = [
  'August 2025', 'September 2025', 'October 2025', 
  'November 2025', 'December 2025', 'January 2026'
];

// 10 project templates with realistic data
const projectTemplates = [
  {
    projectName: 'E-commerce Platform Development',
    clientName: 'TechCorp Solutions',
    totalAmount: 45000,
    depositPaid: 15000,
    status: 'In Progress',
    priority: 'High',
    category: 'Web Development',
    description: 'Full-stack e-commerce platform with payment integration',
    assignedTo: 'John Developer',
    progress: 65
  },
  {
    projectName: 'Mobile App for Retail',
    clientName: 'Retail Innovations Inc',
    totalAmount: 38000,
    depositPaid: 12000,
    status: 'Planning',
    priority: 'Medium',
    category: 'Mobile Development',
    description: 'Cross-platform mobile application for retail management',
    assignedTo: 'Sarah Mobile',
    progress: 25
  },
  {
    projectName: 'Corporate Website Redesign',
    clientName: 'Global Enterprises',
    totalAmount: 28000,
    depositPaid: 9000,
    status: 'Completed',
    priority: 'Low',
    category: 'Web Development',
    description: 'Modern responsive corporate website with CMS',
    assignedTo: 'Mike Designer',
    progress: 100
  },
  {
    projectName: 'UI/UX Design System',
    clientName: 'Creative Studios',
    totalAmount: 22000,
    depositPaid: 7000,
    status: 'In Progress',
    priority: 'Medium',
    category: 'Design',
    description: 'Complete design system and component library',
    assignedTo: 'Lisa Designer',
    progress: 45
  },
  {
    projectName: 'SEO Optimization Campaign',
    clientName: 'Local Business Hub',
    totalAmount: 18000,
    depositPaid: 6000,
    status: 'Planning',
    priority: 'Low',
    category: 'Digital Marketing',
    description: 'Comprehensive SEO strategy and implementation',
    assignedTo: 'Alex Marketing',
    progress: 15
  },
  {
    projectName: 'Content Management System',
    clientName: 'Publishing House Ltd',
    totalAmount: 42000,
    depositPaid: 14000,
    status: 'In Progress',
    priority: 'High',
    category: 'Web Development',
    description: 'Custom CMS for content publishers',
    assignedTo: 'Tom Backend',
    progress: 55
  },
  {
    projectName: 'Social Media Marketing',
    clientName: 'Restaurant Chain Corp',
    totalAmount: 25000,
    depositPaid: 8000,
    status: 'Completed',
    priority: 'Medium',
    category: 'Digital Marketing',
    description: 'Social media campaign management and strategy',
    assignedTo: 'Emma Social',
    progress: 100
  },
  {
    projectName: 'Database Architecture Design',
    clientName: 'Healthcare Provider Inc',
    totalAmount: 35000,
    depositPaid: 11000,
    status: 'Planning',
    priority: 'High',
    category: 'Database',
    description: 'Patient database system design and optimization',
    assignedTo: 'David DBA',
    progress: 20
  },
  {
    projectName: 'API Development Services',
    clientName: 'Fintech Startup',
    totalAmount: 48000,
    depositPaid: 16000,
    status: 'In Progress',
    priority: 'High',
    category: 'Backend Development',
    description: 'RESTful API for financial services platform',
    assignedTo: 'Ryan API',
    progress: 70
  },
  {
    projectName: 'Cloud Migration Project',
    clientName: 'Enterprise Solutions',
    totalAmount: 65000,
    depositPaid: 22000,
    status: 'Planning',
    priority: 'High',
    category: 'DevOps',
    description: 'Legacy system migration to cloud infrastructure',
    assignedTo: 'Chris DevOps',
    progress: 10
  }
];

// Monthly planning data for each month
const monthlyPlanningData = [
  {
    month: 'August 2025',
    revenueStreams: [
      { name: 'Product & Service', amount: 25000 },
      { name: 'Ecommerce', amount: 15000 },
      { name: 'Consulting', amount: 10000 }
    ],
    overhead: [
      { name: 'Product Developer Team', salary: 8000 },
      { name: 'Service Team', salary: 6000 },
      { name: 'Management Team', salary: 4000 }
    ],
    generalExpenses: [
      { name: 'Office Rent', amount: 2000 },
      { name: 'Utilities', amount: 500 },
      { name: 'Internet', amount: 300 }
    ]
  },
  {
    month: 'September 2025',
    revenueStreams: [
      { name: 'Product & Service', amount: 30000 },
      { name: 'Ecommerce', amount: 20000 },
      { name: 'Consulting', amount: 12000 }
    ],
    overhead: [
      { name: 'Product Developer Team', salary: 8500 },
      { name: 'Service Team', salary: 6500 },
      { name: 'Management Team', salary: 4500 }
    ],
    generalExpenses: [
      { name: 'Office Rent', amount: 2000 },
      { name: 'Utilities', amount: 600 },
      { name: 'Internet', amount: 300 }
    ]
  },
  {
    month: 'October 2025',
    revenueStreams: [
      { name: 'Product & Service', amount: 35000 },
      { name: 'Ecommerce', amount: 25000 },
      { name: 'Consulting', amount: 15000 }
    ],
    overhead: [
      { name: 'Product Developer Team', salary: 9000 },
      { name: 'Service Team', salary: 7000 },
      { name: 'Management Team', salary: 5000 }
    ],
    generalExpenses: [
      { name: 'Office Rent', amount: 2000 },
      { name: 'Utilities', amount: 700 },
      { name: 'Internet', amount: 300 }
    ]
  },
  {
    month: 'November 2025',
    revenueStreams: [
      { name: 'Product & Service', amount: 40000 },
      { name: 'Ecommerce', amount: 30000 },
      { name: 'Consulting', amount: 18000 }
    ],
    overhead: [
      { name: 'Product Developer Team', salary: 9500 },
      { name: 'Service Team', salary: 7500 },
      { name: 'Management Team', salary: 5500 }
    ],
    generalExpenses: [
      { name: 'Office Rent', amount: 2000 },
      { name: 'Utilities', amount: 800 },
      { name: 'Internet', amount: 300 }
    ]
  },
  {
    month: 'December 2025',
    revenueStreams: [
      { name: 'Product & Service', amount: 45000 },
      { name: 'Ecommerce', amount: 35000 },
      { name: 'Consulting', amount: 20000 }
    ],
    overhead: [
      { name: 'Product Developer Team', salary: 10000 },
      { name: 'Service Team', salary: 8000 },
      { name: 'Management Team', salary: 6000 }
    ],
    generalExpenses: [
      { name: 'Office Rent', amount: 2000 },
      { name: 'Utilities', amount: 900 },
      { name: 'Internet', amount: 300 }
    ]
  },
  {
    month: 'January 2026',
    revenueStreams: [
      { name: 'Product & Service', amount: 50000 },
      { name: 'Ecommerce', amount: 40000 },
      { name: 'Consulting', amount: 25000 }
    ],
    overhead: [
      { name: 'Product Developer Team', salary: 10500 },
      { name: 'Service Team', salary: 8500 },
      { name: 'Management Team', salary: 6500 }
    ],
    generalExpenses: [
      { name: 'Office Rent', amount: 2000 },
      { name: 'Utilities', amount: 1000 },
      { name: 'Internet', amount: 300 }
    ]
  }
];

async function addProjectsAndPlanning() {
  console.log('🚀 Starting to add 60 projects and monthly planning data...');
  
  try {
    // First, add monthly planning data
    console.log('📊 Adding monthly planning data...');
    for (const planningData of monthlyPlanningData) {
      try {
        const response = await axios.post(`${API_BASE_URL}/monthly-planning`, planningData);
        console.log(`✅ Added monthly planning for ${planningData.month}`);
      } catch (error) {
        console.log(`⚠️ Monthly planning for ${planningData.month} already exists or failed:`, error.response?.data || error.message);
      }
    }
    
    // Then, add projects for each month
    console.log('📋 Adding projects for each month...');
    for (const month of months) {
      console.log(`\n📅 Processing ${month}...`);
      
      for (let i = 0; i < 10; i++) {
        const template = projectTemplates[i];
        const projectData = {
          ...template,
          projectId: `PROJ${month.replace(' ', '').substring(0, 3)}${String(i + 1).padStart(2, '0')}`,
          monthOfPayment: month,
          expectedStartDate: getRandomDate(month),
          expectedCompletion: getRandomCompletionDate(month),
          depositDate: getRandomDate(month)
        };
        
        try {
          const response = await axios.post(`${API_BASE_URL}/projects`, projectData);
          console.log(`  ✅ Added project: ${projectData.projectName}`);
        } catch (error) {
          console.log(`  ⚠️ Failed to add project: ${projectData.projectName} - ${error.response?.data || error.message}`);
        }
        
        // Small delay to avoid overwhelming the server
        await new Promise(resolve => setTimeout(resolve, 200));
      }
    }
    
    console.log('\n🎉 Database population completed!');
    console.log(`📊 Added ${months.length} monthly planning records`);
    console.log(`📋 Added ${months.length * 10} projects`);
    
  } catch (error) {
    console.error('❌ Error populating database:', error.message);
  }
}

function getRandomDate(monthStr) {
  const month = monthStr.split(' ')[0];
  const year = monthStr.split(' ')[1];
  const monthIndex = new Date(Date.parse(month + " 1, 2000")).getMonth();
  const day = Math.floor(Math.random() * 28) + 1;
  return new Date(parseInt(year), monthIndex, day).toISOString().split('T')[0];
}

function getRandomCompletionDate(monthStr) {
  const month = monthStr.split(' ')[0];
  const year = monthStr.split(' ')[1];
  const monthIndex = new Date(Date.parse(month + " 1, 2000")).getMonth();
  const day = Math.floor(Math.random() * 28) + 1;
  // Add 1-3 months to start date
  const monthsToAdd = Math.floor(Math.random() * 3) + 1;
  return new Date(parseInt(year), monthIndex + monthsToAdd, day).toISOString().split('T')[0];
}

// Run the population script
addProjectsAndPlanning();
