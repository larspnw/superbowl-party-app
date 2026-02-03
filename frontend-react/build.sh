#!/bin/bash
# Build script for Render deployment

echo "🏈 Building Super Bowl Party App..."

# Install dependencies
echo "Installing dependencies..."
npm install

# Build the app
echo "Building React app..."
npm run build

echo "✅ Build complete!"
echo "📁 Output: dist/"
echo "🚀 Ready for deployment"