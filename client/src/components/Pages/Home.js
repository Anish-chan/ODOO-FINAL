import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axiosConfig';

const Home = () => {
  const [searchLocation, setSearchLocation] = useState('');
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchApprovedVenues();
  }, []);

  const fetchApprovedVenues = async () => {
    setLoading(true);
    try {
      const response = await api.get('/facilities?limit=4');
      if (response.data && response.data.facilities) {
        setVenues(response.data.facilities);
      } else if (response.data) {
        setVenues(response.data.slice(0, 4));
      }
    } catch (error) {
      console.error('Error fetching approved venues:', error);
      // Keep empty array if error
      setVenues([]);
    } finally {
      setLoading(false);
    }
  };

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
            {loading ? (
              /* Loading skeleton */
              [1, 2, 3, 4].map((index) => (
                <div key={index} className="venue-card-simple">
                  <div className="venue-image-simple loading-skeleton">Loading...</div>
                  <div className="venue-content-simple">
                    <div className="loading-line"></div>
                    <div className="loading-line short"></div>
                    <div className="loading-line"></div>
                  </div>
                </div>
              ))
            ) : venues.length > 0 ? (
              /* Actual venue data */
              venues.map((venue) => (
                <Link key={venue._id} to={`/facility/${venue._id}`} className="venue-card-simple">
                  <div className="venue-image-simple">
                    {venue.photos && venue.photos.length > 0 ? (
                      <img 
                        src={venue.photos[0].url} 
                        alt={venue.name}
                        className="venue-img-simple"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }}
                      />
                    ) : null}
                    <div className="image-fallback" style={venue.photos && venue.photos.length > 0 ? {display: 'none'} : {}}>
                      Image
                    </div>
                  </div>
                  <div className="venue-content-simple">
                    <div className="venue-rating">
                      ⭐ {venue.rating?.average?.toFixed(1) || '4.5'} ({venue.rating?.count || '0'})
                    </div>
                    <div className="venue-location-simple">
                      📍 {venue.address?.city || 'City'}, {venue.address?.state || 'State'}
                    </div>
                    <div className="venue-tags-simple">
                      {venue.sportsSupported?.slice(0, 2).map((sport, index) => (
                        <span key={index} className="venue-tag">{sport}</span>
                      )) || [
                        <span key="1" className="venue-tag">Badminton</span>,
                        <span key="2" className="venue-tag">Cricket</span>
                      ]}
                    </div>
                    <div className="venue-facilities">
                      <span>🏃 {venue.courts > 0 ? `${venue.courts} Courts` : 'Top Rated'}</span>
                      <span>💰 {venue.startingPrice ? `₹${venue.startingPrice}/hr` : 'Affordable'}</span>
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              /* No venues fallback */
              [1, 2, 3, 4].map((index) => (
                <div key={index} className="venue-card-simple">
                  <div className="venue-image-simple">Image</div>
                  <div className="venue-content-simple">
                    <div className="venue-rating">⭐ 4.5 (6)</div>
                    <div className="venue-location-simple">📍 Vejalpur, Ahmedabad</div>
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
              ))
            )}
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
