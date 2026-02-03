# 🏈 Super Bowl Party Dish Organizer

A web-based drag-and-drop app for organizing dishes at your Super Bowl watch party.

## Features
- 🎯 4 categories: Appetizers, Sides, Main Dishes, Desserts
- 📱 Mobile-first responsive design
- 🎨 Seahawks theme (navy, neon green, wolf grey)
- ✨ Drag & drop functionality
- 👥 Real-time updates via polling
- 🔗 Shareable link (no login required)
- 📊 3 items max per category

## Quick Start

### Backend
```bash
cd backend
pip install -r requirements.txt
python app.py
```

### Frontend
Open `frontend/index.html` in your browser or serve with a simple HTTP server:
```bash
cd frontend
python -m http.server 3000
# Open http://localhost:3000
```

## API Endpoints
- `GET /api/categories` - Get all categories with cards
- `POST /api/cards` - Create a new card
- `PUT /api/cards/{id}/category` - Move card to new category

## Deployment
Ready for Render deployment - just push to GitHub and deploy!
