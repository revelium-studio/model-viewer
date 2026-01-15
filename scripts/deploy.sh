#!/bin/bash

# Deployment script for 3D Model Generator
# This script helps deploy to GitHub and Vercel

set -e

echo "🚀 Starting deployment process..."

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "📦 Initializing Git repository..."
    git init
fi

# Check if remote exists
if ! git remote | grep -q "origin"; then
    echo "🔗 Adding GitHub remote..."
    git remote add origin https://github.com/revelium-studio/model-viewer.git
fi

# Check for uncommitted changes
if [ -n "$(git status --porcelain)" ]; then
    echo "📝 Staging changes..."
    git add .
    echo "💾 Committing changes..."
    git commit -m "Deploy: $(date +'%Y-%m-%d %H:%M:%S')" || echo "No changes to commit"
fi

# Push to GitHub
echo "📤 Pushing to GitHub..."
git branch -M main
git push -u origin main || echo "⚠️  Push failed. You may need to authenticate."

echo "✅ GitHub push complete!"

# Check if Vercel CLI is installed
if command -v vercel &> /dev/null; then
    echo "🌐 Deploying to Vercel..."
    vercel --prod
    echo "✅ Vercel deployment complete!"
else
    echo "⚠️  Vercel CLI not found. Install with: npm i -g vercel"
    echo "   Or deploy via Vercel Dashboard: https://vercel.com"
fi

echo "🎉 Deployment process complete!"
echo ""
echo "📋 Next steps:"
echo "   1. Set environment variables in Vercel Dashboard"
echo "   2. Redeploy after setting environment variables"
echo "   3. Test your deployment"
