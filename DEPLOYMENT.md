# 🚀 Deployment Guide

This guide covers deploying the Clicko Flow Dashboard to various platforms.

## 📋 Prerequisites

- Node.js 16+ and npm
- MongoDB database (local or cloud)
- Git repository access

## 🐳 Docker Deployment (Recommended)

### Local Docker Setup

1. **Install Docker and Docker Compose**
   ```bash
   # macOS
   brew install docker docker-compose
   
   # Ubuntu
   sudo apt-get install docker.io docker-compose
   ```

2. **Deploy with one command**
   ```bash
   ./deploy.sh
   ```

3. **Access the application**
   - URL: http://localhost:5001
   - API: http://localhost:5001/api

### Cloud Docker Deployment

#### Heroku with Docker

1. **Install Heroku CLI**
   ```bash
   # macOS
   brew install heroku
   
   # Ubuntu
   sudo snap install heroku --classic
   ```

2. **Login and create app**
   ```bash
   heroku login
   heroku create your-app-name
   ```

3. **Set environment variables**
   ```bash
   heroku config:set NODE_ENV=production
   heroku config:set MONGODB_URI=your-mongodb-uri
   heroku config:set JWT_SECRET=your-secret-key
   ```

4. **Deploy**
   ```bash
   heroku container:push web
   heroku container:release web
   ```

#### DigitalOcean App Platform

1. **Create app in DigitalOcean dashboard**
2. **Connect your Git repository**
3. **Set environment variables**
4. **Deploy automatically**

## ☁️ Cloud Platform Deployment

### Heroku (Node.js)

1. **Create Heroku app**
   ```bash
   heroku create your-app-name
   ```

2. **Add MongoDB addon**
   ```bash
   heroku addons:create mongolab:sandbox
   ```

3. **Set environment variables**
   ```bash
   heroku config:set NODE_ENV=production
   heroku config:set JWT_SECRET=your-secret-key
   ```

4. **Deploy**
   ```bash
   git push heroku main
   ```

### Vercel (Frontend) + Railway (Backend)

#### Frontend on Vercel

1. **Connect repository to Vercel**
2. **Set build settings**
   - Build Command: `npm run build`
   - Output Directory: `build`
   - Install Command: `npm install`

3. **Set environment variables**
   ```
   REACT_APP_API_URL=https://your-backend-url.railway.app/api
   ```

#### Backend on Railway

1. **Connect repository to Railway**
2. **Set environment variables**
   ```
   NODE_ENV=production
   MONGODB_URI=your-mongodb-uri
   JWT_SECRET=your-secret-key
   PORT=5001
   ```

3. **Deploy automatically**

### Netlify (Frontend) + Render (Backend)

#### Frontend on Netlify

1. **Connect repository to Netlify**
2. **Set build settings**
   - Build Command: `npm run build`
   - Publish Directory: `build`

3. **Set environment variables**
   ```
   REACT_APP_API_URL=https://your-backend-url.onrender.com/api
   ```

#### Backend on Render

1. **Create new Web Service**
2. **Connect your repository**
3. **Set environment variables**
4. **Deploy automatically**

## 🖥️ VPS Deployment

### Ubuntu Server Setup

1. **Update system**
   ```bash
   sudo apt update && sudo apt upgrade -y
   ```

2. **Install Node.js**
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs
   ```

3. **Install MongoDB**
   ```bash
   wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -
   echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list
   sudo apt-get update
   sudo apt-get install -y mongodb-org
   sudo systemctl start mongod
   sudo systemctl enable mongod
   ```

4. **Clone and setup application**
   ```bash
   git clone your-repository-url
   cd clicko-flow
   npm run install-all
   ```

5. **Create environment file**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

6. **Build and start**
   ```bash
   ./start-production.sh
   ```

### Using PM2 for Process Management

1. **Install PM2**
   ```bash
   npm install -g pm2
   ```

2. **Create PM2 config**
   ```bash
   pm2 ecosystem
   ```

3. **Edit ecosystem.config.js**
   ```javascript
   module.exports = {
     apps: [{
       name: 'clicko-flow',
       script: 'backend/src/server.js',
       env: {
         NODE_ENV: 'production',
         PORT: 5001,
         MONGODB_URI: 'mongodb://localhost:27017/clicko-flow',
         JWT_SECRET: 'your-secret-key'
       }
     }]
   }
   ```

4. **Start with PM2**
   ```bash
   pm2 start ecosystem.config.js
   pm2 save
   pm2 startup
   ```

## 🔧 Environment Configuration

### Required Environment Variables

```env
# Database
MONGODB_URI=mongodb://localhost:27017/clicko-flow

# JWT Authentication
JWT_SECRET=your-super-secret-jwt-key

# Server Configuration
PORT=5001
NODE_ENV=production

# Frontend API URL (for development)
REACT_APP_API_URL=http://localhost:5001/api
```

### MongoDB Setup

#### Local MongoDB
```bash
# Start MongoDB
sudo systemctl start mongod

# Create database
mongosh
use clicko-flow
```

#### MongoDB Atlas (Cloud)
1. Create account at https://cloud.mongodb.com
2. Create new cluster
3. Get connection string
4. Add to environment variables

## 🔒 Security Considerations

### Production Security Checklist

- [ ] Change default JWT secret
- [ ] Use HTTPS in production
- [ ] Set up proper CORS configuration
- [ ] Enable rate limiting
- [ ] Use environment variables for secrets
- [ ] Set up proper MongoDB authentication
- [ ] Configure firewall rules
- [ ] Set up SSL/TLS certificates

### SSL/TLS Setup

#### Let's Encrypt (Free)
```bash
# Install Certbot
sudo apt install certbot

# Get certificate
sudo certbot certonly --standalone -d yourdomain.com

# Configure Nginx
sudo nano /etc/nginx/sites-available/clicko-flow
```

#### Nginx Configuration
```nginx
server {
    listen 80;
    server_name yourdomain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl;
    server_name yourdomain.com;
    
    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;
    
    location / {
        proxy_pass http://localhost:5001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## 📊 Monitoring and Logging

### Application Monitoring

#### PM2 Monitoring
```bash
# Monitor processes
pm2 monit

# View logs
pm2 logs

# Restart application
pm2 restart clicko-flow
```

#### Health Check Endpoint
```bash
curl https://yourdomain.com/api/health
```

### Database Monitoring

#### MongoDB Monitoring
```bash
# Check database status
mongosh --eval "db.stats()"

# Monitor connections
mongosh --eval "db.serverStatus().connections"
```

## 🔄 CI/CD Pipeline

### GitHub Actions

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v2
    
    - name: Setup Node.js
      uses: actions/setup-node@v2
      with:
        node-version: '18'
        
    - name: Install dependencies
      run: |
        npm install
        cd backend && npm install
        
    - name: Build application
      run: npm run build
      
    - name: Deploy to server
      run: |
        # Add your deployment commands here
        echo "Deploying to production..."
```

## 🆘 Troubleshooting

### Common Deployment Issues

1. **Port already in use**
   ```bash
   lsof -i :5001
   kill -9 <PID>
   ```

2. **MongoDB connection failed**
   ```bash
   # Check MongoDB status
   sudo systemctl status mongod
   
   # Restart MongoDB
   sudo systemctl restart mongod
   ```

3. **Build errors**
   ```bash
   # Clear cache
   npm cache clean --force
   
   # Reinstall dependencies
   rm -rf node_modules package-lock.json
   npm install
   ```

4. **Permission errors**
   ```bash
   # Fix file permissions
   chmod +x start-production.sh
   chmod +x deploy.sh
   ```

### Log Analysis

```bash
# Application logs
tail -f logs/app.log

# Error logs
grep -i error logs/app.log

# MongoDB logs
tail -f /var/log/mongodb/mongod.log
```

## 📞 Support

For deployment issues:
1. Check the troubleshooting section
2. Review application logs
3. Verify environment configuration
4. Contact the development team

---

**Happy Deploying! 🚀**
