import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';

const Home = () => {
  const { user } = useAuth();
  const [popularVenues, setPopularVenues] = useState([]);
  const [stats, setStats] = useState({ totalVenues: 0, totalBookings: 0 });

  useEffect(() => {
    fetchPopularVenues();
    fetchStats();
  }, []);

  const fetchPopularVenues = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/facilities?limit=3');
      setPopularVenues(response.data.facilities || []);
    } catch (error) {
      console.error('Error fetching venues:', error);
    }
  };

  const fetchStats = async () => {
    try {
      // This would be a real API call in production
      setStats({ totalVenues: 25, totalBookings: 1200 });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const sportsIcons = {
    badminton: '🏸',
    tennis: '🎾',
    basketball: '🏀',
    football: '⚽',
    cricket: '🏏',
    volleyball: '🏐'
  };

  return (
    <div>
      <section className="hero">
        <h1>Welcome to QuickCourt</h1>
        <p>Find and book local sports facilities in your area</p>
        <div className="hero-stats">
          <div>
            <strong>{stats.totalVenues}+</strong>
            <span>Sports Venues</span>
          </div>
          <div>
            <strong>{stats.totalBookings}+</strong>
            <span>Happy Bookings</span>
          </div>
        </div>
        
        {!user && (
          <div className="hero-actions">
            <Link to="/venues" className="btn btn-primary">
              Browse Venues
            </Link>
            <Link to="/register" className="btn btn-secondary">
              Join QuickCourt
            </Link>
          </div>
        )}
        
        {user && (
          <div className="hero-actions">
            <Link to="/venues" className="btn btn-primary">
              Book a Court
            </Link>
            <Link to="/my-bookings" className="btn btn-secondary">
              My Bookings
            </Link>
          </div>
        )}
      </section>

      <div className="container">
        {/* Quick Access to Sports */}
        <section className="sports-section">
          <h2>Popular Sports</h2>
          <div className="sports-grid">
            {Object.entries(sportsIcons).map(([sport, icon]) => (
              <Link 
                key={sport} 
                to={`/venues?sport=${sport}`} 
                className="sport-card"
              >
                <div className="sport-icon">{icon}</div>
                <h3>{sport.charAt(0).toUpperCase() + sport.slice(1)}</h3>
              </Link>
            ))}
          </div>
        </section>

        {/* Popular Venues */}
        {popularVenues.length > 0 && (
          <section className="popular-venues">
            <h2>Popular Venues</h2>
            <div className="venues-grid">
              {popularVenues.map((venue) => (
                <div key={venue._id} className="venue-card">
                  <div className="venue-image">
                    {venue.photos && venue.photos.length > 0 ? (
                      <img src={venue.photos[0].url} alt={venue.name} />
                    ) : (
                      <div className="venue-placeholder">📍</div>
                    )}
                  </div>
                  <div className="venue-info">
                    <h3>{venue.name}</h3>
                    <p className="venue-location">
                      {venue.address?.city || 'Location'}
                    </p>
                    <div className="venue-sports">
                      {venue.sportsSupported?.slice(0, 3).map(sport => (
                        <span key={sport} className="sport-tag">
                          {sportsIcons[sport]} {sport}
                        </span>
                      ))}
                    </div>
                    <div className="venue-footer">
                      <span className="venue-price">
                        From ₹{venue.startingPrice || 0}/hour
                      </span>
                      <div className="venue-rating">
                        ⭐ {venue.rating?.average?.toFixed(1) || 'New'}
                      </div>
                    </div>
                    <Link to={`/venue/${venue._id}`} className="btn btn-small">
                      View Details
                    </Link>
                  </div>
                </div>
              ))}
            </div>
            <div className="text-center">
              <Link to="/venues" className="btn btn-outline">
                View All Venues
              </Link>
            </div>
          </section>
        )}

        {/* How It Works */}
        <section className="how-it-works">
          <h2>How QuickCourt Works</h2>
          <div className="steps-grid">
            <div className="step">
              <div className="step-number">1</div>
              <h3>Browse Venues</h3>
              <p>Search and filter sports facilities by location, sport type, and price</p>
            </div>
            <div className="step">
              <div className="step-number">2</div>
              <h3>Select Time Slot</h3>
              <p>Choose your preferred date and time from available slots</p>
            </div>
            <div className="step">
              <div className="step-number">3</div>
              <h3>Book & Play</h3>
              <p>Complete your booking and enjoy your game at the venue</p>
            </div>
          </div>
        </section>

        {/* Demo Accounts Info */}
        <section className="demo-info">
          <h2>Demo Accounts</h2>
          <div className="demo-accounts">
            <div className="demo-card">
              <h3>👤 Regular User</h3>
              <p>Email: user1@demo.com</p>
              <p>Password: 123456</p>
              <small>Browse and book sports venues</small>
            </div>
            <div className="demo-card">
              <h3>🏢 Facility Owner</h3>
              <p>Email: owner1@demo.com</p>
              <p>Password: 123456</p>
              <small>Manage venues and bookings</small>
            </div>
            <div className="demo-card">
              <h3>👑 Admin</h3>
              <p>Email: admin1@demo.com</p>
              <p>Password: 123456</p>
              <small>Platform administration</small>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Home;
