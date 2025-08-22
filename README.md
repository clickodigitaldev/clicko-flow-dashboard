# Clicko Flow - Project Dashboard

A modern, responsive React dashboard for tracking project payments, deposits, and financial forecasting.

## 🚀 Features

### Dashboard Overview
- **Summary Cards**: Real-time financial metrics with progress indicators
- **Interactive Charts**: Visual representation of project data and cash flow
- **Projects Table**: Comprehensive project management with filtering
- **Alerts Section**: Important notifications and project updates

### Settings & Financial Management
- **Monthly Target Configuration**: Set and track revenue targets
- **Break-even Analysis**: Configure and monitor break-even points
- **Overhead Expense Tracking**: 
  - Add/remove team positions with salary tracking
  - Real-time calculation of total overhead costs
- **General Expense Management**:
  - Track office rent, subscriptions, utilities, marketing, etc.
  - Flexible expense categorization
- **24-Month Financial Forecasting**: 
  - Advanced projection system
  - Break-even status tracking
  - Profit/loss analysis
  - Monthly expense calculations

### Technical Features
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Modern UI**: Glassmorphism design with gradient effects
- **Real-time Calculations**: Live financial metrics and projections
- **Data Persistence**: Settings saved to localStorage
- **Performance Optimized**: Efficient React components with proper state management

## 🛠️ Installation

1. Clone the repository:
```bash
git clone https://github.com/clickodigitalae/clicko-flow-dashboard.git
cd clicko-flow-dashboard
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📊 Settings Configuration

### Monthly Targets
- Set your monthly revenue target
- Configure break-even point
- Real-time target achievement tracking

### Overhead Expenses
Add team positions with:
- Position name
- Monthly salary
- Automatic total calculation

### General Expenses
Track recurring costs:
- Office rent
- Software subscriptions
- Internet & utilities
- Marketing expenses
- Any other operational costs

### Financial Forecasting
The system automatically generates:
- 24-month revenue projections
- Expense forecasting
- Break-even analysis
- Profit/loss calculations

## 🎨 Design System

### Color Scheme
- **Primary**: Modern gradient backgrounds
- **Success**: Green gradients for positive metrics
- **Warning**: Orange gradients for pending items
- **Error**: Red gradients for alerts

### Components
- **Glass Cards**: Semi-transparent cards with blur effects
- **Gradient Buttons**: Modern button styling
- **Progress Indicators**: Visual progress bars
- **Status Badges**: Color-coded status indicators

## 📱 Responsive Design

The dashboard is fully responsive and optimized for:
- **Desktop**: Full feature set with side-by-side layouts
- **Tablet**: Adapted layouts with touch-friendly interactions
- **Mobile**: Stacked layouts with mobile-optimized controls

## 🔧 Customization

### Adding New Expense Categories
1. Open the Settings modal
2. Navigate to "General Expenses"
3. Click "Add Expense"
4. Enter name and amount

### Modifying Team Structure
1. Open the Settings modal
2. Navigate to "Overhead Expenses"
3. Add/remove positions as needed
4. Update salaries

### Financial Targets
1. Open the Settings modal
2. Update monthly target and break-even point
3. Save changes to see updated projections

## 📈 Financial Calculations

The system performs real-time calculations for:
- **Total Revenue**: Deposits + Expected payments
- **Monthly Expenses**: Overhead + General expenses
- **Profit/Loss**: Revenue - Total expenses
- **Target Achievement**: (Current revenue / Target) × 100
- **Break-even Progress**: (Current revenue / Break-even) × 100

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Deploy to GitHub Pages
1. Push to GitHub repository
2. Enable GitHub Pages in repository settings
3. Set source to main branch

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Create an issue in the GitHub repository
- Contact the development team

---

**Built with React, Recharts, and Tailwind CSS**
