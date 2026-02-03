#!/bin/bash
# Demo script for Super Bowl Party App

echo "🏈 Super Bowl Party Dish Organizer - Demo"
echo "========================================="
echo ""

# Start backend
echo "Starting backend server..."
cd backend
pip install -r requirements.txt
python app.py &
BACKEND_PID=$!

# Wait for backend to start
sleep 3

# Start frontend (simple HTTP server)
echo ""
echo "Starting frontend..."
cd ../frontend
python -m http.server 3000 &
FRONTEND_PID=$!

echo ""
echo "✅ App is running!"
echo "📱 Frontend: http://localhost:3000"
echo "🔗 Backend API: http://localhost:8080"
echo ""
echo "Press Ctrl+C to stop both servers"

# Cleanup on exit
trap "kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; exit" INT

# Keep script running
wait