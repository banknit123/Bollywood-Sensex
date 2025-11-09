#!/bin/bash

echo "============================================"
echo "  BollywoodSensex - GitHub Preparation"
echo "  Domain: www.bollywoodsensex.com"
echo "============================================"
echo ""

# Create a clean directory for GitHub upload
GITHUB_DIR="/tmp/bollywoodsensex_github"
rm -rf $GITHUB_DIR
mkdir -p $GITHUB_DIR

echo "📦 Copying files for GitHub upload..."

# Copy backend files
echo "  ✓ Backend files..."
mkdir -p $GITHUB_DIR/backend
cp /app/backend/server.py $GITHUB_DIR/backend/
cp /app/backend/populate_movies.py $GITHUB_DIR/backend/
cp /app/backend/requirements.txt $GITHUB_DIR/backend/
cp /app/backend/.env.example $GITHUB_DIR/backend/

# Copy frontend files  
echo "  ✓ Frontend files..."
mkdir -p $GITHUB_DIR/frontend
cp -r /app/frontend/src $GITHUB_DIR/frontend/
cp -r /app/frontend/public $GITHUB_DIR/frontend/
cp /app/frontend/package.json $GITHUB_DIR/frontend/
cp /app/frontend/tailwind.config.js $GITHUB_DIR/frontend/
cp /app/frontend/postcss.config.js $GITHUB_DIR/frontend/
cp /app/frontend/.env.example $GITHUB_DIR/frontend/
[ -f /app/frontend/craco.config.js ] && cp /app/frontend/craco.config.js $GITHUB_DIR/frontend/

# Copy root files
echo "  ✓ Root files..."
cp /app/.gitignore $GITHUB_DIR/
cp /app/README.md $GITHUB_DIR/
cp /app/GITHUB_DEPLOYMENT_GUIDE.md $GITHUB_DIR/
cp /app/GITHUB_FILES_CHECKLIST.md $GITHUB_DIR/
cp /app/DEPLOYMENT_REPORT.md $GITHUB_DIR/

echo ""
echo "✅ Files prepared successfully!"
echo ""
echo "📍 Location: $GITHUB_DIR"
echo ""
echo "📊 File count:"
find $GITHUB_DIR -type f | wc -l | xargs echo "  Total files:"
echo ""
echo "📂 Directory structure:"
tree -L 2 $GITHUB_DIR 2>/dev/null || find $GITHUB_DIR -type d | head -20
echo ""
echo "============================================"
echo "  Next Steps:"
echo "============================================"
echo "1. Copy files from: $GITHUB_DIR"
echo "2. Upload to GitHub repository"
echo "3. Configure domain: www.bollywoodsensex.com"
echo "4. Deploy backend and frontend"
echo "5. Run populate_movies.py to add movies"
echo ""
echo "📖 See GITHUB_DEPLOYMENT_GUIDE.md for details"
echo "============================================"
