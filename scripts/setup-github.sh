#!/bin/bash

# Setup script for pushing to GitHub
# Repository: https://github.com/revelium-studio/model-viewer.git

set -e

REPO_URL="https://github.com/revelium-studio/model-viewer.git"
REPO_NAME="model-viewer"

echo "🔧 Setting up GitHub repository..."

# Check if git is installed
if ! command -v git &> /dev/null; then
    echo "❌ Git is not installed. Please install Git first."
    exit 1
fi

# Initialize git if needed
if [ ! -d ".git" ]; then
    echo "📦 Initializing Git repository..."
    git init
fi

# Check if remote exists
if git remote | grep -q "origin"; then
    CURRENT_URL=$(git remote get-url origin)
    if [ "$CURRENT_URL" != "$REPO_URL" ]; then
        echo "🔄 Updating remote URL..."
        git remote set-url origin "$REPO_URL"
    else
        echo "✅ Remote already configured correctly"
    fi
else
    echo "🔗 Adding remote repository..."
    git remote add origin "$REPO_URL"
fi

# Add all files
echo "📝 Staging files..."
git add .

# Check if there are changes to commit
if [ -n "$(git status --porcelain)" ]; then
    echo "💾 Creating commit..."
    git commit -m "Initial commit: 3D Model Generator - Production ready Next.js app"
else
    echo "ℹ️  No changes to commit"
fi

# Set main branch
git branch -M main

echo ""
echo "✅ Git repository setup complete!"
echo ""
echo "📤 To push to GitHub, run:"
echo "   git push -u origin main"
echo ""
echo "⚠️  Note: You may need to authenticate with GitHub."
echo "   Options:"
echo "   1. Use Personal Access Token (recommended)"
echo "   2. Use SSH keys"
echo "   3. Use GitHub CLI (gh auth login)"
echo ""
