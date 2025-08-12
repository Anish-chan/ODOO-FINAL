# QuickCourt - Local Sports Booking Platform

## Quick Start

### Install dependencies
```bash
npm run install-all
```

### Run the application
```bash
npm run dev
```

This will start both the backend server (port 5000) and frontend client (port 3000).

## Project Overview

QuickCourt is a full-stack web application designed to connect sports enthusiasts with local sports facilities for booking and fostering community engagement.

### Demo Accounts
- **User**: user1@demo.com / 123456
- **Facility Owner**: owner1@demo.com / 123456
- **Admin**: admin1@demo.com / 123456

## Project Structure

```
├── client/          # React frontend
├── server/          # Express backend
├── package.json     # Root package.json for scripts
└── README.md        # This file
```

## Core Features

### User Role
- Browse and search sports venues
- Book courts and time slots
- Manage bookings
- Leave reviews

### Facility Owner Role
- Dashboard with booking analytics
- Manage facilities and courts
- View bookings and earnings
- Set availability and pricing

### Admin Role
- Approve/reject facility registrations
- User management
- Platform analytics
- Reports and moderation

## Tech Stack
- **Frontend**: React, CSS3, Axios, React Router
- **Backend**: Node.js, Express.js, JWT Authentication
- **Database**: MongoDB with Mongoose
- **Development**: Concurrently for running both servers

## API Endpoints
- Base URL: `http://localhost:5000/api`
- Frontend: `http://localhost:3000`

## Sports Supported
- Badminton
- Tennis
- Basketball
- Football
- Cricket
- Volleyball
