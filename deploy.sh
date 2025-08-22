#!/bin/bash

echo "🚀 Starting Clicko Flow Dashboard Deployment..."

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

echo "✅ Docker and Docker Compose are available"

# Stop any existing containers
echo "🛑 Stopping existing containers..."
docker-compose down

# Build and start the application
echo "🔨 Building and starting the application..."
docker-compose up --build -d

# Wait for the application to start
echo "⏳ Waiting for the application to start..."
sleep 10

# Check if the application is running
if curl -f http://localhost:5001/api/health &> /dev/null; then
    echo "✅ Application is running successfully!"
    echo "🌐 Access your application at: http://localhost:5001"
    echo "📊 API available at: http://localhost:5001/api"
else
    echo "❌ Application failed to start. Check the logs with: docker-compose logs"
    exit 1
fi

echo "🎉 Deployment completed successfully!"
