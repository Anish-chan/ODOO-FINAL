import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Layout/Navbar';
import Home from './components/Pages/Home';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import Dashboard from './components/Pages/Dashboard';
import Venues from './components/Pages/Venues';
import VenueDetails from './components/Pages/VenueDetails';
import BookCourt from './components/Pages/BookCourt';
import MyBookings from './components/Pages/MyBookings';
import MyFacilities from './components/Pages/MyFacilities';
import AdminFacilities from './components/Pages/AdminFacilities';
import PrivateRoute from './components/Routing/PrivateRoute';
import RoleRoute from './components/Routing/RoleRoute';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Navbar />
          <div className="container">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/venues" element={<Venues />} />
              <Route path="/venue/:id" element={<VenueDetails />} />
              
              {/* Protected Routes */}
              <Route 
                path="/dashboard" 
                element={
                  <PrivateRoute>
                    <Dashboard />
                  </PrivateRoute>
                } 
              />
              <Route 
                path="/book-court/:courtId" 
                element={
                  <PrivateRoute>
                    <BookCourt />
                  </PrivateRoute>
                } 
              />
              <Route 
                path="/my-bookings" 
                element={
                  <RoleRoute allowedRoles={['user']}>
                    <MyBookings />
                  </RoleRoute>
                } 
              />
              
              {/* Facility Owner Routes */}
              <Route 
                path="/my-facilities" 
                element={
                  <RoleRoute allowedRoles={['facility_owner']}>
                    <MyFacilities />
                  </RoleRoute>
                } 
              />
              
              {/* Admin Routes */}
              <Route 
                path="/admin/facilities" 
                element={
                  <RoleRoute allowedRoles={['admin']}>
                    <AdminFacilities />
                  </RoleRoute>
                } 
              />
            </Routes>
          </div>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
