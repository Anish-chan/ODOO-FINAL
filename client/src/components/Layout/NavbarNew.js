import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/venues?search=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    setShowDropdown(false);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Brand Logo */}
        <Link to="/" className="navbar-brand">
          QUICKCOURT
        </Link>

        {/* Search Bar */}
        <form className="navbar-search" onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="🔍 Search venues, sports..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </form>

        {/* Navigation Links */}
        <ul className="navbar-nav">
          {user ? (
            <>
              <li>
                <Link to="/venues" className="nav-link">
                  📍 Book
                </Link>
              </li>
              
              {user.role === 'user' && (
                <li>
                  <Link to="/my-bookings" className="nav-link">
                    My Bookings
                  </Link>
                </li>
              )}
              
              {user.role === 'facility_owner' && (
                <li>
                  <Link to="/my-facilities" className="nav-link">
                    My Facilities
                  </Link>
                </li>
              )}
              
              {user.role === 'admin' && (
                <li>
                  <Link to="/admin/facilities" className="nav-link">
                    Admin Panel
                  </Link>
                </li>
              )}
              
              {/* User Dropdown */}
              <li className="dropdown">
                <button 
                  className="dropdown-toggle nav-link"
                  onClick={() => setShowDropdown(!showDropdown)}
                >
                  👤 {user.name} ⌄
                </button>
                {showDropdown && (
                  <div className="dropdown-menu">
                    <Link 
                      to="/profile" 
                      className="dropdown-item"
                      onClick={() => setShowDropdown(false)}
                    >
                      Profile
                    </Link>
                    <button 
                      className="dropdown-item"
                      onClick={handleLogout}
                    >
                      Logout
                    </button>
                  </div>
                )}
              </li>
            </>
          ) : (
            <>
              <li>
                <Link to="/venues" className="nav-link">
                  📍 Book
                </Link>
              </li>
              <li>
                <Link to="/login" className="nav-link login-btn">
                  Login / Sign Up
                </Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
