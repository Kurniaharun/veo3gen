#!/bin/bash

# Heroku Deployment Script
echo "🚀 Preparing for Heroku deployment..."

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "📦 Initializing git repository..."
    git init
fi

# Add all files
echo "📁 Adding files to git..."
git add .

# Commit changes
echo "💾 Committing changes..."
git commit -m "Prepare for Heroku deployment"

# Check if heroku remote exists
if ! git remote | grep -q heroku; then
    echo "🔗 Please create a Heroku app first:"
    echo "   heroku create your-app-name"
    echo "   Then run this script again."
    exit 1
fi

# Deploy to Heroku
echo "🚀 Deploying to Heroku..."
git push heroku main

echo "✅ Deployment complete!"
echo "🌐 Your app should be available at: https://your-app-name.herokuapp.com"
echo ""
echo "⚠️  Don't forget to set your environment variables:"
echo "   heroku config:set GEMINI_API_KEY=your_actual_api_key_here"
