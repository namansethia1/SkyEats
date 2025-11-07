# Firebase Configuration Setup Guide

## Problem Solved
This guide addresses the `UnsatisfiedDependencyException` with FirebaseAuth bean being null, caused by Firebase not being properly initialized with credentials.

## What Was Fixed

### 1. FirebaseConfig.java Changes
- ✅ Added proper `@Configuration` annotation
- ✅ Created `FirebaseApp` bean with proper credential initialization
- ✅ Added `FirebaseAuth` bean that depends on the initialized `FirebaseApp`
- ✅ Used `GoogleCredentials.fromStream()` with service account credentials
- ✅ Added `FirebaseOptions.builder().setCredentials()` call
- ✅ Implemented multiple credential loading strategies

### 2. Application Configuration Updates
- ✅ Added `firebase.service-account-key` property for environment variable credentials
- ✅ Added `firebase.service-account-path` property for file-based credentials
- ✅ Updated both development and production configuration files

### 3. Render Deployment Configuration
- ✅ Added `FIREBASE_SERVICE_ACCOUNT_KEY` environment variable to render.yaml

## Setup Instructions

### For Render Deployment (Recommended)

1. **Get Firebase Service Account Key**:
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Select your project (`akasa-9c735`)
   - Go to Project Settings → Service Accounts
   - Click "Generate new private key"
   - Download the JSON file

2. **Set Environment Variable in Render**:
   - Go to your Render dashboard
   - Navigate to your service settings
   - Add environment variable:
     - **Key**: `FIREBASE_SERVICE_ACCOUNT_KEY`
     - **Value**: Copy and paste the entire contents of the downloaded JSON file
   
3. **Verify Other Environment Variables**:
   - `FIREBASE_PROJECT_ID`: Should be set to `akasa-9c735`
   - `MONGO_URI`: Your MongoDB connection string
   - `ALLOWED_ORIGINS`: Your frontend URL

### For Local Development

#### Option 1: Environment Variable (Recommended)
```bash
# Set the service account key as an environment variable
export FIREBASE_SERVICE_ACCOUNT_KEY='{"type":"service_account","project_id":"akasa-9c735",...}'
```

#### Option 2: Service Account File
1. Place your `serviceAccountKey.json` file in `backend/src/main/resources/`
2. Add to your local `application.yml`:
```yaml
firebase:
  service-account-path: serviceAccountKey.json
```

#### Option 3: Google Cloud CLI (For Development)
```bash
# Install and authenticate with Google Cloud CLI
gcloud auth application-default login
```

## Configuration Priority

The Firebase configuration tries credentials in this order:
1. **Environment Variable** (`FIREBASE_SERVICE_ACCOUNT_KEY`) - Best for production
2. **Classpath File** (`firebase.service-account-path`) - Good for local development
3. **Default Credentials** (gcloud CLI) - Convenient for local development
4. **Error** - Clear error message if none found

## Security Best Practices

### ✅ DO:
- Store service account key in environment variables for production
- Use different service accounts for different environments
- Regularly rotate service account keys
- Limit service account permissions to minimum required

### ❌ DON'T:
- Commit service account keys to version control
- Share service account keys in plain text
- Use production keys in development
- Store keys in application.properties files

## Verification

After deployment, check your application logs for:
```
✅ "Initializing Firebase for project: akasa-9c735"
✅ "Loading Firebase credentials from environment variable"
✅ "Firebase initialized successfully for project: akasa-9c735"
```

If you see errors, check:
1. Environment variable is set correctly in Render
2. JSON format is valid (no extra spaces/newlines)
3. Service account has proper permissions
4. Project ID matches your Firebase project

## Troubleshooting

### Error: "FirebaseOptions must be initialized with setCredentials()"
- **Cause**: No valid credentials found
- **Solution**: Set `FIREBASE_SERVICE_ACCOUNT_KEY` environment variable

### Error: "Failed to initialize Firebase"
- **Cause**: Invalid JSON or wrong project ID
- **Solution**: Verify JSON format and project ID

### Error: "FirebaseAuth bean is null"
- **Cause**: Firebase initialization failed
- **Solution**: Check application logs for Firebase initialization errors

## Next Steps

1. **Deploy**: Push changes and redeploy to Render
2. **Set Environment Variable**: Add `FIREBASE_SERVICE_ACCOUNT_KEY` in Render dashboard
3. **Test**: Verify authentication endpoints work correctly
4. **Monitor**: Check application logs for successful Firebase initialization

## Files Modified

- `backend/src/main/java/com/skyeats/config/FirebaseConfig.java` - Complete rewrite with proper credential handling
- `backend/src/main/resources/application.yml` - Added Firebase credential properties
- `backend/src/main/resources/application-prod.yml` - Added Firebase credential properties
- `render.yaml` - Added `FIREBASE_SERVICE_ACCOUNT_KEY` environment variable