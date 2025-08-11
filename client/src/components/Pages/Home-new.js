import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axiosConfig';

const Home = () => {
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchLocation, setSearchLocation] = useState('');

  // Key features with modern descriptions
  const keyFeatures = [
    {
      icon: '🔍',
      title: 'Smart Search & Filter',
      description: 'Find the perfect venue with advanced filters for location, sport type, price range, and amenities.'
    },
    {
      icon: '⚡',
      title: 'Instant Booking',
      description: 'Book courts in real-time with instant confirmation and flexible scheduling options.'
    },
    {
      icon: '💳',
      title: 'Secure Payments',
      description: 'Multiple payment options with bank-grade security and instant transaction processing.'
    },
    {
      icon: '📱',
      title: 'Mobile Optimized',
      description: 'Seamless experience across all devices with our responsive, mobile-first design.'
    },
    {
      icon: '⭐',
      title: 'Verified Reviews',
      description: 'Make informed decisions with authentic reviews and ratings from real customers.'
    },
    {
      icon: '🎯',
      title: 'Smart Recommendations',
      description: 'Get personalized venue suggestions based on your preferences and booking history.'
    }
  ];

  // Enhanced sports data
  const popularSports = [
    {
      name: 'Badminton',
      icon: '🏸',
      venues: 45,
      description: 'Indoor courts with professional lighting',
      gradient: 'from-blue-500 to-cyan-500'
    },
    {
      name: 'Tennis',
      icon: '🎾',
      venues: 32,
      description: 'Clay and hard courts available',
      gradient: 'from-green-500 to-teal-500'
    },
    {
      name: 'Football',
      icon: '⚽',
      venues: 28,
      description: 'Full and half-pitch options',
      gradient: 'from-orange-500 to-red-500'
    },
    {
      name: 'Basketball',
      icon: '🏀',
      venues: 25,
      description: 'Indoor and outdoor courts',
      gradient: 'from-purple-500 to-pink-500'
    },
    {
      name: 'Cricket',
      icon: '🏏',
      venues: 18,
      description: 'Practice nets and full grounds',
      gradient: 'from-yellow-500 to-orange-500'
    },
    {
      name: 'Swimming',
      icon: '🏊',
      venues: 15,
      description: 'Olympic and training pools',
      gradient: 'from-cyan-500 to-blue-500'
    }
  ];

  useEffect(() => {
    fetchFeaturedVenues();
  }, []);

  const fetchFeaturedVenues = async () => {
    setLoading(true);
    try {
      const response = await api.get('/venues?limit=6');
      if (response.data) {
        setVenues(response.data.slice(0, 6));
      }
    } catch (error) {
      console.error('Error fetching venues:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="hero relative overflow-hidden">
        <div className="container relative z-10">
          <div className="hero-content">
            <h1 className="hero-title mb-6">
              FIND PLAYERS & VENUES
              <span className="block">NEARBY</span>
            </h1>
            <p className="hero-subtitle mb-8">
              Seamlessly explore sports venues and play with sports enthusiasts just like you!
            </p>
            
            {/* Location Search Box */}
            <div className="location-search-container mb-8">
              <div className="location-search-box">
                <div className="location-icon">📍</div>
                <input
                  type="text"
                  placeholder="Ahmedabad"
                  value={searchLocation}
                  onChange={(e) => setSearchLocation(e.target.value)}
                  className="location-input"
                />
                <button className="search-btn">
                  🔍
                </button>
              </div>
            </div>
            
            <div className="hero-actions mb-12">
              <Link to="/venues" className="btn btn-primary btn-xl">
                <span>Explore Venues</span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
              <Link to="/register" className="btn btn-outline-white btn-xl">
                Get Started Free
              </Link>
            </div>
          </div>
        </div>
        
        {/* Background Elements */}
        <div className="hero-bg-shapes">
          <div className="shape shape-1"></div>
          <div className="shape shape-2"></div>
          <div className="shape shape-3"></div>
        </div>
      </section>

      {/* Action Buttons Section */}
      <section className="py-12 bg-white">
        <div className="container">
          <div className="action-buttons-container">
            <Link to="/venues" className="action-btn book-venue-btn">
              <span className="action-icon">📋</span>
              <span>Book Venues</span>
            </Link>
            <Link to="/venues" className="action-btn see-all-btn">
              <span>See all venues {'>'}	</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Key Features */}
      <section className="py-20 bg-white">
        <div className="container">
          <div className="section-header">
            <span className="section-tag">Features</span>
            <h2 className="section-title">Why Choose QuickCourt?</h2>
            <p className="section-subtitle">
              Everything you need to find, book, and enjoy your favorite sports venues
            </p>
          </div>
          
          <div className="features-grid">
            {keyFeatures.map((feature, index) => (
              <div key={index} className="feature-card">
                <div className="feature-icon-wrapper">
                  <span className="feature-icon">{feature.icon}</span>
                </div>
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-description">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Venues Slider */}
      {venues.length > 0 && (
        <section className="py-20 bg-white">
          <div className="container">
            <div className="section-header">
              <span className="section-tag">Venues</span>
              <h2 className="section-title">Top Venues</h2>
              <p className="section-subtitle">
                Hand-picked premium venues with excellent facilities and reviews
              </p>
            </div>
            
            {loading ? (
              <div className="loading-grid">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="venue-skeleton"></div>
                ))}
              </div>
            ) : (
              <div className="venues-slider-container">
                <div className="venues-slider">
                  {venues.map(venue => (
                    <div key={venue._id} className="venue-slide">
                      <div className="venue-card">
                        <div className="venue-image">
                          <img 
                            src={venue.images?.[0] || '/placeholder-venue.jpg'} 
                            alt={venue.name}
                            className="venue-img"
                          />
                          <div className="venue-badge">
                            ⭐ {venue.rating?.average?.toFixed(1) || '4.5'}
                          </div>
                        </div>
                        <div className="venue-content">
                          <h3 className="venue-title">{venue.name}</h3>
                          <p className="venue-location">
                            📍 {venue.address?.city || 'Ahmedabad'}
                          </p>
                          <div className="venue-sports">
                            {venue.sportsSupported?.slice(0, 2).map(sport => (
                              <span key={sport} className="venue-sport-tag">
                                {sport}
                              </span>
                            ))}
                          </div>
                          <div className="venue-footer">
                            <div className="venue-price">
                              From ₹{venue.startingPrice || 200}/hour
                            </div>
                            <Link to={`/venue/${venue._id}`} className="btn btn-primary btn-sm">
                              Book Now
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="slider-navigation">
                  <button className="slider-btn prev-btn">‹</button>
                  <button className="slider-btn next-btn">›</button>
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Popular Sports Slider */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="container">
          <div className="section-header">
            <span className="section-tag">Sports</span>
            <h2 className="section-title">Popular Sports</h2>
          </div>
          
          <div className="sports-slider-container">
            <div className="sports-slider">
              {popularSports.map((sport, index) => (
                <div key={index} className="sport-slide">
                  <div className="sport-card-slider">
                    <div className="sport-image">
                      <img 
                        src={`/images/${sport.name.toLowerCase()}.jpg`} 
                        alt={sport.name}
                        className="sport-img"
                        onError={(e) => {
                          e.target.src = '/placeholder-sport.jpg';
                        }}
                      />
                      <div className="sport-overlay">
                        <span className="sport-icon-large">{sport.icon}</span>
                      </div>
                    </div>
                    <div className="sport-info">
                      <h3 className="sport-name">{sport.name}</h3>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="slider-navigation">
              <button className="slider-btn prev-btn">‹</button>
              <button className="slider-btn next-btn">›</button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Start Playing?</h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of sports enthusiasts who have already found their perfect venue
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register" className="btn btn-secondary btn-xl">
              Create Account
            </Link>
            <Link to="/venues" className="btn btn-outline btn-xl border-white text-white hover:bg-white hover:text-blue-600">
              Browse Venues
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
