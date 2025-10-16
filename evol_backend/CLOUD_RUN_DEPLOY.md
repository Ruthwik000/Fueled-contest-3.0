# 🚀 Google Cloud Run Deployment Guide

## 📋 Prerequisites

1. **Google Cloud Account**: Sign up at [cloud.google.com](https://cloud.google.com)
2. **Google Cloud SDK**: Install from [cloud.google.com/sdk](https://cloud.google.com/sdk/docs/install)
3. **Git Repository**: Your code should be on GitHub
4. **Billing Enabled**: Cloud Run requires billing (has generous free tier)

## 📦 Files Created for Cloud Run

```
reco/
├── Dockerfile                  # Container image definition
├── .dockerignore              # Files to exclude from Docker build
├── .gcloudignore             # Files to exclude from GCP upload
├── cloudbuild.yaml           # Automatic build/deploy configuration
├── app.yaml                  # Alternative: App Engine config
└── CLOUD_RUN_DEPLOY.md       # This file
```

## 🎯 Deployment Methods

### Method 1: GitHub Integration (RECOMMENDED - Automatic Deployments)

This method automatically deploys when you push to GitHub.

#### Step 1: Set up Google Cloud Project

```powershell
# Login to Google Cloud
gcloud auth login

# Create new project (or use existing)
gcloud projects create jewelry-recommendation-api --name="Jewelry Recommendation API"

# Set project
gcloud config set project jewelry-recommendation-api

# Enable required APIs
gcloud services enable cloudbuild.googleapis.com
gcloud services enable run.googleapis.com
gcloud services enable containerregistry.googleapis.com
```

#### Step 2: Connect GitHub Repository

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Navigate to **Cloud Run** → **Create Service**
3. Select **"Continuously deploy from a repository"**
4. Click **"Set up with Cloud Build"**
5. Select **GitHub** as source
6. Authenticate and select your repository: `vara-prasad-07/evol_backend`
7. Select branch: `Atm-interface` (or `main`)
8. Build Configuration: **Dockerfile**
   - Build context: `/reco` (if code is in reco folder)
   - Dockerfile location: `/reco/Dockerfile`

#### Step 3: Configure Service

- **Service name**: `jewelry-recommendation-api`
- **Region**: Choose closest to your users (e.g., `us-central1`, `asia-south1`)
- **Authentication**: Allow unauthenticated invocations
- **CPU allocation**: CPU is only allocated during request processing
- **Memory**: 1 GiB (recommended for ML model)
- **CPU**: 1
- **Max instances**: 10
- **Port**: 8080

#### Step 4: Deploy

Click **"Create"** - Cloud Build will:
1. Clone your GitHub repo
2. Build Docker image
3. Push to Container Registry
4. Deploy to Cloud Run
5. Provide you with a URL: `https://jewelry-recommendation-api-xxx.run.app`

### Method 2: Manual Deployment via gcloud CLI

```powershell
# Navigate to project directory
cd C:\Users\chinn\OneDrive\Desktop\scrape\reco

# Login and set project
gcloud auth login
gcloud config set project YOUR_PROJECT_ID

# Build and deploy in one command
gcloud run deploy jewelry-recommendation-api \
  --source . \
  --region us-central1 \
  --platform managed \
  --allow-unauthenticated \
  --memory 1Gi \
  --cpu 1 \
  --port 8080 \
  --max-instances 10
```

### Method 3: Using cloudbuild.yaml (Automated CI/CD)

```powershell
# Submit build to Cloud Build
gcloud builds submit --config cloudbuild.yaml .
```

## 🔧 Configuration Details

### Dockerfile Explanation

```dockerfile
FROM python:3.11-slim          # Lightweight Python image
WORKDIR /app                   # Set working directory
COPY requirements.txt .        # Copy dependencies first (caching)
RUN pip install ...            # Install dependencies
COPY *.json *.pkl .           # Copy all data files including embeddings
COPY *.py .                   # Copy application code
CMD uvicorn main:app ...      # Start FastAPI server
```

### Important Notes

- ✅ **Includes all embeddings**: `.pkl` and `*_with_vectors.json` files are copied
- ✅ **Port 8080**: Cloud Run requires port 8080 (configured via `PORT` env var)
- ✅ **Optimized caching**: Requirements installed before code copy
- ✅ **Small image**: Uses `python:3.11-slim` (~150MB base)

## 📊 File Size Verification

Before deploying, check total size:

```powershell
# Check individual file sizes
Get-ChildItem *.json, *.pkl | Format-Table Name, Length -AutoSize

# Expected sizes:
# - celebrity_embeddings.pkl: ~50-100 KB
# - product_embeddings.pkl: ~300-500 KB
# - *_with_vectors.json: ~200-400 KB each
# - Total: ~5-10 MB (well within Cloud Run limits)
```

## 🌐 After Deployment

### 1. Get Your Service URL

```powershell
gcloud run services describe jewelry-recommendation-api --region us-central1 --format 'value(status.url)'
```

Example: `https://jewelry-recommendation-api-abc123-uc.a.run.app`

### 2. Test Your API

```powershell
# Health check
curl https://YOUR_SERVICE_URL/health

# API documentation
# Open in browser: https://YOUR_SERVICE_URL/docs
```

### 3. Update Frontend (index.html)

Update the API URL in `index.html`:

```javascript
// Change from:
const API_URL = 'http://localhost:8000';

// To your Cloud Run URL:
const API_URL = 'https://jewelry-recommendation-api-abc123-uc.a.run.app';
```

### 4. Host Frontend

**Option A: Cloud Run (Same Service)**

Add this to your `main.py`:

```python
from fastapi.responses import FileResponse

@app.get("/")
async def serve_frontend():
    return FileResponse('index.html')
```

Rebuild and redeploy - your frontend will be at `https://YOUR_SERVICE_URL/`

**Option B: Firebase Hosting (Free)**

```powershell
# Install Firebase CLI
npm install -g firebase-tools

# Initialize Firebase
firebase init hosting

# Deploy
firebase deploy --only hosting
```

**Option C: Cloud Storage + Load Balancer**

Upload `index.html` to Cloud Storage bucket with public access.

## 💰 Pricing Estimate (Free Tier)

Cloud Run Free Tier (per month):
- **2 million requests**
- **360,000 vCPU-seconds**
- **180,000 GiB-seconds** of memory

For this application:
- Request time: ~500ms (with cold start) / ~100ms (warm)
- Memory: 1 GiB
- **Estimated free requests per month**: ~180,000-360,000

After free tier: ~$0.40 per million requests

## 🔍 Monitoring & Logs

### View Logs

```powershell
# Stream logs
gcloud run services logs tail jewelry-recommendation-api --region us-central1

# View in Console
# https://console.cloud.google.com/run
```

### Monitoring Dashboard

Go to Cloud Console → Cloud Run → Your Service → Metrics

Monitor:
- Request count
- Request latency
- Container instance count
- Memory utilization
- CPU utilization

## 🚨 Troubleshooting

### Issue: "Port 8080 not found"

**Solution**: Ensure Dockerfile has:
```dockerfile
CMD uvicorn main:app --host 0.0.0.0 --port ${PORT:-8080}
```

### Issue: "Container startup timeout"

**Solution**: Increase startup timeout:
```powershell
gcloud run services update jewelry-recommendation-api \
  --region us-central1 \
  --timeout 300
```

### Issue: "Out of memory"

**Solution**: Increase memory allocation:
```powershell
gcloud run services update jewelry-recommendation-api \
  --region us-central1 \
  --memory 2Gi
```

### Issue: "CORS errors"

**Solution**: Your `main.py` already has CORS configured for all origins. To restrict:

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://your-frontend-domain.web.app"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### Issue: "Cold start too slow"

**Solutions**:
1. **Minimum instances**: Keep 1 instance always warm
   ```powershell
   gcloud run services update jewelry-recommendation-api \
     --region us-central1 \
     --min-instances 1
   ```
   Note: This costs ~$6/month but eliminates cold starts

2. **Cloud Scheduler**: Ping service every 5 minutes
   ```powershell
   gcloud scheduler jobs create http keep-warm \
     --schedule "*/5 * * * *" \
     --uri "https://YOUR_SERVICE_URL/health" \
     --http-method GET
   ```

## 🔒 Security Best Practices

### 1. Use Secret Manager for Sensitive Data

```powershell
# Create secret
gcloud secrets create api-key --data-file=./api-key.txt

# Grant access to Cloud Run
gcloud secrets add-iam-policy-binding api-key \
  --member serviceAccount:YOUR_PROJECT_NUMBER-compute@developer.gserviceaccount.com \
  --role roles/secretmanager.secretAccessor

# Use in deployment
gcloud run deploy jewelry-recommendation-api \
  --update-secrets API_KEY=api-key:latest
```

### 2. Restrict Access (Optional)

If you want authenticated access only:

```powershell
gcloud run services update jewelry-recommendation-api \
  --region us-central1 \
  --no-allow-unauthenticated
```

### 3. Custom Domain (Optional)

```powershell
# Map custom domain
gcloud run domain-mappings create \
  --service jewelry-recommendation-api \
  --domain api.yourdomain.com \
  --region us-central1
```

## 📈 Optimization Tips

### 1. Use Artifact Registry (instead of Container Registry)

```powershell
# Enable Artifact Registry
gcloud services enable artifactregistry.googleapis.com

# Create repository
gcloud artifacts repositories create jewelry-api \
  --repository-format=docker \
  --location=us-central1

# Build and push
gcloud builds submit --tag us-central1-docker.pkg.dev/PROJECT_ID/jewelry-api/app
```

### 2. Multi-stage Docker Build (Reduce Size)

```dockerfile
# Build stage
FROM python:3.11 as builder
WORKDIR /app
COPY requirements.txt .
RUN pip install --user -r requirements.txt

# Runtime stage
FROM python:3.11-slim
WORKDIR /app
COPY --from=builder /root/.local /root/.local
COPY . .
ENV PATH=/root/.local/bin:$PATH
CMD uvicorn main:app --host 0.0.0.0 --port $PORT
```

### 3. Health Check Endpoint

Your `main.py` already has `/health` - Cloud Run uses this automatically.

## ✅ Deployment Checklist

Before deploying:

- [ ] All embedding files (`.pkl`, `*_with_vectors.json`) are in repo
- [ ] `Dockerfile` is in root of reco folder
- [ ] `.dockerignore` excludes unnecessary files
- [ ] `requirements.txt` is complete
- [ ] Google Cloud project created
- [ ] Billing enabled on GCP
- [ ] Required APIs enabled (Cloud Run, Cloud Build, Container Registry)
- [ ] GitHub repo is pushed and up-to-date

After deploying:

- [ ] Service deployed successfully
- [ ] Health endpoint returns 200: `curl https://YOUR_URL/health`
- [ ] API docs accessible: `https://YOUR_URL/docs`
- [ ] Test recommendation endpoint with sample data
- [ ] Frontend updated with Cloud Run URL
- [ ] Frontend deployed and accessible
- [ ] End-to-end test: Survey → Recommendations working

## 🎉 Quick Start Commands

```powershell
# 1. Set up GCP
gcloud auth login
gcloud config set project YOUR_PROJECT_ID
gcloud services enable cloudbuild.googleapis.com run.googleapis.com

# 2. Deploy
cd C:\Users\chinn\OneDrive\Desktop\scrape\reco
gcloud run deploy jewelry-recommendation-api \
  --source . \
  --region us-central1 \
  --allow-unauthenticated \
  --memory 1Gi

# 3. Get URL
gcloud run services describe jewelry-recommendation-api \
  --region us-central1 \
  --format 'value(status.url)'

# 4. Test
curl $(gcloud run services describe jewelry-recommendation-api --region us-central1 --format 'value(status.url)')/health
```

## 🔗 Useful Links

- [Cloud Run Documentation](https://cloud.google.com/run/docs)
- [Cloud Run Pricing](https://cloud.google.com/run/pricing)
- [Cloud Build Documentation](https://cloud.google.com/build/docs)
- [Dockerfile Best Practices](https://docs.docker.com/develop/dev-best-practices/)
- [FastAPI Deployment](https://fastapi.tiangolo.com/deployment/docker/)

## 📞 Support

If you encounter issues:
1. Check Cloud Run logs: `gcloud run services logs tail SERVICE_NAME`
2. Review Cloud Build logs in Console
3. Verify Dockerfile builds locally: `docker build -t test .`
4. Check Cloud Run quotas and limits
