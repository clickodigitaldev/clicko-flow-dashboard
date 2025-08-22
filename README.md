# Clicko Flow Dashboard

A comprehensive project management and financial planning dashboard for Clicko Digital.

## 🚀 Features

- **Project Management**: Create, edit, and track projects with detailed information
- **Financial Planning**: Monthly forecasting and budget management
- **Real-time Analytics**: Interactive charts and financial summaries
- **User Authentication**: Secure JWT-based authentication
- **Responsive Design**: Works on desktop and mobile devices

## 🛠️ Technology Stack

- **Frontend**: React.js, Tailwind CSS, Recharts
- **Backend**: Node.js, Express.js, MongoDB
- **Authentication**: JWT (JSON Web Tokens)
- **Deployment**: Docker, Docker Compose

## 📋 Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Docker and Docker Compose (for deployment)
- MongoDB (included in Docker setup)

## 🚀 Quick Start

### Option 1: Docker Deployment (Recommended)

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd clicko-flow
   ```

2. **Deploy with Docker**
   ```bash
   ./deploy.sh
   ```

3. **Access the application**
   - Frontend: http://localhost:5001
   - API: http://localhost:5001/api

### Option 2: Local Development

1. **Install dependencies**
   ```bash
   npm run install-all
   ```

2. **Set up environment variables**
   ```bash
   # Create .env file in root directory
   cp .env.example .env
   # Edit .env with your configuration
   ```

3. **Start development servers**
   ```bash
   npm run dev
   ```

4. **Access the application**
   - Frontend: http://localhost:3000
   - Backend: http://localhost:5001

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
# Database
MONGODB_URI=mongodb://localhost:27017/clicko-flow

# JWT Secret
JWT_SECRET=your-super-secret-jwt-key

# Server Port
PORT=5001

# Environment
NODE_ENV=development
```

### Docker Environment

For Docker deployment, environment variables are set in `docker-compose.yml`:

```yaml
environment:
  - NODE_ENV=production
  - PORT=5001
  - MONGODB_URI=mongodb://mongo:27017/clicko-flow
  - JWT_SECRET=your-super-secret-jwt-key
```

## 📁 Project Structure

```
clicko-flow/
├── src/                    # Frontend React application
│   ├── components/         # React components
│   ├── pages/             # Page components
│   ├── services/          # API services
│   └── utils/             # Utility functions
├── backend/               # Backend Node.js application
│   ├── src/
│   │   ├── controllers/   # Route controllers
│   │   ├── middleware/    # Express middleware
│   │   ├── models/        # MongoDB models
│   │   ├── routes/        # API routes
│   │   └── services/      # Business logic
│   └── package.json
├── public/                # Static files
├── Dockerfile             # Docker configuration
├── docker-compose.yml     # Docker Compose configuration
└── package.json
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Projects
- `GET /api/projects` - Get all projects
- `POST /api/projects` - Create new project
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project

### Monthly Planning
- `GET /api/monthly-planning/:month` - Get monthly planning data
- `POST /api/monthly-planning` - Save monthly planning data

## 🐳 Docker Commands

### Build and Run
```bash
# Build the application
docker-compose build

# Start the application
docker-compose up -d

# View logs
docker-compose logs -f

# Stop the application
docker-compose down
```

### Development with Docker
```bash
# Build development image
docker-compose -f docker-compose.dev.yml up --build

# Run tests
docker-compose exec app npm test
```

## 🔍 Troubleshooting

### Common Issues

1. **Port already in use**
   ```bash
   # Check what's using the port
   lsof -i :5001
   # Kill the process
   kill -9 <PID>
   ```

2. **MongoDB connection issues**
   ```bash
   # Check if MongoDB is running
   docker-compose ps
   # Restart MongoDB
   docker-compose restart mongo
   ```

3. **Build errors**
   ```bash
   # Clear Docker cache
   docker system prune -a
   # Rebuild
   docker-compose build --no-cache
   ```

### Logs and Debugging

```bash
# View application logs
docker-compose logs app

# View MongoDB logs
docker-compose logs mongo

# Access MongoDB shell
docker-compose exec mongo mongosh
```

## 📊 Database Schema

### Projects Collection
```javascript
{
  userId: ObjectId,
  projectId: String,
  projectName: String,
  clientName: String,
  totalAmount: Number,
  depositPaid: Number,
  expectedStartDate: Date,
  expectedCompletion: Date,
  status: String,
  priority: String,
  category: String,
  assignedTo: String,
  progress: Number
}
```

### Monthly Planning Collection
```javascript
{
  userId: ObjectId,
  month: String,
  revenue: Number,
  expenses: Number,
  revenueStreams: Array,
  overhead: Array,
  generalExpenses: Array,
  notes: String
}
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the troubleshooting section above

---

**Made with ❤️ by Clicko Digital Team**
