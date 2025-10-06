@echo off
echo 🚀 Preparing for Heroku deployment...

REM Check if git is initialized
if not exist ".git" (
    echo 📦 Initializing git repository...
    git init
)

REM Add all files
echo 📁 Adding files to git...
git add .

REM Commit changes
echo 💾 Committing changes...
git commit -m "Prepare for Heroku deployment"

REM Check if heroku remote exists
git remote | findstr heroku >nul
if errorlevel 1 (
    echo 🔗 Please create a Heroku app first:
    echo    heroku create your-app-name
    echo    Then run this script again.
    pause
    exit /b 1
)

REM Deploy to Heroku
echo 🚀 Deploying to Heroku...
git push heroku main

echo ✅ Deployment complete!
echo 🌐 Your app should be available at: https://your-app-name.herokuapp.com
echo.
echo ⚠️  Don't forget to set your environment variables:
echo    heroku config:set GEMINI_API_KEY=your_actual_api_key_here
pause
