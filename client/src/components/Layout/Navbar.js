import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();

  const getRoleBasedLinks = () => {
    if (!user) return null;

    switch (user.role) {
      case 'user':
        return (
          <>
            <li><Link to="/venues">Browse Venues</Link></li>
            <li><Link to="/my-bookings">My Bookings</Link></li>
          </>
        );
      case 'facility_owner':
        return (
          <>
            <li><Link to="/dashboard">Owner Dashboard</Link></li>
            <li><Link to="/my-facilities">My Facilities</Link></li>
            <li><Link to="/bookings-overview">Bookings</Link></li>
          </>
        );
      case 'admin':
        return (
          <>
            <li><Link to="/dashboard">Admin Dashboard</Link></li>
            <li><Link to="/admin/facilities">Manage Facilities</Link></li>
            <li><Link to="/admin/users">Manage Users</Link></li>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-logo">
          🏸 QuickCourt
        </Link>
        <ul className="nav-links">
          <li><Link to="/">Home</Link></li>
          <li><Link to="/venues">Venues</Link></li>
          
          {user ? (
            <>
              {getRoleBasedLinks()}
              <li>
                <span style={{opacity: 0.8}}>
                  {user.name} ({user.role})
                </span>
              </li>
              <li>
                <button 
                  onClick={logout} 
                  className="btn btn-small"
                  style={{padding: '0.5rem 1rem', fontSize: '0.9rem'}}
                >
                  Logout
                </button>
              </li>
            </>
          ) : (
            <>
              <li><Link to="/login">Login</Link></li>
              <li><Link to="/register">Register</Link></li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
