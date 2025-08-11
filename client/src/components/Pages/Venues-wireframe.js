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
        <h1 className="page-title">Sports Venues Near You: Discover and Book Nearby Venues</h1>
      </div>

      {/* Search and Filters */}
      <div className="venues-filters">
        <div className="search-section">
          <div className="search-box">
            <label>Search by venue name</label>
            <input
              type="text"
              placeholder="Search for venue"
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              className="search-input"
            />
          </div>
        </div>

        <div className="filter-section">
          <div className="filter-group">
            <label>Filter by Sport Type</label>
            <select
              value={filters.sport}
              onChange={(e) => handleFilterChange('sport', e.target.value)}
              className="filter-select"
            >
              {sports.map(sport => (
                <option key={sport} value={sport}>{sport}</option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label>Price range (per hour)</label>
            <div className="price-inputs">
              <input type="number" placeholder="₹ 0.00" className="price-input" />
              <span>-</span>
              <input type="number" placeholder="₹ 5,000.00" className="price-input" />
            </div>
          </div>

          <div className="filter-group">
            <label>Choose Venue Type</label>
            <div className="venue-type-options">
              <label className="checkbox-option">
                <input type="checkbox" /> Indoor
              </label>
              <label className="checkbox-option">
                <input type="checkbox" /> Outdoor
              </label>
            </div>
          </div>

          <div className="filter-group">
            <label>Rating</label>
            <div className="rating-options">
              <label className="checkbox-option">
                <input type="checkbox" /> 5 stars & up
              </label>
              <label className="checkbox-option">
                <input type="checkbox" /> 4 stars & up
              </label>
              <label className="checkbox-option">
                <input type="checkbox" /> 3 stars & up
              </label>
            </div>
          </div>

          <button className="clear-filters-btn">Clear Filters</button>
        </div>
      </div>

      {/* Venues Grid */}
      {loading ? (
        <div className="loading-section">
          <div className="loading-text">Loading venues...</div>
        </div>
      ) : (
        <div className="venues-grid">
          {venues.length === 0 ? (
            <div className="no-venues">
              <p>No venues found matching your criteria.</p>
            </div>
          ) : (
            venues.map(venue => (
              <div key={venue._id} className="venue-card">
                <div className="venue-image">
                  <div className="image-placeholder">Image</div>
                </div>
                
                <div className="venue-info">
                  <div className="venue-location">
                    <span className="location-icon">📍</span>
                    <span>{venue.name || 'SBK Badminton'}</span>
                  </div>
                  
                  <div className="venue-name">
                    <span className="location-icon">📍</span>
                    <span>{venue.address?.area || 'Vastranachka Cir'}</span>
                  </div>
                  
                  <div className="venue-rating">
                    ⭐ {venue.rating?.average?.toFixed(1) || '4.5'} ({venue.rating?.count || '6'})
                  </div>
                  
                  <div className="venue-price">
                    ₹ {venue.startingPrice || '250'} per hour
                  </div>
                  
                  <div className="venue-amenities">
                    <span className="amenity-tag">✓ Badminton</span>
                    <span className="amenity-tag">🚗 Outdoor</span>
                    <span className="amenity-tag">🎯 Top Rated</span>
                    <span className="amenity-tag">💰 Budget</span>
                  </div>
                  
                  <Link 
                    to={`/venue/${venue._id}`} 
                    className="view-details-btn"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default Venues;
