#!/bin/bash

echo "🚀 Starting Clicko Flow Dashboard in Production Mode..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

echo "✅ Node.js and npm are available"

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "📦 Installing frontend dependencies..."
    npm install
fi

if [ ! -d "backend/node_modules" ]; then
    echo "📦 Installing backend dependencies..."
    cd backend && npm install && cd ..
fi

# Build the frontend
echo "🔨 Building frontend for production..."
npm run build

# Set production environment
export NODE_ENV=production
export PORT=5001

# Start the backend server
echo "🚀 Starting production server on port 5001..."
echo "🌐 Access your application at: http://localhost:5001"
echo "📊 API available at: http://localhost:5001/api"

# Start the server
node backend/src/server.js
