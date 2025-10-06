# Heroku Deployment Guide

## Prerequisites
- Heroku CLI installed
- Git repository set up
- Gemini API key

## Deployment Steps

### 1. Install Dependencies
```bash
npm install
```

### 2. Set Environment Variables
Set your Gemini API key in Heroku:
```bash
heroku config:set GEMINI_API_KEY=your_actual_api_key_here
```

### 3. Deploy to Heroku
```bash
# Login to Heroku
heroku login

# Create Heroku app
heroku create your-app-name

# Set environment variables
heroku config:set GEMINI_API_KEY=your_actual_api_key_here

# Deploy
git add .
git commit -m "Prepare for Heroku deployment"
git push heroku main
```

### 4. Open Your App
```bash
heroku open
```

## Environment Variables
- `GEMINI_API_KEY`: Your Google Gemini API key for VEO video generation

## Notes
- The app will automatically build and start on Heroku
- Make sure to set the `GEMINI_API_KEY` environment variable in Heroku dashboard
- The app uses Express server to serve the React build files
- No localhost port configuration is needed for production
