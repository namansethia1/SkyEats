# 🚀 SkyEats Backend Deployment on Render

## Prerequisites
- GitHub repository with backend code
- MongoDB Atlas database
- Firebase project with service account key

## 🔧 Deployment Steps

### 1. **Create New Web Service on Render**
1. Go to [render.com](https://render.com) and sign in
2. Click "New +" → "Web Service"
3. Connect your GitHub repository: `namansethia1/SkyEats`

### 2. **Configure Build Settings**
- **Name**: `skyeats-backend`
- **Environment**: `Java`
- **Region**: Choose closest to your users
- **Branch**: `main`
- **Root Directory**: `backend`
- **Build Command**: `chmod +x ./mvnw && ./mvnw clean package -DskipTests -Pprod`
- **Start Command**: `java -jar target/skyeats-backend-0.0.1-SNAPSHOT.jar`

### 3. **Set Environment Variables**
Add these environment variables in Render dashboard:

```bash
# MongoDB Configuration
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/skyeats?retryWrites=true&w=majority
MONGO_DATABASE=skyeats

# Firebase Configuration
FIREBASE_PROJECT_ID=your-firebase-project-id

# Server Configuration
PORT=8080
SPRING_PROFILES_ACTIVE=prod

# CORS Configuration
ALLOWED_ORIGINS=https://akasa-mzdehcwii-namanchrists-projects.vercel.app

# Note: No Firebase credentials needed for email/password auth
```

### 4. **Firebase Configuration**
1. Go to Firebase Console → Project Settings → General
2. Copy your Project ID
3. Add it as `FIREBASE_PROJECT_ID` environment variable
4. No service account credentials needed - frontend handles authentication directly

### 5. **MongoDB Atlas Setup**
1. Create MongoDB Atlas cluster
2. Create database user
3. Whitelist Render's IP addresses (or use 0.0.0.0/0 for all IPs)
4. Get connection string and add to `MONGO_URI`

### 6. **Deploy**
1. Click "Create Web Service"
2. Render will automatically build and deploy
3. Monitor logs for any issues

## 🔍 Verification

### Health Check Endpoints
- **Health**: `https://your-app.onrender.com/actuator/health`
- **API Base**: `https://your-app.onrender.com/api`
- **Inventory**: `https://your-app.onrender.com/api/inventory`

### Test API
```bash
curl https://your-app.onrender.com/api/inventory
```

## 🔄 Auto-Deployment
- Connected to GitHub `main` branch
- Automatic deployments on every push
- Build logs available in Render dashboard

## 🛠️ Troubleshooting

### Common Issues
1. **Build Fails**: Check Java version (should be 17)
2. **MongoDB Connection**: Verify connection string and IP whitelist
3. **Firebase Auth**: Ensure Firebase Project ID is correctly set
4. **CORS Issues**: Add frontend URL to `ALLOWED_ORIGINS`

### Logs
- View real-time logs in Render dashboard
- Check for startup errors and connection issues

## 📝 Post-Deployment
1. Update frontend `VITE_API_BASE_URL` to point to Render URL
2. Test all API endpoints
3. Verify Firebase authentication works
4. Check MongoDB data persistence

## 🔗 Useful Links
- [Render Java Deployment Guide](https://render.com/docs/deploy-spring-boot)
- [MongoDB Atlas Setup](https://docs.atlas.mongodb.com/)
- [Firebase Admin SDK](https://firebase.google.com/docs/admin/setup)