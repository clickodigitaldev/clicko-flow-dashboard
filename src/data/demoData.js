export const demoProjects = [
  // August 2025 Projects
  {
    id: "PROJ001",
    clientName: "ABC Corp",
    projectName: "E-commerce Website Redesign",
    totalAmount: 15000,
    depositPaid: 7500,
    depositDate: "2025-08-01",
    expectedCompletion: "2025-08-20",
    actualCompletion: null,
    status: "In Progress",
    monthOfPayment: "August 2025",
    priority: "High",
    description: "Complete redesign of the e-commerce platform with modern UI/UX",
    category: "Web Development",
    assignedTo: "John Developer",
    createdAt: "2025-07-15",
    updatedAt: "2025-08-01",
    progress: 65,
    milestones: [
      { id: 1, name: "Design Approval", completed: true, date: "2025-07-25" },
      { id: 2, name: "Frontend Development", completed: true, date: "2025-08-05" },
      { id: 3, name: "Backend Integration", completed: false, date: "2025-08-15" },
      { id: 4, name: "Testing & Launch", completed: false, date: "2025-08-20" }
    ]
  },
  {
    id: "PROJ002",
    clientName: "TechStart Inc",
    projectName: "Mobile App Development",
    totalAmount: 25000,
    depositPaid: 0,
    depositDate: null,
    expectedCompletion: "2025-08-15",
    actualCompletion: null,
    status: "Pending",
    monthOfPayment: "August 2025",
    priority: "High",
    description: "Cross-platform mobile application for task management",
    category: "Mobile Development",
    assignedTo: "Sarah Designer",
    createdAt: "2025-07-20",
    updatedAt: "2025-07-20",
    progress: 0,
    milestones: [
      { id: 1, name: "Project Kickoff", completed: false, date: "2025-08-01" },
      { id: 2, name: "UI/UX Design", completed: false, date: "2025-08-05" },
      { id: 3, name: "Development", completed: false, date: "2025-08-10" },
      { id: 4, name: "Testing & Launch", completed: false, date: "2025-08-15" }
    ]
  },
  {
    id: "PROJ003",
    clientName: "Global Solutions",
    projectName: "CRM System Implementation",
    totalAmount: 8000,
    depositPaid: 8000,
    depositDate: "2025-07-25",
    expectedCompletion: "2025-08-10",
    actualCompletion: "2025-08-08",
    status: "Completed",
    monthOfPayment: "August 2025",
    priority: "Medium",
    description: "Custom CRM system implementation and training",
    category: "System Integration",
    assignedTo: "Mike Manager",
    createdAt: "2025-07-10",
    updatedAt: "2025-08-08",
    progress: 100,
    milestones: [
      { id: 1, name: "Requirements Analysis", completed: true, date: "2025-07-15" },
      { id: 2, name: "System Setup", completed: true, date: "2025-07-25" },
      { id: 3, name: "User Training", completed: true, date: "2025-08-05" },
      { id: 4, name: "Go Live", completed: true, date: "2025-08-08" }
    ]
  },
  {
    id: "PROJ004",
    clientName: "Innovate Labs",
    projectName: "AI Chatbot Development",
    totalAmount: 12000,
    depositPaid: 6000,
    depositDate: "2025-08-05",
    expectedCompletion: "2025-08-25",
    actualCompletion: null,
    status: "In Progress",
    monthOfPayment: "August 2025",
    priority: "Medium",
    description: "Intelligent chatbot for customer support automation",
    category: "AI/ML",
    assignedTo: "Alex Engineer",
    createdAt: "2025-07-25",
    updatedAt: "2025-08-05",
    progress: 40,
    milestones: [
      { id: 1, name: "AI Model Training", completed: true, date: "2025-08-01" },
      { id: 2, name: "Integration", completed: false, date: "2025-08-15" },
      { id: 3, name: "Testing", completed: false, date: "2025-08-20" },
      { id: 4, name: "Deployment", completed: false, date: "2025-08-25" }
    ]
  },
  {
    id: "PROJ005",
    clientName: "Creative Studio",
    projectName: "Brand Identity Design",
    totalAmount: 5000,
    depositPaid: 0,
    depositDate: null,
    expectedCompletion: "2025-08-12",
    actualCompletion: null,
    status: "Pending",
    monthOfPayment: "August 2025",
    priority: "Low",
    description: "Complete brand identity including logo and guidelines",
    category: "Design",
    assignedTo: "Sarah Designer",
    createdAt: "2025-07-28",
    updatedAt: "2025-07-28",
    progress: 0,
    milestones: [
      { id: 1, name: "Brand Research", completed: false, date: "2025-08-01" },
      { id: 2, name: "Logo Design", completed: false, date: "2025-08-05" },
      { id: 3, name: "Brand Guidelines", completed: false, date: "2025-08-10" },
      { id: 4, name: "Final Delivery", completed: false, date: "2025-08-12" }
    ]
  },
  {
    id: "PROJ006",
    clientName: "Startup Ventures",
    projectName: "MVP Development",
    totalAmount: 18000,
    depositPaid: 18000,
    depositDate: "2025-07-28",
    expectedCompletion: "2025-08-18",
    actualCompletion: "2025-08-15",
    status: "Completed",
    monthOfPayment: "August 2025",
    priority: "Medium",
    description: "Minimum viable product for startup launch",
    category: "Web Development",
    assignedTo: "Alex Engineer",
    createdAt: "2025-07-10",
    updatedAt: "2025-08-15",
    progress: 100,
    milestones: [
      { id: 1, name: "Requirements", completed: true, date: "2025-07-15" },
      { id: 2, name: "Development", completed: true, date: "2025-08-05" },
      { id: 3, name: "Testing", completed: true, date: "2025-08-12" },
      { id: 4, name: "Launch", completed: true, date: "2025-08-15" }
    ]
  },
  {
    id: "PROJ007",
    clientName: "Cloud Solutions",
    projectName: "API Development",
    totalAmount: 22000,
    depositPaid: 11000,
    depositDate: "2025-08-03",
    expectedCompletion: "2025-08-28",
    actualCompletion: null,
    status: "In Progress",
    monthOfPayment: "August 2025",
    priority: "Medium",
    description: "RESTful API development for third-party integrations",
    category: "Backend Development",
    assignedTo: "John Developer",
    createdAt: "2025-07-25",
    updatedAt: "2025-08-03",
    progress: 55,
    milestones: [
      { id: 1, name: "API Design", completed: true, date: "2025-08-01" },
      { id: 2, name: "Development", completed: false, date: "2025-08-15" },
      { id: 3, name: "Documentation", completed: false, date: "2025-08-25" },
      { id: 4, name: "Testing & Launch", completed: false, date: "2025-08-28" }
    ]
  },
  {
    id: "PROJ008",
    clientName: "Web Design Pro",
    projectName: "Corporate Website",
    totalAmount: 9000,
    depositPaid: 9000,
    depositDate: "2025-07-20",
    expectedCompletion: "2025-08-08",
    actualCompletion: "2025-08-05",
    status: "Completed",
    monthOfPayment: "August 2025",
    priority: "Low",
    description: "Modern corporate website with CMS",
    category: "Web Development",
    assignedTo: "Sarah Designer",
    createdAt: "2025-07-15",
    updatedAt: "2025-08-05",
    progress: 100,
    milestones: [
      { id: 1, name: "Design", completed: true, date: "2025-07-25" },
      { id: 2, name: "Development", completed: true, date: "2025-08-01" },
      { id: 3, name: "Content", completed: true, date: "2025-08-03" },
      { id: 4, name: "Launch", completed: true, date: "2025-08-05" }
    ]
  },

  // September 2025 Projects
  {
    id: "PROJ009",
    clientName: "Digital Dynamics",
    projectName: "Enterprise Dashboard",
    totalAmount: 30000,
    depositPaid: 15000,
    depositDate: "2025-08-15",
    expectedCompletion: "2025-09-05",
    actualCompletion: null,
    status: "In Progress",
    monthOfPayment: "September 2025",
    priority: "High",
    description: "Comprehensive business intelligence dashboard",
    category: "Data Analytics",
    assignedTo: "John Developer",
    createdAt: "2025-07-15",
    updatedAt: "2025-08-15",
    progress: 30,
    milestones: [
      { id: 1, name: "Data Architecture", completed: true, date: "2025-08-20" },
      { id: 2, name: "Dashboard Design", completed: false, date: "2025-08-25" },
      { id: 3, name: "Development", completed: false, date: "2025-09-01" },
      { id: 4, name: "Testing & Launch", completed: false, date: "2025-09-05" }
    ]
  },
  {
    id: "PROJ010",
    clientName: "Enterprise Systems",
    projectName: "Cloud Migration",
    totalAmount: 45000,
    depositPaid: 22500,
    depositDate: "2025-08-20",
    expectedCompletion: "2025-09-15",
    actualCompletion: null,
    status: "In Progress",
    monthOfPayment: "September 2025",
    priority: "High",
    description: "Complete migration to cloud infrastructure",
    category: "Cloud Services",
    assignedTo: "Mike Manager",
    createdAt: "2025-07-20",
    updatedAt: "2025-08-20",
    progress: 25,
    milestones: [
      { id: 1, name: "Infrastructure Planning", completed: true, date: "2025-08-25" },
      { id: 2, name: "Data Migration", completed: false, date: "2025-09-05" },
      { id: 3, name: "Application Migration", completed: false, date: "2025-09-10" },
      { id: 4, name: "Testing & Go Live", completed: false, date: "2025-09-15" }
    ]
  },
  {
    id: "PROJ011",
    clientName: "Mobile Apps Co",
    projectName: "iOS App Development",
    totalAmount: 35000,
    depositPaid: 0,
    depositDate: null,
    expectedCompletion: "2025-09-22",
    actualCompletion: null,
    status: "Pending",
    monthOfPayment: "September 2025",
    priority: "High",
    description: "Native iOS application for fitness tracking",
    category: "Mobile Development",
    assignedTo: "Sarah Designer",
    createdAt: "2025-08-01",
    updatedAt: "2025-08-01",
    progress: 0,
    milestones: [
      { id: 1, name: "Design Phase", completed: false, date: "2025-09-01" },
      { id: 2, name: "Development", completed: false, date: "2025-09-10" },
      { id: 3, name: "Testing", completed: false, date: "2025-09-18" },
      { id: 4, name: "App Store Submission", completed: false, date: "2025-09-22" }
    ]
  },
  {
    id: "PROJ012",
    clientName: "Data Analytics Ltd",
    projectName: "BI Platform",
    totalAmount: 28000,
    depositPaid: 14000,
    depositDate: "2025-08-25",
    expectedCompletion: "2025-09-10",
    actualCompletion: null,
    status: "In Progress",
    monthOfPayment: "September 2025",
    priority: "High",
    description: "Business intelligence platform with advanced analytics",
    category: "Data Analytics",
    assignedTo: "Alex Engineer",
    createdAt: "2025-08-05",
    updatedAt: "2025-08-25",
    progress: 45,
    milestones: [
      { id: 1, name: "Data Modeling", completed: true, date: "2025-08-30" },
      { id: 2, name: "Dashboard Creation", completed: false, date: "2025-09-05" },
      { id: 3, name: "Integration", completed: false, date: "2025-09-08" },
      { id: 4, name: "Deployment", completed: false, date: "2025-09-10" }
    ]
  },
  {
    id: "PROJ013",
    clientName: "AI Innovations",
    projectName: "Machine Learning Platform",
    totalAmount: 50000,
    depositPaid: 25000,
    depositDate: "2025-08-10",
    expectedCompletion: "2025-09-20",
    actualCompletion: null,
    status: "In Progress",
    monthOfPayment: "September 2025",
    priority: "High",
    description: "Advanced ML platform for predictive analytics",
    category: "AI/ML",
    assignedTo: "John Developer",
    createdAt: "2025-07-15",
    updatedAt: "2025-08-10",
    progress: 35,
    milestones: [
      { id: 1, name: "Model Development", completed: true, date: "2025-08-20" },
      { id: 2, name: "Platform Integration", completed: false, date: "2025-09-05" },
      { id: 3, name: "Testing", completed: false, date: "2025-09-15" },
      { id: 4, name: "Deployment", completed: false, date: "2025-09-20" }
    ]
  },

  // October 2025 Projects
  {
    id: "PROJ014",
    clientName: "E-commerce Solutions",
    projectName: "Online Store Platform",
    totalAmount: 15000,
    depositPaid: 0,
    depositDate: null,
    expectedCompletion: "2025-10-30",
    actualCompletion: null,
    status: "Pending",
    monthOfPayment: "October 2025",
    priority: "Medium",
    description: "Complete e-commerce platform with payment integration",
    category: "Web Development",
    assignedTo: "Sarah Designer",
    createdAt: "2025-08-15",
    updatedAt: "2025-08-15",
    progress: 0,
    milestones: [
      { id: 1, name: "Requirements", completed: false, date: "2025-10-01" },
      { id: 2, name: "Development", completed: false, date: "2025-10-15" },
      { id: 3, name: "Payment Integration", completed: false, date: "2025-10-25" },
      { id: 4, name: "Launch", completed: false, date: "2025-10-30" }
    ]
  },
  {
    id: "PROJ015",
    clientName: "Security Systems",
    projectName: "Cybersecurity Platform",
    totalAmount: 12000,
    depositPaid: 12000,
    depositDate: "2025-07-10",
    expectedCompletion: "2025-10-05",
    actualCompletion: null,
    status: "In Progress",
    monthOfPayment: "October 2025",
    priority: "Medium",
    description: "Comprehensive cybersecurity monitoring platform",
    category: "System Integration",
    assignedTo: "Mike Manager",
    createdAt: "2025-07-05",
    updatedAt: "2025-07-10",
    progress: 60,
    milestones: [
      { id: 1, name: "Security Audit", completed: true, date: "2025-09-20" },
      { id: 2, name: "Platform Development", completed: false, date: "2025-10-01" },
      { id: 3, name: "Testing", completed: false, date: "2025-10-03" },
      { id: 4, name: "Deployment", completed: false, date: "2025-10-05" }
    ]
  }
];

// Add demo projects for next 3 months
export const extendedDemoProjects = [
  // November 2025 Projects
  {
    id: "PROJ016",
    clientName: "Digital Marketing Agency",
    projectName: "Marketing Automation Platform",
    totalAmount: 28000,
    depositPaid: 14000,
    depositDate: "2025-10-15",
    expectedCompletion: "2025-11-20",
    actualCompletion: null,
    status: "In Progress",
    monthOfPayment: "November 2025",
    priority: "High",
    description: "Marketing automation platform with CRM integration",
    category: "Web Development",
    assignedTo: "John Developer",
    createdAt: "2025-10-01",
    updatedAt: "2025-10-15",
    progress: 45,
    milestones: [
      { id: 1, name: "Platform Design", completed: true, date: "2025-10-10" },
      { id: 2, name: "Core Development", completed: false, date: "2025-11-05" },
      { id: 3, name: "CRM Integration", completed: false, date: "2025-11-15" },
      { id: 4, name: "Testing & Launch", completed: false, date: "2025-11-20" }
    ]
  },
  {
    id: "PROJ017",
    clientName: "Healthcare Solutions",
    projectName: "Patient Management System",
    totalAmount: 35000,
    depositPaid: 0,
    depositDate: null,
    expectedCompletion: "2025-11-30",
    actualCompletion: null,
    status: "Pending",
    monthOfPayment: "November 2025",
    priority: "High",
    description: "Comprehensive patient management and scheduling system",
    category: "System Integration",
    assignedTo: "Alex Engineer",
    createdAt: "2025-10-20",
    updatedAt: "2025-10-20",
    progress: 0,
    milestones: [
      { id: 1, name: "Requirements Analysis", completed: false, date: "2025-11-01" },
      { id: 2, name: "System Design", completed: false, date: "2025-11-10" },
      { id: 3, name: "Development", completed: false, date: "2025-11-20" },
      { id: 4, name: "Testing & Deployment", completed: false, date: "2025-11-30" }
    ]
  },

  // December 2025 Projects
  {
    id: "PROJ018",
    clientName: "Retail Chain",
    projectName: "Inventory Management System",
    totalAmount: 42000,
    depositPaid: 21000,
    depositDate: "2025-11-01",
    expectedCompletion: "2025-12-15",
    actualCompletion: null,
    status: "In Progress",
    monthOfPayment: "December 2025",
    priority: "Medium",
    description: "Multi-store inventory and POS system",
    category: "System Integration",
    assignedTo: "Mike Manager",
    createdAt: "2025-10-25",
    updatedAt: "2025-11-01",
    progress: 30,
    milestones: [
      { id: 1, name: "System Architecture", completed: true, date: "2025-11-05" },
      { id: 2, name: "Core Development", completed: false, date: "2025-12-01" },
      { id: 3, name: "Store Integration", completed: false, date: "2025-12-10" },
      { id: 4, name: "Training & Launch", completed: false, date: "2025-12-15" }
    ]
  },
  {
    id: "PROJ019",
    clientName: "Educational Institute",
    projectName: "Learning Management Platform",
    totalAmount: 25000,
    depositPaid: 0,
    depositDate: null,
    expectedCompletion: "2025-12-20",
    actualCompletion: null,
    status: "Pending",
    monthOfPayment: "December 2025",
    priority: "Medium",
    description: "Online learning platform with video conferencing",
    category: "Web Development",
    assignedTo: "Sarah Designer",
    createdAt: "2025-11-05",
    updatedAt: "2025-11-05",
    progress: 0,
    milestones: [
      { id: 1, name: "Platform Design", completed: false, date: "2025-12-01" },
      { id: 2, name: "Development", completed: false, date: "2025-12-10" },
      { id: 3, name: "Video Integration", completed: false, date: "2025-12-15" },
      { id: 4, name: "Testing & Launch", completed: false, date: "2025-12-20" }
    ]
  },

  // January 2026 Projects
  {
    id: "PROJ020",
    clientName: "Financial Services",
    projectName: "Investment Portfolio Tracker",
    totalAmount: 38000,
    depositPaid: 19000,
    depositDate: "2025-12-01",
    expectedCompletion: "2026-01-25",
    actualCompletion: null,
    status: "In Progress",
    monthOfPayment: "January 2026",
    priority: "High",
    description: "Real-time investment tracking and analytics platform",
    category: "Data Analytics",
    assignedTo: "John Developer",
    createdAt: "2025-11-15",
    updatedAt: "2025-12-01",
    progress: 25,
    milestones: [
      { id: 1, name: "API Integration", completed: true, date: "2025-12-15" },
      { id: 2, name: "Platform Development", completed: false, date: "2026-01-10" },
      { id: 3, name: "Analytics Engine", completed: false, date: "2026-01-20" },
      { id: 4, name: "Testing & Launch", completed: false, date: "2026-01-25" }
    ]
  },
  {
    id: "PROJ021",
    clientName: "Manufacturing Corp",
    projectName: "Production Planning System",
    totalAmount: 45000,
    depositPaid: 0,
    depositDate: null,
    expectedCompletion: "2026-01-30",
    actualCompletion: null,
    status: "Pending",
    monthOfPayment: "January 2026",
    priority: "Medium",
    description: "Manufacturing planning and resource optimization system",
    category: "System Integration",
    assignedTo: "Alex Engineer",
    createdAt: "2025-12-01",
    updatedAt: "2025-12-01",
    progress: 0,
    milestones: [
      { id: 1, name: "Process Analysis", completed: false, date: "2026-01-05" },
      { id: 2, name: "System Development", completed: false, date: "2026-01-15" },
      { id: 3, name: "Integration", completed: false, date: "2026-01-25" },
      { id: 4, name: "Training & Launch", completed: false, date: "2026-01-30" }
    ]
  }
];

// Project categories for filtering
export const projectCategories = [
  "Web Development",
  "Mobile Development", 
  "Design",
  "System Integration",
  "AI/ML",
  "Data Analytics",
  "Cloud Services",
  "Backend Development"
];

// Project statuses
export const projectStatuses = [
  "Pending",
  "In Progress", 
  "Completed",
  "On Hold",
  "Cancelled"
];

// Project priorities
export const projectPriorities = [
  "Low",
  "Medium",
  "High",
  "Critical"
];

// Monthly targets for comparison
export const monthlyTargets = {
  "August 2025": 200000,
  "September 2025": 230000,
  "October 2025": 260000,
  "November 2025": 290000,
  "December 2025": 320000,
  "January 2026": 350000
};

// Default overhead structure for two teams
export const defaultOverhead = [
  { id: 1, name: 'Product Team', salary: 25000 },
  { id: 2, name: 'Service Team', salary: 22000 },
  { id: 3, name: 'Management Team', salary: 18000 }
];

// Default product developer team
export const defaultProductDeveloperTeam = [
  { id: 1, name: 'Senior Developer', salary: 8000 },
  { id: 2, name: 'Frontend Developer', salary: 7000 },
  { id: 3, name: 'Backend Developer', salary: 7500 },
  { id: 4, name: 'Mobile Developer', salary: 7500 }
];

// Default service team
export const defaultServiceTeam = [
  { id: 1, name: 'Project Manager', salary: 7000 },
  { id: 2, name: 'Business Analyst', salary: 6000 },
  { id: 3, name: 'Client Success Manager', salary: 5500 },
  { id: 4, name: 'Support Specialist', salary: 4500 }
];

// Default management team
export const defaultManagementTeam = [
  { id: 1, name: 'CEO/Founder', salary: 12000 },
  { id: 2, name: 'CTO', salary: 10000 },
  { id: 3, name: 'Operations Manager', salary: 8000 }
];

// Default revenue streams
export const defaultRevenueStreams = [
  { id: 1, name: 'Product & Service', amount: 120000 },
  { id: 2, name: 'Ecommerce', amount: 80000 }
];

// Default product and service streams
export const defaultProductServiceStreams = [
  { id: 1, name: 'Web Development', amount: 50000 },
  { id: 2, name: 'Mobile App Development', amount: 40000 },
  { id: 3, name: 'Consulting Services', amount: 30000 }
];

// Default ecommerce streams
export const defaultEcommerceStreams = [
  { id: 1, name: 'Brand A Store', amount: 40000 },
  { id: 2, name: 'Brand B Store', amount: 40000 }
];

// Default general expenses
export const defaultGeneralExpenses = [
  { id: 1, name: 'General Expenses', amount: 15000 }
];

// Cash flow projection data
export const cashFlowProjection = [
  { month: "August 2025", projected: 200000, actual: 0 },
  { month: "September 2025", projected: 230000, actual: 0 },
  { month: "October 2025", projected: 260000, actual: 0 },
  { month: "November 2025", projected: 290000, actual: 0 },
  { month: "December 2025", projected: 320000, actual: 0 },
  { month: "January 2026", projected: 350000, actual: 0 }
];
