# 🚀 Deploy to Render

## Quick Deploy Steps:

### 1. Deploy Backend to Render
1. Go to https://render.com
2. Click "New" → "Web Service"
3. Connect your GitHub repo: `larspnw/superbowl-party-app`
4. Configure:
   - **Name**: `superbowl-party-api`
   - **Environment**: Python
   - **Build Command**: `pip install -r backend/requirements.txt`
   - **Start Command**: `python backend/app.py`
   - **Root Directory**: Leave empty (root)

### 2. Update Frontend (if needed)
The frontend is already configured to connect to `https://superbowl-party-api.onrender.com/api`

### 3. Test Your Deployment
Once deployed, test at: https://larspnw.github.io/superbowl-party-app/

## Environment Variables (Optional)
Add these in Render dashboard:
- `FLASK_ENV=production`
- `PORT=8080`

## Troubleshooting
- Check Render logs if backend fails to start
- Ensure GitHub Pages is enabled in repo settings
- Verify CORS origins match your frontend URL