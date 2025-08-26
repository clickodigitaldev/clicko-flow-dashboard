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

// Default overhead structure for three teams
export const defaultOverhead = [
  // Service Team
  { id: 1, name: 'Senior Developer', salary: 8000, team: 'service' },
  { id: 2, name: 'Frontend Developer', salary: 7000, team: 'service' },
  { id: 3, name: 'Backend Developer', salary: 7500, team: 'service' },
  { id: 4, name: 'DevOps Engineer', salary: 8500, team: 'service' },
  // Product Team
  { id: 5, name: 'Product Manager', salary: 10000, team: 'product' },
  { id: 6, name: 'UI/UX Designer', salary: 7500, team: 'product' },
  { id: 7, name: 'Business Analyst', salary: 9000, team: 'product' },
  { id: 8, name: 'QA Engineer', salary: 7000, team: 'product' },
  // Management Team
  { id: 9, name: 'Project Manager', salary: 10000, team: 'management' },
  { id: 10, name: 'Team Lead', salary: 9500, team: 'management' },
  { id: 11, name: 'Operations Manager', salary: 11000, team: 'management' }
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
