# Clicko Flow Dashboard

A comprehensive project management and financial planning dashboard with organizational chart management, currency conversion, and real-time analytics.

## 🚀 Features

- **Dashboard Analytics** - Real-time project and financial insights
- **Organizational Chart** - Team and member management with visual hierarchy
- **Currency Switcher** - Global currency conversion with live rates
- **Monthly Planning** - Financial forecasting and planning tools
- **Project Management** - Complete project lifecycle management
- **WhatsApp Integration** - Business messaging capabilities (foundation)
- **Responsive Design** - Modern UI with glass-card styling

## 🛠️ Tech Stack

- **Frontend**: React.js, Tailwind CSS, Lucide React
- **Backend**: Node.js, Express.js, MongoDB
- **Authentication**: JWT
- **Deployment**: Railway

## 📦 Installation

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/clickodigitaldev/clicko-flow-dashboard.git
   cd clicko-flow-dashboard
   ```

2. **Install dependencies**
   ```bash
   npm run install:all
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env
   # Edit .env with your configuration
   ```

4. **Start development servers**
   ```bash
   npm run dev
   ```

   - Frontend: http://localhost:3001
   - Backend: http://localhost:5001

## 🚀 Railway Deployment

### Step 1: Prepare Your Repository

1. **Push your code to GitHub** (already done)
2. **Ensure all files are committed** (already done)

### Step 2: Deploy to Railway

1. **Visit Railway Dashboard**
   - Go to [railway.app](https://railway.app)
   - Sign in with your GitHub account

2. **Create New Project**
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your `clicko-flow-dashboard` repository

3. **Configure Environment Variables**
   - Go to your project's "Variables" tab
   - Add the following environment variables:

   ```env
   NODE_ENV=production
   MONGODB_URI=your-mongodb-connection-string
   JWT_SECRET=your-super-secret-jwt-key
   CORS_ORIGIN=https://your-app.railway.app
   ```

4. **Add MongoDB Database**
   - In Railway dashboard, click "New"
   - Select "Database" → "MongoDB"
   - Copy the connection string to your `MONGODB_URI` variable

5. **Deploy**
   - Railway will automatically detect the configuration
   - The build process will:
     - Install dependencies
     - Build the React frontend
     - Start the Express backend
     - Serve static files

### Step 3: Configure Custom Domain (Optional)

1. **Add Custom Domain**
   - Go to your project's "Settings" tab
   - Click "Generate Domain" or add your custom domain
   - Update your `CORS_ORIGIN` variable with the new domain

2. **Update Environment Variables**
   ```env
   CORS_ORIGIN=https://your-custom-domain.com
   RAILWAY_STATIC_URL=https://your-custom-domain.com
   RAILWAY_PUBLIC_DOMAIN=your-custom-domain.com
   ```

## 🔧 Configuration

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NODE_ENV` | Environment (production/development) | Yes |
| `PORT` | Server port (Railway sets this automatically) | No |
| `MONGODB_URI` | MongoDB connection string | Yes |
| `JWT_SECRET` | Secret key for JWT tokens | Yes |
| `CORS_ORIGIN` | Allowed CORS origins | Yes |
| `RAILWAY_STATIC_URL` | Railway static URL | No |
| `RAILWAY_PUBLIC_DOMAIN` | Railway public domain | No |

### Database Setup

1. **MongoDB Atlas** (Recommended for production)
   - Create a free cluster at [mongodb.com](https://mongodb.com)
   - Get your connection string
   - Add to Railway environment variables

2. **Local MongoDB** (Development)
   - Install MongoDB locally
   - Use connection string: `mongodb://localhost:27017/clicko-flow`

## 📊 API Endpoints

- `GET /api/health` - Health check
- `POST /api/auth/login` - User authentication
- `GET /api/projects` - Get all projects
- `GET /api/monthly-planning/:month` - Get monthly planning data
- `GET /api/org-chart` - Get organizational chart
- `PUT /api/org-chart` - Update organizational chart

## 🎨 Features Overview

### Dashboard
- Real-time project statistics
- Financial overview with currency conversion
- Recent activity feed
- Quick action buttons

### Organizational Chart
- Visual team hierarchy
- Add/edit teams and members
- Status management (Active/Hiring/Warning)
- Salary tracking with currency conversion

### Monthly Planning
- Financial forecasting
- Revenue and expense tracking
- Monthly comparisons
- Export capabilities

### Project Management
- Complete project lifecycle
- Status tracking
- Financial management
- Team assignment

## 🔒 Security

- JWT-based authentication
- CORS protection
- Helmet.js security headers
- Input validation and sanitization

## 📱 Responsive Design

- Mobile-first approach
- Glass-card UI components
- Smooth animations
- Touch-friendly interface

## 🚀 Performance

- Optimized React components
- Efficient database queries
- Static file serving
- Health check endpoints

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Create an issue on GitHub
- Contact: support@clickodigital.com

---

**Built with ❤️ by Clicko Digital**
