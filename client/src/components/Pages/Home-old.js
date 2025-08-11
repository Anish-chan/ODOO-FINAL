import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import API from '../../api/axiosConfig';

const Home = () => {
  const [popularVenues, setPopularVenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchLocation, setSearchLocation] = useState('Ahmedabad');
  const [stats, setStats] = useState({
    totalVenues: 50,
    totalBookings: 1200,
    activeSports: 8,
    happyCustomers: 850
  });
  const { user } = useAuth();

  // Sports icons for display
  const sportsIcons = {
    badminton: '🏸',
    football: '⚽',
    cricket: '🏏',
    tennis: '🎾',
    basketball: '🏀',
    swimming: '🏊‍♂️',
    'table tennis': '🏓',
    volleyball: '🏐'
  };

  // Enhanced sports data with modern styling
  const popularSports = [
    { name: 'Badminton', color: '#FF6B6B', icon: '🏸', venues: 15 },
    { name: 'Football', color: '#4ECDC4', icon: '⚽', venues: 12 },
    { name: 'Cricket', color: '#45B7D1', icon: '🏏', venues: 8 },
    { name: 'Swimming', color: '#96CEB4', icon: '🏊‍♂️', venues: 6 },
    { name: 'Tennis', color: '#FECA57', icon: '🎾', venues: 10 },
    { name: 'Basketball', color: '#FF9FF3', icon: '🏀', venues: 7 }
  ];

  // Key features for showcase
  const keyFeatures = [
    {
      icon: '🎯',
      title: 'Smart Venue Discovery',
      description: 'Find the perfect sports venue with our intelligent search and filtering system',
      color: '#FF4500'
    },
    {
      icon: '⚡',
      title: 'Instant Booking',
      description: 'Book your favorite courts in seconds with real-time availability',
      color: '#00CED1'
    },
    {
      icon: '🏆',
      title: 'Premium Quality',
      description: 'All venues are verified and maintain high standards for the best experience',
      color: '#27AE60'
    },
    {
      icon: '📱',
      title: 'Mobile Optimized',
      description: 'Seamless experience across all devices - book on the go!',
      color: '#9B59B6'
    }
  ];

  useEffect(() => {
    fetchPopularVenues();
  }, []);

  const fetchPopularVenues = async () => {
    try {
      const response = await API.get('/api/facilities');
      // Get first 4 approved venues for display
      const approvedVenues = response.data.filter(venue => venue.status === 'approved').slice(0, 4);
      setPopularVenues(approvedVenues);
    } catch (error) {
      console.error('Error fetching venues:', error);
      // Set demo data if API fails
      setPopularVenues([
        {
          _id: '1',
          name: 'SBG Badminton',
          sportsSupported: ['Badminton'],
          address: { city: 'Ahmedabad' },
          rating: { average: 4.5, count: 50 },
          priceRange: { min: 200, max: 500 }
        },
        {
          _id: '2',
          name: 'SBG Basketball',
          sportsSupported: ['Basketball'],
          address: { city: 'Ahmedabad' },
          rating: { average: 4.5, count: 0 },
          priceRange: { min: 300, max: 600 }
        },
        {
          _id: '3',
          name: 'SBG Badminton',
          sportsSupported: ['Badminton'],
          address: { city: 'Ahmedabad' },
          rating: { average: 4.3, count: 8 },
          priceRange: { min: 250, max: 450 }
        },
        {
          _id: '4',
          name: 'SBG Badminton',
          sportsSupported: ['Badminton'],
          address: { city: 'Ahmedabad' },
          rating: { average: 4.4, count: 6 },
          priceRange: { min: 220, max: 480 }
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchLocation.trim()) {
      // Redirect to venues page with search query
      window.location.href = `/venues?search=${encodeURIComponent(searchLocation)}`;
    }
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<span key={i}>★</span>);
    }
    
    if (hasHalfStar) {
      stars.push(<span key="half">☆</span>);
    }
    
    // Fill remaining with empty stars up to 5
    const remainingStars = 5 - Math.ceil(rating);
    for (let i = 0; i < remainingStars; i++) {
      stars.push(<span key={`empty-${i}`} style={{ color: '#ddd' }}>★</span>);
    }
    
    return stars;
  };

  return (
    <div className="home-page">
      {/* Enhanced Hero Section */}
      <section className="hero-section">
        <div className="hero-background"></div>
        <div className="container">
          <div className="hero-content">
            <div className="hero-badge">
              <span className="badge-icon">🚀</span>
              <span>India's #1 Sports Booking Platform</span>
            </div>
            
            <h1 className="hero-title">
              Your Game, <span className="text-gradient">Your Court</span>
            </h1>
            <p className="hero-subtitle">
              Connect with sports enthusiasts, discover premium venues, and book your perfect game in seconds. 
              Join thousands of players already using QuickCourt!
            </p>
            
            <div className="hero-stats">
              <div className="stat-item">
                <div className="stat-number">{stats.totalVenues}+</div>
                <div className="stat-label">Premium Venues</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">{stats.totalBookings}+</div>
                <div className="stat-label">Successful Bookings</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">{stats.activeSports}+</div>
                <div className="stat-label">Sports Available</div>
              </div>
            </div>
            
            <div className="hero-search-container">
              <h3 className="search-title">Find Your Perfect Venue</h3>
              <form className="hero-search-form" onSubmit={handleSearch}>
                <div className="search-input-wrapper">
                  <span className="search-icon">📍</span>
                  <input
                    type="text"
                    className="hero-search-input"
                    placeholder="Enter city or area..."
                    value={searchLocation}
                    onChange={(e) => setSearchLocation(e.target.value)}
                  />
                </div>
                <button type="submit" className="hero-search-btn">
                  <span>Search Venues</span>
                  <span className="btn-icon">→</span>
                </button>
              </form>
            </div>

            {!user && (
              <div className="hero-cta">
                <Link to="/register" className="btn btn-primary btn-large">
                  <span>Start Playing Today</span>
                  <span className="btn-icon">🎯</span>
                </Link>
                <Link to="/login" className="btn btn-secondary btn-large">
                  <span>Sign In</span>
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Key Features Section */}
      <section className="features-section">
        <div className="container">
          <div className="section-header">
            <h2>Why Choose QuickCourt?</h2>
            <p>Experience the future of sports venue booking</p>
          </div>
          
          <div className="features-grid">
            {keyFeatures.map((feature, index) => (
              <div key={index} className="feature-card">
                <div className="feature-icon" style={{ backgroundColor: `${feature.color}20`, color: feature.color }}>
                  {feature.icon}
                </div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Book Venues Section */}
      <section className="section">
        <div className="section-header">
          <h2 className="section-title">Book Venues</h2>
          <Link to="/venues" className="see-all-link">
            See all venues →
          </Link>
        </div>

        {loading ? (
          <div className="loading">Loading venues...</div>
        ) : (
          <>
            <div className="venues-grid">
              {popularVenues.map((venue) => (
                <Link 
                  key={venue._id} 
                  to={`/venue/${venue._id}`} 
                  className="venue-card"
                >
                  <div className="venue-image">
                    <span>Image</span>
                  </div>
                  <div className="venue-content">
                    <div className="venue-header">
                      <div>
                        <h3 className="venue-name">{venue.name}</h3>
                        <div className="venue-rating">
                          <span className="rating-stars">
                            {renderStars(venue.rating?.average || 0)}
                          </span>
                          <span>
                            {venue.rating?.average || 0} ({venue.rating?.count || 0})
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="venue-location">
                      📍 {venue.address?.city || 'Ahmedabad'}
                    </div>
                    
                    <div className="venue-sports">
                      {venue.sportsSupported?.map((sport, index) => (
                        <span key={index} className="sport-tag">
                          {sport}
                        </span>
                      )) || <span className="sport-tag">General</span>}
                    </div>
                    
                    <div className="venue-price">
                      ₹{venue.priceRange?.min || 200} - ₹{venue.priceRange?.max || 500}
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* Navigation Controls */}
            <div className="nav-controls">
              <button className="nav-btn">‹</button>
              <button className="nav-btn">›</button>
            </div>
          </>
        )}
      </section>

      {/* Popular Sports Section */}
      <section className="section">
        <div className="section-header">
          <h2 className="section-title">Popular Sports</h2>
        </div>

        <div className="sports-container">
          {popularSports.map((sport, index) => (
            <Link
              key={index}
              to={`/venues?sport=${sport.name.toLowerCase()}`}
              className="sport-category"
            >
              <div 
                className="sport-category-overlay"
                style={{ 
                  background: `linear-gradient(135deg, ${sport.color}dd, ${sport.color}aa)`,
                }}
              >
                {sport.name}
              </div>
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

      {/* Newsletter Section */}
      <section className="newsletter-section">
        <div className="newsletter-content">
          <h2>Stay Updated</h2>
          <p>Get the latest updates on new venues, special offers, and sports events</p>
          <div className="newsletter-form">
            <input 
              type="email" 
              placeholder="Enter your email address"
              className="newsletter-input"
            />
            <button className="btn btn-primary">Subscribe</button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="home-footer">
        <div className="footer-content">
          <div className="footer-section">
            <h3>QuickCourt</h3>
            <p>Your premier destination for sports venue booking. Find, book, and play at the best facilities in your area.</p>
            <div className="social-links">
              <a href="#" aria-label="Facebook">📘</a>
              <a href="#" aria-label="Twitter">🐦</a>
              <a href="#" aria-label="Instagram">📷</a>
              <a href="#" aria-label="LinkedIn">💼</a>
            </div>
          </div>
          
          <div className="footer-section">
            <h4>Quick Links</h4>
            <ul>
              <li><Link to="/venues">Browse Venues</Link></li>
              <li><Link to="/register">Sign Up</Link></li>
              <li><Link to="/login">Sign In</Link></li>
              <li><Link to="/about">About Us</Link></li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h4>Sports</h4>
            <ul>
              <li><a href="#badminton">Badminton</a></li>
              <li><a href="#tennis">Tennis</a></li>
              <li><a href="#football">Football</a></li>
              <li><a href="#basketball">Basketball</a></li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h4>Support</h4>
            <ul>
              <li><a href="#help">Help Center</a></li>
              <li><a href="#contact">Contact Us</a></li>
              <li><a href="#privacy">Privacy Policy</a></li>
              <li><a href="#terms">Terms of Service</a></li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h4>Contact Info</h4>
            <div className="contact-info">
              <p>📍 123 Sports Avenue, City</p>
              <p>📞 +91 98765 43210</p>
              <p>✉️ info@quickcourt.com</p>
              <p>🕒 24/7 Support Available</p>
            </div>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>&copy; 2024 QuickCourt. All rights reserved. | Made with ❤️ for sports enthusiasts</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
