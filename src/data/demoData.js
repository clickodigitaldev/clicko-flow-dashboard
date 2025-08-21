export const demoProjects = [
  {
    id: "PROJ001",
    clientName: "ABC Corp",
    totalAmount: 15000,
    depositPaid: 7500,
    depositDate: "2025-08-01",
    expectedCompletion: "2025-08-20",
    status: "In Progress",
    monthOfPayment: "August 2025",
    priority: "High"
  },
  {
    id: "PROJ002",
    clientName: "TechStart Inc",
    totalAmount: 25000,
    depositPaid: 0,
    depositDate: null,
    expectedCompletion: "2025-08-15",
    status: "Pending",
    monthOfPayment: "August 2025",
    priority: "High"
  },
  {
    id: "PROJ003",
    clientName: "Global Solutions",
    totalAmount: 8000,
    depositPaid: 8000,
    depositDate: "2025-07-25",
    expectedCompletion: "2025-08-10",
    status: "Completed",
    monthOfPayment: "August 2025",
    priority: "Medium"
  },
  {
    id: "PROJ004",
    clientName: "Innovate Labs",
    totalAmount: 12000,
    depositPaid: 6000,
    depositDate: "2025-08-05",
    expectedCompletion: "2025-08-25",
    status: "In Progress",
    monthOfPayment: "August 2025",
    priority: "Medium"
  },
  {
    id: "PROJ005",
    clientName: "Digital Dynamics",
    totalAmount: 30000,
    depositPaid: 15000,
    depositDate: "2025-07-30",
    expectedCompletion: "2025-09-05",
    status: "In Progress",
    monthOfPayment: "September 2025",
    priority: "High"
  },
  {
    id: "PROJ006",
    clientName: "Creative Studio",
    totalAmount: 5000,
    depositPaid: 0,
    depositDate: null,
    expectedCompletion: "2025-08-12",
    status: "Pending",
    monthOfPayment: "August 2025",
    priority: "Low"
  },
  {
    id: "PROJ007",
    clientName: "Enterprise Systems",
    totalAmount: 45000,
    depositPaid: 22500,
    depositDate: "2025-08-02",
    expectedCompletion: "2025-09-15",
    status: "In Progress",
    monthOfPayment: "September 2025",
    priority: "High"
  },
  {
    id: "PROJ008",
    clientName: "Startup Ventures",
    totalAmount: 18000,
    depositPaid: 18000,
    depositDate: "2025-07-28",
    expectedCompletion: "2025-08-18",
    status: "Completed",
    monthOfPayment: "August 2025",
    priority: "Medium"
  },
  {
    id: "PROJ009",
    clientName: "Cloud Solutions",
    totalAmount: 22000,
    depositPaid: 11000,
    depositDate: "2025-08-03",
    expectedCompletion: "2025-08-28",
    status: "In Progress",
    monthOfPayment: "August 2025",
    priority: "Medium"
  },
  {
    id: "PROJ010",
    clientName: "Mobile Apps Co",
    totalAmount: 35000,
    depositPaid: 0,
    depositDate: null,
    expectedCompletion: "2025-08-22",
    status: "Pending",
    monthOfPayment: "August 2025",
    priority: "High"
  },
  {
    id: "PROJ011",
    clientName: "Web Design Pro",
    totalAmount: 9000,
    depositPaid: 9000,
    depositDate: "2025-07-20",
    expectedCompletion: "2025-08-08",
    status: "Completed",
    monthOfPayment: "August 2025",
    priority: "Low"
  },
  {
    id: "PROJ012",
    clientName: "Data Analytics Ltd",
    totalAmount: 28000,
    depositPaid: 14000,
    depositDate: "2025-08-04",
    expectedCompletion: "2025-09-10",
    status: "In Progress",
    monthOfPayment: "September 2025",
    priority: "High"
  },
  {
    id: "PROJ013",
    clientName: "E-commerce Solutions",
    totalAmount: 15000,
    depositPaid: 0,
    depositDate: null,
    expectedCompletion: "2025-08-30",
    status: "Pending",
    monthOfPayment: "August 2025",
    priority: "Medium"
  },
  {
    id: "PROJ014",
    clientName: "AI Innovations",
    totalAmount: 50000,
    depositPaid: 25000,
    depositDate: "2025-07-15",
    expectedCompletion: "2025-09-20",
    status: "In Progress",
    monthOfPayment: "September 2025",
    priority: "High"
  },
  {
    id: "PROJ015",
    clientName: "Security Systems",
    totalAmount: 12000,
    depositPaid: 12000,
    depositDate: "2025-07-10",
    expectedCompletion: "2025-08-05",
    status: "Completed",
    monthOfPayment: "August 2025",
    priority: "Medium"
  }
];

// Monthly targets for comparison
export const monthlyTargets = {
  "August 2025": 150000,
  "September 2025": 180000,
  "October 2025": 200000
};

// Cash flow projection data
export const cashFlowProjection = [
  { month: "August 2025", projected: 150000, actual: 125000 },
  { month: "September 2025", projected: 180000, actual: 0 },
  { month: "October 2025", projected: 200000, actual: 0 },
  { month: "November 2025", projected: 220000, actual: 0 },
  { month: "December 2025", projected: 250000, actual: 0 }
];
