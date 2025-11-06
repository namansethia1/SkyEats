# 🚀 SkyEats Deployment Guide

## 📋 Deployment Overview

This guide covers deploying SkyEats to production environments with recommended platforms and configurations.

## 🌐 Frontend Deployment (React)

### Option 1: Vercel (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy from frontend directory
cd frontend
vercel

# Configure environment variables in Vercel dashboard
# - VITE_API_BASE_URL
# - VITE_FIREBASE_* variables
```
## 🖥️ Backend Deployment (Spring Boot)

### Option 1: Heroku (Recommended)
```bash
# Create Heroku app
heroku create skyeats-backend

# Set environment variables
heroku config:set MONGODB_URI=your_mongodb_uri
heroku config:set FIREBASE_CONFIG_PATH=firebase-config.json

# Deploy
git push heroku main
```
mvn clean package

## 🗄️ Database Setup

### MongoDB Atlas (Recommended)
1. Create MongoDB Atlas account
2. Create new cluster
3. Configure network access (0.0.0.0/0 for production)
4. Create database user
5. Get connection string
6. Update application.properties

### Local MongoDB
```bash
# Install MongoDB
sudo apt install mongodb

# Start MongoDB service
sudo systemctl start mongodb
sudo systemctl enable mongodb

# Create database and user
mongo
use skyeats
db.createUser({
  user: "skyeats_user",
  pwd: "secure_password",
  roles: ["readWrite"]
})
```

## 🔥 Firebase Configuration

### Setup Firebase Project
1. Go to Firebase Console
2. Create new project
3. Enable Authentication (Email/Password)
4. Enable Firestore Database
5. Generate service account key
6. Download configuration files

### Environment Variables
```env
# Frontend (.env)
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id

# Backend (application-prod.properties)
firebase.config.path=classpath:firebase-service-account.json
```

## 🔧 Production Configuration

### Backend Production Settings
```properties
# application-prod.properties
spring.profiles.active=prod
server.port=${PORT:8080}

# MongoDB
spring.data.mongodb.uri=${MONGODB_URI}

# Firebase
firebase.config.path=${FIREBASE_CONFIG_PATH}

# CORS
cors.allowed.origins=${FRONTEND_URL}

# Logging
logging.level.com.skyeats=INFO
logging.level.org.springframework.security=WARN
```

### Frontend Production Build
```bash
# Build for production
npm run build

# Serve with static server (for testing)
npm install -g serve
serve -s dist -l 3000
```

## 🔒 Security Configuration

### SSL/HTTPS Setup
```nginx
# Nginx configuration
server {
    listen 443 ssl;
    server_name api.skyeats.com;
    
    ssl_certificate /path/to/certificate.crt;
    ssl_certificate_key /path/to/private.key;
    
    location / {
        proxy_pass http://localhost:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

### Environment Security
- Use environment variables for sensitive data
- Never commit API keys or passwords
- Use secrets management (AWS Secrets Manager, etc.)
- Enable HTTPS for all communications
- Configure proper CORS origins

## 📊 Monitoring & Logging

### Application Monitoring
```properties
# Enable actuator endpoints
management.endpoints.web.exposure.include=health,info,metrics
management.endpoint.health.show-details=always
```

### Logging Configuration
```xml
<!-- logback-spring.xml -->
<configuration>
    <appender name="STDOUT" class="ch.qos.logback.core.ConsoleAppender">
        <encoder>
            <pattern>%d{HH:mm:ss.SSS} [%thread] %-5level %logger{36} - %msg%n</pattern>
        </encoder>
    </appender>
    
    <logger name="com.skyeats" level="INFO"/>
    <root level="WARN">
        <appender-ref ref="STDOUT"/>
    </root>
</configuration>
```

## 🚀 CI/CD Pipeline

### GitHub Actions (Recommended)
```yaml
# .github/workflows/deploy.yml
name: Deploy SkyEats

on:
  push:
    branches: [main]

jobs:
  deploy-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: cd frontend && npm ci && npm run build
      - uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./frontend/dist

  deploy-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-java@v3
        with:
          java-version: '17'
      - run: cd backend && mvn clean package
      - uses: akhileshns/heroku-deploy@v3.12.12
        with:
          heroku_api_key: ${{ secrets.HEROKU_API_KEY }}
          heroku_app_name: "skyeats-backend"
          heroku_email: "your-email@example.com"
```

## 🔍 Health Checks

### Backend Health Check
```java
@RestController
public class HealthController {
    
    @GetMapping("/health")
    public ResponseEntity<Map<String, String>> health() {
        Map<String, String> status = new HashMap<>();
        status.put("status", "UP");
        status.put("timestamp", LocalDateTime.now().toString());
        return ResponseEntity.ok(status);
    }
}
```

### Frontend Health Check
```javascript
// Add to main.jsx
if (import.meta.env.PROD) {
  // Register service worker for PWA
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js');
  }
}
```

## 📈 Performance Optimization

### Backend Optimizations
```properties
# JVM tuning for production
JAVA_OPTS=-Xmx512m -Xms256m -XX:+UseG1GC

# Connection pooling
spring.data.mongodb.options.max-connection-pool-size=20
spring.data.mongodb.options.min-connection-pool-size=5
```

### Frontend Optimizations
```javascript
// vite.config.js production settings
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          ui: ['lucide-react', 'react-hot-toast']
        }
      }
    },
    chunkSizeWarningLimit: 1000
  }
});
```

## 🔄 Backup & Recovery

### Database Backup
```bash
# MongoDB backup
mongodump --uri="mongodb+srv://user:pass@cluster.mongodb.net/skyeats"

# Restore
mongorestore --uri="mongodb+srv://user:pass@cluster.mongodb.net/skyeats" dump/
```

### Application Backup
- Regular code commits to Git
- Environment variable backups
- Database regular snapshots
- File storage backups (Firebase Storage)

## 📞 Support & Maintenance

### Monitoring Checklist
- [ ] Application health endpoints
- [ ] Database connection status
- [ ] API response times
- [ ] Error rates and logs
- [ ] User authentication flow
- [ ] Payment processing (when implemented)

### Maintenance Tasks
- Regular dependency updates
- Security patches
- Database optimization
- Log rotation and cleanup
- Performance monitoring
- User feedback analysis

---

<div align="center">
  <p><strong>SkyEats is now ready for production deployment! 🚀</strong></p>
</div>