import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
    setMobileMenuOpen(false);
  };

  return (
    <nav className="navbar bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="nav-container">
        {/* Brand Logo */}
        <Link to="/" className="nav-brand">
          <div className="brand-icon">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <span className="brand-text">QuickCourt</span>
        </Link>

        {/* Search Bar */}
        <form className="search-form hidden md:flex" onSubmit={handleSearch}>
          <div className="search-input-wrapper">
            <svg className="search-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search venues, sports, locations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
          </div>
        </form>

        {/* Desktop Navigation Links */}
        <div className="nav-links hidden lg:flex">
          <Link to="/venues" className="nav-link">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Find Venues
          </Link>
          
          {user ? (
            <>
              <Link to="/dashboard" className="nav-link">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5a2 2 0 012-2h4a2 2 0 012 2v2H8V5z" />
                </svg>
                Dashboard
              </Link>
              
              {/* User Dropdown */}
              <div className="user-dropdown-wrapper relative">
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="user-avatar-btn"
                >
                  <div className="user-avatar">
                    {user.name?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <span className="user-name">{user.name || 'User'}</span>
                  <svg className={`dropdown-arrow ${showDropdown ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                
                {showDropdown && (
                  <div className="user-dropdown compact">
                    <div className="dropdown-menu-compact">
                      <div className="dropdown-user-info">
                        <span className="dropdown-user-name">{user.name || 'User'}</span>
                        <span className={`dropdown-role-badge role-${user.role}`}>
                          {user.role}
                        </span>
                      </div>
                      <div className="dropdown-divider-thin"></div>
                      <Link to="/profile" className="dropdown-item-compact" onClick={() => setShowDropdown(false)}>
                        Profile
                      </Link>
                      <Link to="/bookings" className="dropdown-item-compact" onClick={() => setShowDropdown(false)}>
                        Bookings
                      </Link>
                      <button onClick={handleLogout} className="dropdown-item-compact logout-compact">
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="auth-buttons">
              <Link to="/login" className="btn btn-ghost btn-sm">
                Sign In
              </Link>
              <Link to="/register" className="btn btn-primary btn-sm">
                Get Started
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="mobile-menu-btn lg:hidden"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {mobileMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="mobile-menu lg:hidden">
          <div className="mobile-menu-content">
            {/* Mobile Search */}
            <form className="mobile-search" onSubmit={handleSearch}>
              <div className="search-input-wrapper">
                <svg className="search-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Search venues..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="search-input"
                />
              </div>
            </form>

            <div className="mobile-nav-links">
              <Link to="/venues" className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>
                Find Venues
              </Link>
              
              {user ? (
                <>
                  <Link to="/dashboard" className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>
                    Dashboard
                  </Link>
                  <Link to="/profile" className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>
                    Profile
                  </Link>
                  <Link to="/bookings" className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>
                    My Bookings
                  </Link>
                  <button onClick={handleLogout} className="mobile-nav-link logout-mobile">
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>
                    Sign In
                  </Link>
                  <Link to="/register" className="mobile-nav-link primary" onClick={() => setMobileMenuOpen(false)}>
                    Get Started
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
