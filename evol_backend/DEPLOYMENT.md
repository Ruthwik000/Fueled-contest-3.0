# Deployment Guide for Render

## 📦 Files to Keep

### ✅ Keep All These Files:
```
reco/
├── celebrities.json                    # Original celebrity data
├── products.json                       # Original product data
├── celebrities_with_vectors.json       # Generated (with embeddings)
├── products_with_vectors.json         # Generated (with embeddings)
├── celebrity_embeddings.pkl           # Generated (numpy arrays)
├── product_embeddings.pkl             # Generated (numpy arrays)
├── celebrity_embeddings_metadata.json # Metadata
├── product_embeddings_metadata.json   # Metadata
├── main.py                            # FastAPI application
├── recommender_engine.py              # Core recommendation logic
├── style_taxonomy.py                  # Style mappings
├── requirements.txt                   # Python dependencies
├── render.yaml                        # Render configuration
├── .gitignore                         # Git ignore rules
├── index.html                         # Frontend
├── API_DOCUMENTATION.md               # API docs
└── README.md                          # Project docs
```

### ❌ Optional to Delete (not needed in production):
```
├── generate_celebrity_vectors.py      # Only needed for regenerating
├── generate_product_vectors.py       # Only needed for regenerating
├── main.py                           # CLI version (optional)
├── user_questionnaire.py             # CLI questionnaire (optional)
├── api_test.py                       # Testing script (optional)
├── test.py                           # Testing script (optional)
└── __pycache__/                      # Python cache (auto-ignored)
```

## 🚀 Deployment Steps

### Step 1: Prepare Your Repository

1. **Generate embeddings locally** (if not done):
   ```powershell
   python generate_celebrity_vectors.py
   python generate_product_vectors.py
   ```

2. **Verify all files exist**:
   - Check that `.pkl` and `_with_vectors.json` files are present
   - Total size should be around 5-10 MB

### Step 2: Push to GitHub

1. **Initialize Git** (if not done):
   ```powershell
   git init
   git add .
   git commit -m "Initial commit - Jewelry recommendation system"
   ```

2. **Create GitHub repository** and push:
   ```powershell
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
   git branch -M main
   git push -u origin main
   ```

### Step 3: Deploy on Render

1. **Go to** [render.com](https://render.com) and sign up/login

2. **Create New Web Service**:
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Select the repository

3. **Configure Service**:
   - **Name**: `jewelry-recommendation-api` (or your choice)
   - **Environment**: `Python 3`
   - **Region**: Choose closest to your users
   - **Branch**: `main`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`
   - **Plan**: Free (or paid for better performance)

4. **Environment Variables** (optional):
   - Add any environment variables if needed (none required for basic setup)

5. **Click "Create Web Service"**

### Step 4: Access Your API

After deployment (takes 3-5 minutes):

- **API URL**: `https://your-service-name.onrender.com`
- **Health Check**: `https://your-service-name.onrender.com/health`
- **API Docs**: `https://your-service-name.onrender.com/docs`

### Step 5: Update Frontend

Update `index.html` to use your Render URL:

```javascript
// Change this line:
const API_URL = 'http://localhost:8000';

// To your Render URL:
const API_URL = 'https://your-service-name.onrender.com';
```

## 🎯 Hosting the Frontend

### Option 1: Host on Render (Static Site)

1. **Create another service**:
   - Click "New +" → "Static Site"
   - Select same repository
   - **Publish Directory**: `.` (root)
   - Deploy

2. **Or use a separate repo** for just `index.html`

### Option 2: Host on Netlify/Vercel

1. Create new folder with just `index.html`
2. Update `API_URL` to your Render backend
3. Deploy to Netlify/Vercel (drag & drop)

### Option 3: Serve from Same Backend

Update `main.py` to serve `index.html`:

```python
from fastapi.responses import FileResponse

# Add this endpoint
@app.get("/")
async def read_root():
    return FileResponse('index.html')
```

## ⚙️ Important Configuration

### CORS Settings

Your `main.py` already has CORS enabled for all origins:
```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

For production, you may want to restrict to your frontend domain:
```python
allow_origins=["https://your-frontend-domain.netlify.app"]
```

## 🔍 Troubleshooting

### Issue: "File not found" errors
**Solution**: Make sure all `.json` and `.pkl` files are committed to Git

### Issue: "Module not found"
**Solution**: Check `requirements.txt` is complete and committed

### Issue: Slow first request
**Solution**: Render free tier spins down after 15 min inactivity. First request wakes it up (~30s)

### Issue: Out of memory
**Solution**: Upgrade to paid plan or optimize embedding file sizes

## 📊 File Sizes Check

Before deploying, verify sizes:
```powershell
Get-ChildItem -File | Select-Object Name, Length | Format-Table -AutoSize
```

Expected sizes:
- `celebrity_embeddings.pkl`: ~50-100 KB
- `product_embeddings.pkl`: ~300-500 KB
- Total embeddings: < 1 MB
- All files combined: ~5-10 MB (well within Render limits)

## 🎉 Production Checklist

- [ ] All embedding files generated and present
- [ ] `requirements.txt` complete
- [ ] `render.yaml` configured
- [ ] Git repository initialized
- [ ] Code pushed to GitHub
- [ ] Render web service created
- [ ] Deployment successful (check logs)
- [ ] Health endpoint returns 200
- [ ] API documentation accessible at `/docs`
- [ ] Frontend updated with production API URL
- [ ] Frontend deployed and accessible
- [ ] End-to-end test: Survey → Recommendations working

## 💡 Performance Tips

1. **Keep generated embeddings**: Regenerating on each deploy is slow and unnecessary
2. **Use pickle files**: Faster loading than JSON for numpy arrays
3. **Monitor startup time**: Should be < 10 seconds with pre-generated embeddings
4. **Consider paid tier**: If you need 24/7 uptime without cold starts

## 🔗 Useful Links

- [Render Documentation](https://render.com/docs)
- [FastAPI Deployment Guide](https://fastapi.tiangolo.com/deployment/)
- [Your API Docs](https://your-service-name.onrender.com/docs) (after deployment)
