@echo off
echo Installing dependencies...

echo Installing root dependencies...
call npm install

echo Installing server dependencies...
cd server
call npm install
cd ..

echo Installing client dependencies...
cd client
call npm install
cd ..

echo Setup complete!
echo.
echo To start the application:
echo 1. Make sure MongoDB is running
echo 2. Run: npm run dev
echo.
echo This will start both the backend (port 5000) and frontend (port 3000)
pause
