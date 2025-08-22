#!/bin/bash

echo "🚀 Deploying Clicko Flow Dashboard to Render..."

# Check if Render CLI is installed
if ! command -v render &> /dev/null; then
    echo "📦 Installing Render CLI..."
    curl -sL https://render.com/download-cli/linux | bash
fi

echo "✅ Render CLI is ready"

# Build the application
echo "🔨 Building application..."
npm run build

# Deploy to Render
echo "🚀 Deploying to Render..."
render deploy

echo "✅ Deployment completed!"
echo "🌐 Your app should be available at: https://your-app-name.onrender.com"
echo ""
echo "📋 Next steps:"
echo "1. Go to Render dashboard"
echo "2. Add MongoDB Atlas database"
echo "3. Set environment variables:"
echo "   - NODE_ENV=production"
echo "   - MONGODB_URI=your-mongo-atlas-connection-string"
echo "   - JWT_SECRET=your-secret-key"
echo "   - PORT=10000"
echo "4. Your app will auto-deploy!"
