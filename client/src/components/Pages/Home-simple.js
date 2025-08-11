import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  const [searchLocation, setSearchLocation] = useState('');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section - Simple Layout */}
      <section className="hero-simple">
        <div className="container">
          <div className="hero-simple-content">
            {/* Left side - Text content */}
            <div className="hero-text">
              <h1 className="hero-simple-title">
                FIND PLAYERS & VENUES<br />
                NEARBY
              </h1>
              <p className="hero-simple-subtitle">
                Seamlessly explore sports venues and play with<br />
                sports enthusiasts just like you!
              </p>
              
              {/* Location Search Box */}
              <div className="location-search-simple">
                <div className="location-icon">📍</div>
                <input
                  type="text"
                  placeholder="Ahmedabad"
                  value={searchLocation}
                  onChange={(e) => setSearchLocation(e.target.value)}
                  className="location-input-simple"
                />
              </div>
            </div>
            
            {/* Right side - Placeholder for image */}
            <div className="hero-image-placeholder">
              <div className="image-placeholder">IMAGE</div>
            </div>
          </div>
        </div>
      </section>

      {/* Action Buttons Section */}
      <section className="action-section">
        <div className="container">
          <div className="action-buttons-simple">
            <Link to="/venues" className="action-btn-simple primary">
              📋 Book Venues
            </Link>
            <Link to="/venues" className="action-btn-simple secondary">
              See all venues {'>'}
            </Link>
          </div>
        </div>
      </section>

      {/* Venues Section - Simple Cards */}
      <section className="venues-section-simple">
        <div className="container">
          <div className="venues-grid-simple">
            {/* Venue Cards - Wireframe Style */}
            {[1, 2, 3, 4].map((index) => (
              <div key={index} className="venue-card-simple">
                <div className="venue-image-simple">Image</div>
                <div className="venue-content-simple">
                  <div className="venue-rating">⭐ 4.5 (6)</div>
                  <div className="venue-location-simple">📍 Vejalpur,evt chr</div>
                  <div className="venue-tags-simple">
                    <span className="venue-tag">Badminton</span>
                    <span className="venue-tag">Box Cricket</span>
                  </div>
                  <div className="venue-facilities">
                    <span>🏃 Top Rated</span>
                    <span>🅿️ Parking</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Navigation arrows */}
          <div className="venues-navigation">
            <button className="nav-arrow">‹</button>
            <button className="nav-arrow">›</button>
          </div>
        </div>
      </section>

      {/* Popular Sports Section - Simple Grid */}
      <section className="sports-section-simple">
        <div className="container">
          <h2 className="section-title-simple">Popular Sports</h2>
          <div className="sports-grid-simple">
            {['Badminton', 'Football', 'Cricket', 'Archery', 'Tennis', 'Table Tennis'].map((sport, index) => (
              <div key={index} className="sport-card-simple">
                <div className="sport-image-simple">
                  <span className="sport-emoji">
                    {sport === 'Badminton' && '🏸'}
                    {sport === 'Football' && '⚽'}
                    {sport === 'Cricket' && '🏏'}
                    {sport === 'Archery' && '🏹'}
                    {sport === 'Tennis' && '🎾'}
                    {sport === 'Table Tennis' && '🏓'}
                  </span>
                </div>
                <div className="sport-name-simple">{sport}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
