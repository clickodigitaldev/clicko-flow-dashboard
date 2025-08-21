# Clicko Flow

An interactive project and payment tracking dashboard built with React, featuring demo data for managing deposits, remaining payments, project completion, monthly inflow, and targets.

## 🚀 Features

**Clicko Flow** - Where payments flow smoothly

### 📊 Dashboard Overview
- **Summary Cards**: Total projects, deposits received, expected payments, and target achievement
- **Interactive Charts**: Monthly revenue vs target, payment status, project status, and cash flow projection
- **Real-time Updates**: All data updates dynamically when actions are performed

### 📋 Project Management
- **Comprehensive Table**: Sortable and filterable project list with all key information
- **Search & Filter**: Search by client or project ID, filter by status and priority
- **Action Buttons**: Send reminders, mark deposits paid, and complete projects
- **Conditional Formatting**: Color-coded status indicators (Red/Yellow/Green)

### ⚠️ Alerts & Actions
- **Overdue Projects**: Highlight projects past their completion date
- **Due Soon**: Projects due within 3 days
- **Payment Issues**: Projects with no deposit or partial deposits
- **Quick Actions**: One-click buttons for common tasks

### 📈 Analytics
- **Bar Charts**: Monthly revenue comparison
- **Pie Charts**: Payment and project status distribution
- **Line Charts**: Cash flow projections
- **Responsive Design**: Works on desktop and tablet

## 🛠️ Technology Stack

- **Frontend**: React 18
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **Icons**: Lucide React
- **Date Handling**: date-fns

## 📦 Installation

1. **Navigate to the project directory**:
   ```bash
   cd project-dashboard
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm start
   ```

4. **Open your browser** and visit `http://localhost:3000`

## 📁 Project Structure

```
project-dashboard/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── SummaryCards.js      # Dashboard summary metrics
│   │   ├── Charts.js            # All chart components
│   │   ├── ProjectsTable.js     # Main projects table
│   │   └── AlertsSection.js     # Alerts and actions
│   ├── data/
│   │   └── demoData.js          # Demo project data
│   ├── App.js                   # Main application component
│   ├── index.js                 # Application entry point
│   └── index.css                # Global styles
├── package.json
├── tailwind.config.js
└── README.md
```

## 📊 Demo Data

The dashboard includes 15 sample projects with realistic data:

- **Project IDs**: PROJ001-PROJ015
- **Client Names**: Various company names
- **Amounts**: $5,000 - $50,000
- **Statuses**: In Progress, Completed, Pending
- **Priorities**: High, Medium, Low
- **Dates**: August-October 2025

## 🎯 Key Features Explained

### Summary Cards
- **Total Projects**: Count of projects for selected month
- **Deposits Received**: Sum of all deposits paid
- **Expected Payments**: Remaining payments to be received
- **Target Achievement**: Percentage of monthly target achieved

### Interactive Table
- **Sortable Columns**: Click headers to sort by any field
- **Search Functionality**: Find projects by client or ID
- **Status Filters**: Filter by project status and priority
- **Action Buttons**: 
  - 📧 Send reminder (for unpaid projects)
  - 💰 Mark deposit paid
  - ✅ Mark project complete
  - ⚠️ Alert for due soon projects

### Charts & Analytics
- **Monthly Revenue vs Target**: Bar chart comparing expected vs actual
- **Payment Status**: Pie chart showing paid/partial/pending
- **Project Status**: Distribution of completed/in-progress/pending
- **Cash Flow Projection**: Line chart for future months

### Alerts System
- **Overdue Projects**: Red alerts for past due dates
- **Due Soon**: Yellow alerts for projects due within 3 days
- **Payment Issues**: Red alerts for no deposits, yellow for partial
- **Quick Actions**: Buttons to resolve issues immediately

## 🎨 Design Features

- **Responsive Layout**: Works on desktop and tablet
- **Modern UI**: Clean, professional design with Tailwind CSS
- **Color Coding**: 
  - 🟢 Green: Completed/Paid
  - 🟡 Yellow: Due soon/Partial payment
  - 🔴 Red: Overdue/No payment
- **Interactive Elements**: Hover effects and smooth transitions

## 🔧 Customization

### Adding New Projects
Edit `src/data/demoData.js` to add more projects:

```javascript
{
  id: "PROJ016",
  clientName: "New Client",
  totalAmount: 25000,
  depositPaid: 12500,
  depositDate: "2025-08-10",
  expectedCompletion: "2025-09-15",
  status: "In Progress",
  monthOfPayment: "September 2025",
  priority: "Medium"
}
```

### Modifying Charts
Update chart configurations in `src/components/Charts.js`

### Styling Changes
Modify `tailwind.config.js` for theme customization

## 🚀 Future Enhancements

- **API Integration**: Connect to real backend services
- **User Authentication**: Login and user management
- **Export Features**: PDF reports and CSV exports
- **Notifications**: Real-time alerts and email notifications
- **Mobile App**: React Native version
- **Advanced Analytics**: More detailed reporting and insights

## 📝 License

This project is created for demonstration purposes. Feel free to use and modify as needed.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

---

**Built with ❤️ using React and modern web technologies**
