# Database Setup Guide for Clicko Flow

## Overview
Clicko Flow now uses a **real MongoDB database** instead of localStorage for proper data persistence and real-time calculations.

## What's New

### ✅ **Database Storage**
- **Monthly Planning Data**: Stored in MongoDB with proper user authentication
- **Project Data**: Already stored in MongoDB database
- **Real-time Updates**: Dashboard automatically reflects changes from Monthly Planning
- **Data Persistence**: All data persists between sessions and server restarts

### ✅ **API Endpoints**
- `GET /api/monthly-planning` - Get all monthly planning data
- `GET /api/monthly-planning/:month` - Get specific month data
- `POST /api/monthly-planning` - Create/update monthly planning
- `PUT /api/monthly-planning/:id` - Update specific month
- `DELETE /api/monthly-planning/:id` - Delete month (soft delete)
- `POST /api/monthly-planning/initialize` - Initialize 24 months of data
- `GET /api/monthly-planning/summary` - Get financial summary

## Setup Instructions

### 1. **Install MongoDB**
```bash
# macOS (using Homebrew)
brew install mongodb-community

# Ubuntu/Debian
sudo apt-get install mongodb

# Windows
# Download from https://www.mongodb.com/try/download/community
```

### 2. **Start MongoDB Service**
```bash
# macOS
brew services start mongodb-community

# Ubuntu/Debian
sudo systemctl start mongodb

# Windows
# MongoDB runs as a service automatically
```

### 3. **Install Backend Dependencies**
```bash
cd backend
npm install
```

### 4. **Create Environment File**
```bash
# Create .env file in backend directory
cd backend
touch .env
```

Add the following to `.env`:
```env
MONGODB_URI=mongodb://localhost:27017/clicko-flow
JWT_SECRET=your-secret-key-here
FRONTEND_URL=http://localhost:3001
NODE_ENV=development
```

### 5. **Start Backend Server**
```bash
cd backend
npm run dev
```

The server will start on `http://localhost:5000`

### 6. **Start Frontend**
```bash
# In a new terminal
npm start
```

The frontend will start on `http://localhost:3001`

## Data Migration

### **Automatic Migration**
- Existing localStorage data is automatically migrated to the database
- New data is saved directly to the database
- Fallback to localStorage if database is unavailable

### **Manual Migration**
```javascript
// In the browser console or Monthly Planning page
const monthlyPlanningService = require('./src/services/monthlyPlanningService');
await monthlyPlanningService.migrateFromLocalStorage();
```

## Database Schema

### **MonthlyPlanning Collection**
```javascript
{
  userId: ObjectId,           // Reference to User
  month: String,              // "August 2025"
  monthDate: Date,            // 2025-08-01
  revenue: Number,            // 150000
  overhead: [{                // Array of overhead positions
    name: String,             // "Developer"
    salary: Number            // 8000
  }],
  generalExpenses: [{         // Array of general expenses
    name: String,             // "Office Rent"
    amount: Number            // 3000
  }],
  revenueStreams: [{          // Array of revenue streams
    name: String,             // "Web Development"
    amount: Number            // 80000
  }],
  breakEven: Number,          // 120000
  notes: String,              // "Additional notes"
  isActive: Boolean,          // true/false (soft delete)
  createdAt: Date,            // Auto-generated
  updatedAt: Date             // Auto-generated
}
```

### **Virtual Fields (Calculated)**
- `totalOverhead`: Sum of all overhead salaries
- `totalGeneralExpenses`: Sum of all general expenses
- `totalExpenses`: Total overhead + general expenses
- `profit`: Revenue - total expenses
- `isBreakEvenAchieved`: Revenue >= total expenses
- `breakEvenProgress`: (Revenue / total expenses) * 100

## Troubleshooting

### **Database Connection Issues**
```bash
# Check if MongoDB is running
mongo --eval "db.runCommand('ping')"

# Check MongoDB logs
tail -f /var/log/mongodb/mongod.log
```

### **Port Conflicts**
```bash
# Check what's using port 5000
lsof -i :5000

# Kill process if needed
kill -9 <PID>
```

### **Data Not Updating**
1. Check browser console for errors
2. Verify backend server is running
3. Check MongoDB connection
4. Clear browser cache and reload

## Benefits of Database Storage

### **✅ Real-time Updates**
- Changes in Monthly Planning immediately reflect in Dashboard
- No need to refresh or manually sync data

### **✅ Data Persistence**
- All data survives server restarts
- Multiple users can access the same data
- Data backup and recovery capabilities

### **✅ Better Performance**
- Efficient queries with database indexing
- Reduced memory usage in browser
- Scalable for larger datasets

### **✅ Data Integrity**
- Proper validation and constraints
- User authentication and authorization
- Audit trails with timestamps

## Next Steps

1. **Start the backend server** using the instructions above
2. **Update your monthly planning data** - it will now save to the database
3. **Check the dashboard** - it should automatically show the updated data
4. **Verify real-time updates** by making changes in Monthly Planning

Your August forecasting data will now be properly stored in the database and the dashboard will show real-time calculations based on the actual data you've entered!
