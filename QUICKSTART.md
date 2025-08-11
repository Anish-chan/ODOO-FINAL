# Quick Start Guide

## Prerequisites
- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas)
- Git

## Setup Instructions

### 1. Install Dependencies
Run the setup script:
```bash
# On Windows
setup.bat

# Or manually:
npm run install-all
```

### 2. Environment Configuration
Make sure these files exist with proper values:

**server/.env**
```
MONGODB_URI=mongodb://localhost:27017/hackathon
JWT_SECRET=your_super_secret_jwt_key_here
PORT=5000
NODE_ENV=development
```

**client/.env**
```
REACT_APP_API_URL=http://localhost:5000
```

### 3. Start MongoDB
Make sure MongoDB is running on your system:
```bash
# If using local MongoDB
mongod

# If using MongoDB Atlas, update the MONGODB_URI in server/.env
```

### 4. Run the Application
```bash
npm run dev
```

This will start:
- Backend server on http://localhost:5000
- Frontend client on http://localhost:3000

## Project Structure

```
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── context/        # Context providers
│   │   └── App.js          # Main app component
│   └── package.json
├── server/                 # Express backend
│   ├── models/             # MongoDB models
│   ├── routes/             # API routes
│   ├── middleware/         # Custom middleware
│   └── server.js           # Main server file
├── package.json            # Root package.json
└── README.md
```

## Available Scripts

- `npm run dev` - Start both frontend and backend
- `npm run server` - Start backend only
- `npm run client` - Start frontend only
- `npm run build` - Build frontend for production

## API Endpoints

### Authentication
- POST `/api/auth/register` - Register new user
- POST `/api/auth/login` - Login user

### Users
- GET `/api/users/profile` - Get user profile (protected)
- GET `/api/users` - Get all users

### Data
- GET `/api/data` - Get user's data (protected)
- POST `/api/data` - Create new data (protected)
- PUT `/api/data/:id` - Update data (protected)
- DELETE `/api/data/:id` - Delete data (protected)

## Features

✅ User authentication (register/login)
✅ Protected routes
✅ JWT token-based auth
✅ CRUD operations
✅ RESTful API
✅ Responsive design
✅ Error handling
✅ Input validation

## Hackathon Tips

1. **Quick Development**: The structure is ready - focus on your unique features!
2. **Easy Customization**: Modify the Data model in `server/models/Data.js` for your needs
3. **Add Features**: Use the dashboard as a template for new pages
4. **Styling**: Customize `client/src/App.css` for your design
5. **Deployment**: Ready for platforms like Heroku, Vercel, or Railway

## Next Steps

1. Customize the Data model for your specific use case
2. Add more routes and components as needed
3. Implement additional features (file upload, real-time updates, etc.)
4. Style the application to match your hackathon theme
5. Deploy to your preferred platform

Good luck with your hackathon! 🚀
