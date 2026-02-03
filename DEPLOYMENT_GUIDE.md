# 🏈 Super Bowl Party App - Deployment Guide

## 🚀 Deployment Options

### Option 1: Deploy Both Frontend & Backend to Render (Recommended)

#### Step 1: Deploy Backend
```bash
cd backend
pip install -r requirements.txt
python app.py
```

#### Step 2: Deploy Frontend
```bash
cd frontend-react
npm install
npm run build
```

Use `frontend-render.yaml` for Render configuration.

### Option 2: GitHub Pages + Render (Current Setup)
- Frontend: GitHub Pages (already deployed)
- Backend: Render (needs deployment)

## 📋 Quick Deploy to Render

### Backend Deployment:
1. Go to https://render.com
2. New → Web Service
3. Connect GitHub repo: `larspnw/superbowl-party-app`
4. Settings:
   - Name: `superbowl-party-api`
   - Environment: Python
   - Build Command: `pip install -r backend/requirements.txt`
   - Start Command: `python backend/app.py`
   - Root Directory: `/backend`

### Frontend Deployment:
1. New → Static Site
2. Connect same repo
3. Build Command: `cd frontend-react && npm install && npm run build`
4. Publish Directory: `frontend-react/dist`

## 🔧 Environment Variables

Add these in Render dashboard:
```
VITE_API_URL=https://your-backend-url.onrender.com/api
```

## ✅ Features Included

### Pre-Made Couples:
- Steinberg
- Krass  
- JJ
- Baker
- Emsky
- EOD
- Merckis

### Drag & Drop:
- Smooth animations
- Visual feedback
- Touch support

### Modern Stack:
- React 18 + TypeScript
- Vite for fast builds
- Axios for API calls
- CSS Modules

## 🎯 Testing

After deployment:
1. Check health endpoint: `https://your-url/api/health`
2. Test drag & drop functionality
3. Add dishes for each couple
4. Verify real-time updates

## 🔍 Troubleshooting

### CORS Issues:
- Backend configured for multiple origins
- Check browser console for errors

### 503 Errors:
- Backend starting up (wait 30-60s)
- Check Render logs

### Build Failures:
- Ensure Node.js version compatibility
- Check package.json dependencies