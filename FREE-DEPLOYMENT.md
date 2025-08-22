# 🚀 Free Deployment Guide

This guide covers deploying the Clicko Flow Dashboard to **FREE** hosting platforms.

## 🎯 **Recommended: Railway (Easiest)**

### **Step 1: Setup Railway**
1. Go to [railway.app](https://railway.app)
2. Sign up with GitHub
3. Click "New Project"
4. Select "Deploy from GitHub repo"

### **Step 2: Connect Repository**
1. Select your GitHub repository
2. Railway will automatically detect the configuration
3. Click "Deploy"

### **Step 3: Add MongoDB**
1. In your Railway project, click "New"
2. Select "Database" → "MongoDB"
3. Railway will provide a connection string

### **Step 4: Set Environment Variables**
In Railway dashboard, go to "Variables" and add:
```
NODE_ENV=production
MONGODB_URI=mongodb://your-railway-mongo-connection-string
JWT_SECRET=your-super-secret-jwt-key
PORT=5001
```

### **Step 5: Deploy**
Railway will automatically deploy your app! 🎉

**Your app will be available at:** `https://your-app-name.railway.app`

---

## 🌐 **Alternative: Render (Free Tier)**

### **Step 1: Setup Render**
1. Go to [render.com](https://render.com)
2. Sign up with GitHub
3. Click "New +" → "Web Service"

### **Step 2: Connect Repository**
1. Connect your GitHub repository
2. Name: `clicko-flow-dashboard`
3. Environment: `Node`
4. Region: Choose closest to you

### **Step 3: Configure Build**
- **Build Command:** `npm run build-all`
- **Start Command:** `npm run start:prod`
- **Plan:** Free

### **Step 4: Add MongoDB**
1. Click "New +" → "PostgreSQL" (or use MongoDB Atlas)
2. For MongoDB Atlas:
   - Go to [mongodb.com/atlas](https://mongodb.com/atlas)
   - Create free cluster
   - Get connection string

### **Step 5: Set Environment Variables**
```
NODE_ENV=production
MONGODB_URI=your-mongodb-connection-string
JWT_SECRET=your-secret-key
PORT=10000
```

**Your app will be available at:** `https://your-app-name.onrender.com`

---

## ⚡ **Alternative: Cyclic (Free Tier)**

### **Step 1: Setup Cyclic**
1. Go to [cyclic.sh](https://cyclic.sh)
2. Sign up with GitHub
3. Click "Link Your Own"

### **Step 2: Connect Repository**
1. Select your repository
2. Cyclic will auto-detect the configuration
3. Click "Deploy"

### **Step 3: Add MongoDB**
1. In Cyclic dashboard, go to "Database"
2. Add MongoDB connection string
3. Or use Cyclic's built-in MongoDB

### **Step 4: Set Environment Variables**
```
NODE_ENV=production
MONGODB_URI=your-mongodb-connection-string
JWT_SECRET=your-secret-key
```

**Your app will be available at:** `https://your-app-name.cyclic.app`

---

## 🎨 **Alternative: Vercel + MongoDB Atlas**

### **Step 1: Setup MongoDB Atlas (Free)**
1. Go to [mongodb.com/atlas](https://mongodb.com/atlas)
2. Create free account
3. Create new cluster (free tier)
4. Get connection string

### **Step 2: Deploy to Vercel**
1. Go to [vercel.com](https://vercel.com)
2. Sign up with GitHub
3. Import your repository
4. Vercel will auto-detect configuration

### **Step 3: Set Environment Variables**
In Vercel dashboard:
```
MONGODB_URI=your-mongodb-atlas-connection-string
JWT_SECRET=your-secret-key
NODE_ENV=production
```

**Your app will be available at:** `https://your-app-name.vercel.app`

---

## 🗄️ **MongoDB Atlas Setup (Free)**

### **Step 1: Create Account**
1. Go to [mongodb.com/atlas](https://mongodb.com/atlas)
2. Sign up for free account
3. Create new project

### **Step 2: Create Cluster**
1. Click "Build a Database"
2. Choose "FREE" tier (M0)
3. Select cloud provider & region
4. Click "Create"

### **Step 3: Setup Database Access**
1. Go to "Database Access"
2. Click "Add New Database User"
3. Username: `clicko-flow-user`
4. Password: Generate secure password
5. Role: "Read and write to any database"

### **Step 4: Setup Network Access**
1. Go to "Network Access"
2. Click "Add IP Address"
3. Click "Allow Access from Anywhere" (0.0.0.0/0)

### **Step 5: Get Connection String**
1. Go to "Database"
2. Click "Connect"
3. Choose "Connect your application"
4. Copy the connection string
5. Replace `<password>` with your database user password

**Connection string format:**
```
mongodb+srv://clicko-flow-user:your-password@cluster0.xxxxx.mongodb.net/clicko-flow?retryWrites=true&w=majority
```

---

## 🔧 **Environment Variables Reference**

### **Required Variables**
```env
# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/clicko-flow

# JWT Authentication
JWT_SECRET=your-super-secret-jwt-key-change-this

# Server Configuration
NODE_ENV=production
PORT=5001
```

### **Optional Variables**
```env
# Frontend API URL (for development)
REACT_APP_API_URL=https://your-app-url.com/api
```

---

## 🚀 **Quick Deploy Commands**

### **Railway (CLI)**
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Deploy
railway up
```

### **Render (CLI)**
```bash
# Install Render CLI
curl -sL https://render.com/download-cli/linux | bash

# Deploy
render deploy
```

### **Vercel (CLI)**
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel --prod
```

---

## 🔍 **Testing Your Deployment**

### **Health Check**
```bash
curl https://your-app-url.com/api/health
```

### **Expected Response**
```json
{
  "status": "OK",
  "message": "Clicko Flow API is running",
  "timestamp": "2025-08-22T09:30:00.000Z"
}
```

### **Test API Endpoints**
```bash
# Test projects endpoint
curl https://your-app-url.com/api/projects

# Test monthly planning
curl https://your-app-url.com/api/monthly-planning/August%202025
```

---

## 🆘 **Troubleshooting**

### **Common Issues**

1. **Build Fails**
   ```bash
   # Check build logs in platform dashboard
   # Ensure all dependencies are in package.json
   ```

2. **MongoDB Connection Fails**
   ```bash
   # Verify connection string
   # Check network access in MongoDB Atlas
   # Ensure database user has correct permissions
   ```

3. **App Not Starting**
   ```bash
   # Check environment variables
   # Verify PORT is set correctly
   # Check application logs
   ```

4. **CORS Issues**
   ```bash
   # Frontend and backend should be on same domain
   # Or configure CORS properly
   ```

### **Platform-Specific Issues**

#### **Railway**
- Check "Deployments" tab for build logs
- Verify environment variables are set
- Check MongoDB service is running

#### **Render**
- Check "Logs" tab for error messages
- Verify build command is correct
- Check environment variables

#### **Cyclic**
- Check "Logs" in dashboard
- Verify MongoDB connection
- Check environment variables

#### **Vercel**
- Check "Functions" tab for API logs
- Verify MongoDB Atlas connection
- Check environment variables

---

## 📊 **Free Tier Limits**

### **Railway**
- ✅ 500 hours/month free
- ✅ 512MB RAM
- ✅ Shared CPU
- ✅ 1GB storage

### **Render**
- ✅ 750 hours/month free
- ✅ 512MB RAM
- ✅ Shared CPU
- ✅ 1GB storage

### **Cyclic**
- ✅ 1000 hours/month free
- ✅ 512MB RAM
- ✅ Shared CPU
- ✅ 1GB storage

### **Vercel**
- ✅ Unlimited deployments
- ✅ 100GB bandwidth
- ✅ Serverless functions
- ✅ 1GB storage

### **MongoDB Atlas**
- ✅ 512MB storage
- ✅ Shared clusters
- ✅ 500 connections
- ✅ Basic monitoring

---

## 🎉 **Success Checklist**

- [ ] App deploys successfully
- [ ] Health check endpoint works
- [ ] MongoDB connection established
- [ ] Frontend loads correctly
- [ ] API endpoints respond
- [ ] User registration works
- [ ] Project creation works
- [ ] Monthly planning saves

---

## 📞 **Need Help?**

1. **Check platform documentation**
2. **Review deployment logs**
3. **Verify environment variables**
4. **Test locally first**
5. **Contact platform support**

---

**Happy Free Deploying! 🚀**

*All platforms mentioned offer generous free tiers that should be sufficient for development and small production workloads.*
