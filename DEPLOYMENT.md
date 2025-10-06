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

### 2. Set Environment Variables (Optional)
The API key is already configured in the code. If you want to use a different key, set it in Heroku:
```bash
heroku config:set GEMINI_API_KEY=your_actual_api_key_here
```

### 3. Deploy to Heroku
```bash
# Login to Heroku
heroku login

# Create Heroku app
heroku create your-app-name

# Set environment variables (optional - API key is already configured)
# heroku config:set GEMINI_API_KEY=your_actual_api_key_here

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
- `GEMINI_API_KEY`: Your Google Gemini API key for VEO video generation (already configured in code)

## Notes
- The app will automatically build and start on Heroku
- API key is already configured in the code (no need to set environment variables)
- The app uses Express server to serve the React build files
- No localhost port configuration is needed for production
