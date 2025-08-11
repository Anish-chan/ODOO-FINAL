# QuickCourt - Local Sports Booking Platform

A comprehensive full-stack web application that connects sports enthusiasts with local sports facilities for seamless booking and community engagement.

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or MongoDB Atlas)
- Git

### Installation & Setup

1. **Clone the repository**
```bash
git clone <repository-url>
cd ODOO-FINAL
```

2. **Install dependencies**
```bash
npm run install-all
```

3. **Environment Setup**
Create a `.env` file in the server directory:
```bash
cd server
cp .env.example .env
```
Update the `.env` file with your MongoDB connection string and JWT secret.

4. **Run the application**
```bash
# From the root directory
npm run dev
```

This will start:
- Backend server: `http://localhost:5000`
- Frontend client: `http://localhost:3000`

### Alternative Running Methods

**Run Frontend Only:**
```bash
cd client
npm start
```

**Run Backend Only:**
```bash
cd server
npm run dev
```

**Production Build:**
```bash
cd client
npm run build
```

## 🧪 Demo Accounts
- **User**: user1@demo.com / 123456
- **Facility Owner**: owner1@demo.com / 123456
- **Admin**: admin1@demo.com / 123456

## 📋 Project Overview

QuickCourt is a modern sports facility booking platform that enables users to discover, book, and manage sports venues while providing facility owners with comprehensive management tools.

## 🏗️ Project Structure

```
ODOO-FINAL/
├── client/                 # React Frontend Application
│   ├── public/            # Static assets
│   ├── src/
│   │   ├── components/    # React components
│   │   │   ├── Auth/      # Authentication components
│   │   │   ├── Layout/    # Layout components (Navbar, etc.)
│   │   │   ├── Pages/     # Page components
│   │   │   └── Routing/   # Route protection components
│   │   ├── context/       # React Context for state management
│   │   ├── api/          # API configuration and calls
│   │   └── App.css       # Global styles
│   └── package.json      # Frontend dependencies
├── server/                # Express Backend Application
│   ├── controllers/       # Route controllers
│   ├── middleware/        # Custom middleware
│   ├── models/           # MongoDB models
│   ├── routes/           # API routes
│   ├── uploads/          # File uploads directory
│   └── package.json      # Backend dependencies
├── package.json          # Root package.json for scripts
└── README.md            # This file
```

## ✨ Core Features

### 🏆 User Features
- **Personalized Dashboard**: Activity overview with statistics, recent bookings, and favorites
- **Venue Discovery**: Browse and search sports facilities with advanced filtering
- **Detailed Venue Pages**: View comprehensive venue information with image galleries
- **Smart Booking**: Real-time court availability and seamless booking process
- **Booking Management**: View, modify, and cancel bookings with status tracking
- **Review System**: Rate and review venues after visits
- **Profile Management**: Update personal information and preferences
- **Quick Actions**: Fast access to common tasks from dashboard
- **Favorite Venues**: Save and quickly access preferred sports facilities

### 🏢 Facility Owner Features
- **Owner Dashboard**: Comprehensive business analytics with revenue tracking and performance metrics
- **Facility Management**: Add, edit, and manage multiple sports facilities with status tracking
- **Booking Management**: Real-time booking requests with approval/decline functionality
- **Revenue Analytics**: Detailed financial tracking with monthly and total earnings
- **Performance Metrics**: Occupancy rates, popular sports, and growth statistics
- **Customer Communication**: Direct contact information and booking details
- **Court Management**: Configure courts, pricing, and availability schedules
- **Review Management**: Monitor and respond to customer feedback
- **Approval Tracking**: Real-time status updates for facility approvals
- **Quick Actions**: Fast access to common management tasks

### 👑 Admin Features
- **Facility Approval**: Review and approve new facility registrations
- **User Management**: Monitor and manage user accounts
- **Platform Analytics**: System-wide statistics and insights
- **Content Moderation**: Review and moderate user-generated content
- **Reports**: Generate comprehensive platform reports

## 🛠️ Tech Stack

### Frontend
- **React 18**: Modern React with hooks and functional components
- **React Router v6**: Client-side routing and navigation
- **CSS3**: Custom styling with modern CSS features
- **Axios**: HTTP client for API communication
- **Context API**: State management for authentication and global state

### Backend
- **Node.js**: JavaScript runtime environment
- **Express.js**: Web application framework
- **MongoDB**: NoSQL database for data storage
- **Mongoose**: MongoDB object modeling for Node.js
- **JWT**: JSON Web Tokens for authentication
- **Bcrypt**: Password hashing and security
- **Multer**: File upload handling

### Development Tools
- **Concurrently**: Run multiple npm scripts simultaneously
- **Nodemon**: Auto-restart server during development
- **ESLint**: Code linting and formatting

## 🌐 API Endpoints

### Base URLs
- **Backend API**: `http://localhost:5000/api`
- **Frontend App**: `http://localhost:3000`

### Key API Routes
- **Auth**: `/api/auth` - User authentication
- **Users**: `/api/users` - User management
- **Facilities**: `/api/facilities` - Venue management
- **Bookings**: `/api/bookings` - Booking operations
- **Reviews**: `/api/reviews` - Review system

## 🏟️ Supported Sports
- **Badminton** - Indoor courts with professional equipment
- **Tennis** - Both indoor and outdoor courts
- **Basketball** - Full and half courts available
- **Football** - 5-a-side and 11-a-side pitches
- **Cricket** - Practice nets and full grounds
- **Volleyball** - Indoor and beach volleyball courts
- **Table Tennis** - Professional tables with equipment
- **Squash** - Individual courts with viewing areas

## 🎨 Recent Updates

### User Dashboard Redesign
- **Personalized Welcome**: Dynamic greeting based on time of day with user's name
- **Activity Statistics**: Visual cards showing bookings, completed games, and spending
- **Quick Actions**: One-click access to booking, profile, and review features
- **Recent Bookings**: Timeline view of past and upcoming reservations with status indicators
- **Favorite Venues**: Quick access to most-visited sports facilities
- **Smart Notifications**: Upcoming game reminders and booking alerts
- **Responsive Design**: Optimized for all screen sizes with mobile-first approach

### Venue Details Page Redesign
- **Wireframe-Based Design**: Complete redesign matching provided UI wireframe
- **Image Gallery**: Interactive photo gallery with navigation controls
- **Sports & Amenities**: Visual display of available sports and facilities
- **Review System**: Enhanced user reviews with ratings and comments
- **Sidebar Layout**: Booking card, operating hours, and contact information
- **Responsive Design**: Mobile-friendly layout with optimized styling

### Authentication System Enhancement
- **Modern Signup Page**: Country code selection with flag indicators and phone validation
- **Real-time Validation**: Instant feedback for form fields with success/error states
- **Enhanced UX**: Professional styling matching login page design
- **Account Type Selection**: Visual cards for user role selection

## 🚀 Getting Started Guide

### For Users
1. Visit `http://localhost:3000`
2. Register a new account or login with demo credentials
3. Browse available venues in the "Venues" section
4. Click on any venue to view detailed information
5. Select your preferred time slot and book a court
6. Manage your bookings from the "My Bookings" page

### For Facility Owners
1. Register as a facility owner
2. Add your sports facility with detailed information
3. Configure courts, pricing, and availability
4. Monitor bookings and earnings from your dashboard
5. Respond to user reviews and feedback

### For Admins
1. Login with admin credentials
2. Review and approve pending facility registrations
3. Monitor platform activity and user engagement
4. Generate reports and analytics

## 🔧 Development Commands

```bash
# Install all dependencies
npm run install-all

# Start both frontend and backend
npm run dev

# Start only frontend (from root)
npm run client

# Start only backend (from root)  
npm run server

# Build for production
cd client && npm run build

# Run tests
npm test
```

## 🐛 Troubleshooting

### Common Issues

**Port Already in Use:**
```bash
# Kill process on port 3000 or 5000
npx kill-port 3000
npx kill-port 5000
```

**Module Not Found:**
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

**Database Connection Issues:**
- Ensure MongoDB is running
- Check your `.env` file configuration
- Verify MongoDB connection string

**Build Issues:**
```bash
# Clear cache and rebuild
npm run build -- --reset-cache
```

## 📈 Future Enhancements
- Real-time chat support
- Payment integration
- Mobile app development
- Advanced analytics dashboard
- Social features and community building
- Multi-language support

## 🤝 Contributing
1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License
This project is licensed under the MIT License - see the LICENSE file for details.
