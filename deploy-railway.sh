#!/bin/bash

echo "🚀 Deploying Clicko Flow Dashboard to Railway..."

# Check if Railway CLI is installed
if ! command -v railway &> /dev/null; then
    echo "📦 Installing Railway CLI..."
    npm install -g @railway/cli
fi

# Check if user is logged in
if ! railway whoami &> /dev/null; then
    echo "🔐 Please login to Railway..."
    railway login
fi

echo "✅ Railway CLI is ready"

# Build the application
echo "🔨 Building application..."
npm run build

# Deploy to Railway
echo "🚀 Deploying to Railway..."
railway up

echo "✅ Deployment completed!"
echo "🌐 Your app should be available at: https://your-app-name.railway.app"
echo ""
echo "📋 Next steps:"
echo "1. Go to Railway dashboard"
echo "2. Add MongoDB database service"
echo "3. Set environment variables:"
echo "   - NODE_ENV=production"
echo "   - MONGODB_URI=your-mongo-connection-string"
echo "   - JWT_SECRET=your-secret-key"
echo "4. Your app will auto-deploy!"
