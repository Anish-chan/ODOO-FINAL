import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../../api/axiosConfig';

const Venues = () => {
  const [venues, setVenues] = useState([]);
  const [filters, setFilters] = useState({
    sport: '',
    search: ''
  });
  const [loading, setLoading] = useState(false);

  const sports = ['All Sports', 'Badminton', 'Tennis', 'Basketball', 'Football', 'Cricket'];

  useEffect(() => {
    fetchVenues();
  }, [filters]);

  const fetchVenues = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.sport && filters.sport !== 'All Sports') {
        params.append('sport', filters.sport.toLowerCase());
      }
      if (filters.search) params.append('search', filters.search);
      params.append('limit', 20);

      const response = await API.get(`/api/facilities?${params.toString()}`);
      setVenues(response.data.facilities || []);
    } catch (error) {
      console.error('Error fetching venues:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (field, value) => {
    setFilters({ ...filters, [field]: value });
  };

  return (
    <div className="venues-page">
      {/* Header */}
      <div className="venues-header">
        <h1 className="page-title">Sports Venues near you !</h1>
        <p className="page-subtitle">Discover and Book Nearby Venues</p>
      </div>

      {/* Main Content Layout */}
      <div className="venues-content">
        {/* Left Sidebar - Filters */}
        <div className="filters-sidebar">
          <div className="filters-header">
            <h3>Filters</h3>
            <button 
              className="clear-filters-btn"
              onClick={() => setFilters({ sport: '', search: '' })}
            >
              Clear All
            </button>
          </div>

          {/* Search */}
          <div className="filter-section">
            <label className="filter-label">Search Venues</label>
            <div className="search-box">
              <input
                type="text"
                placeholder="Search by venue name or location"
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="search-input"
              />
              <span className="search-icon">🔍</span>
            </div>
          </div>

          {/* Sport Type Filter */}
          <div className="filter-section">
            <label className="filter-label">Sport Type</label>
            <div className="sport-filters">
              {sports.map(sport => (
                <label key={sport} className="radio-option">
                  <input 
                    type="radio" 
                    name="sport"
                    value={sport}
                    checked={filters.sport === sport || (sport === 'All Sports' && !filters.sport)}
                    onChange={(e) => handleFilterChange('sport', sport === 'All Sports' ? '' : sport)}
                  />
                  <span className="radio-label">{sport}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Price Range Filter */}
          <div className="filter-section">
            <label className="filter-label">Price Range (per hour)</label>
            <div className="price-range">
              <input 
                type="number" 
                placeholder="Min ₹" 
                className="price-input" 
              />
              <span className="price-separator">-</span>
              <input 
                type="number" 
                placeholder="Max ₹" 
                className="price-input" 
              />
            </div>
          </div>

          {/* Venue Type Filter */}
          <div className="filter-section">
            <label className="filter-label">Venue Type</label>
            <div className="checkbox-group">
              <label className="checkbox-option">
                <input type="checkbox" />
                <span className="checkbox-label">Indoor</span>
              </label>
              <label className="checkbox-option">
                <input type="checkbox" />
                <span className="checkbox-label">Outdoor</span>
              </label>
            </div>
          </div>

          {/* Rating Filter */}
          <div className="filter-section">
            <label className="filter-label">Minimum Rating</label>
            <div className="rating-filters">
              {[5, 4, 3, 2, 1].map(rating => (
                <label key={rating} className="radio-option">
                  <input type="radio" name="rating" />
                  <span className="radio-label">
                    {'⭐'.repeat(rating)} & up
                  </span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Right Content - Venues Grid */}
        <div className="venues-main">
          <div className="venues-header-info">
            <h2 className="results-count">
              {venues.length} venues found
            </h2>
            <div className="sort-options">
              <select className="sort-select">
                <option>Sort by: Recommended</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
                <option>Rating: High to Low</option>
                <option>Distance</option>
              </select>
            </div>
          </div>

          {/* Loading State */}
          {loading ? (
            <div className="loading-section">
              <div className="loading-spinner"></div>
              <p className="loading-text">Finding the best venues for you...</p>
            </div>
          ) : (
            /* Venues Grid - 3 Cards Layout */
            <div className="venues-grid">
              {venues.length === 0 ? (
                <div className="no-venues">
                  <div className="no-venues-icon">🏟️</div>
                  <h3>No venues found</h3>
                  <p>Try adjusting your filters or search criteria</p>
                </div>
              ) : (
                venues.map(venue => (
                  <div key={venue._id} className="venue-card">
                    <div className="venue-image">
                      {venue.images && venue.images.length > 0 ? (
                        <img src={venue.images[0]} alt={venue.name} />
                      ) : (
                        <div className="image-placeholder">
                          <span className="image-icon">🏟️</span>
                        </div>
                      )}
                      <div className="venue-badges">
                        {venue.rating?.average >= 4.5 && (
                          <span className="badge badge-top">⭐ Top Rated</span>
                        )}
                        {venue.startingPrice <= 300 && (
                          <span className="badge badge-budget">💰 Budget</span>
                        )}
                      </div>
                    </div>
                    
                    <div className="venue-info">
                      <div className="venue-header">
                        <h3 className="venue-name">{venue.name || 'Sports Venue'}</h3>
                        <div className="venue-rating">
                          <span className="rating-stars">⭐</span>
                          <span className="rating-value">
                            {venue.rating?.average?.toFixed(1) || '4.5'}
                          </span>
                          <span className="rating-count">
                            ({venue.rating?.count || '6'})
                          </span>
                        </div>
                      </div>
                      
                      <div className="venue-location">
                        <span className="location-icon">📍</span>
                        <span className="location-text">
                          {venue.address?.area || 'Ahmedabad'}, {venue.address?.city || 'Gujarat'}
                        </span>
                      </div>
                      
                      <div className="venue-sports">
                        {venue.sportsSupported?.slice(0, 3).map((sport, index) => (
                          <span key={index} className="sport-tag">
                            {sport}
                          </span>
                        )) || <span className="sport-tag">Badminton</span>}
                      </div>
                      
                      <div className="venue-amenities">
                        <span className="amenity">🚗 Parking</span>
                        <span className="amenity">� Washroom</span>
                        <span className="amenity">💡 Lighting</span>
                      </div>
                      
                      <div className="venue-footer">
                        <div className="venue-price">
                          <span className="price-label">Starting from</span>
                          <span className="price-value">₹{venue.startingPrice || '250'}</span>
                          <span className="price-unit">per hour</span>
                        </div>
                        
                        <Link 
                          to={`/venue/${venue._id}`} 
                          className="book-btn"
                        >
                          View Details
                        </Link>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Venues;
