#!/bin/bash

echo "🚀 Deploying to Railway..."

# Install Railway CLI if not installed
if ! command -v railway &> /dev/null; then
    echo "Installing Railway CLI..."
    npm install -g @railway/cli
fi

# Login to Railway
echo "Logging in to Railway..."
railway login

# Deploy
echo "Deploying application..."
railway up

echo "✅ Deployment completed!"
echo "Your app should be available at: https://your-app-name.up.railway.app"
