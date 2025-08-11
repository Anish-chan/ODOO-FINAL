import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../../api/axiosConfig';

const Venues = () => {
  const [venues, setVenues] = useState([]);
  const [filters, setFilters] = useState({
    sport: '',
    search: '',
    minPrice: '',
    maxPrice: ''
  });
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    total: 0
  });
  const [loading, setLoading] = useState(false);

  const sports = ['badminton', 'tennis', 'basketball', 'football', 'cricket', 'volleyball'];
  const sportsIcons = {
    badminton: '🏸',
    tennis: '🎾',
    basketball: '🏀',
    football: '⚽',
    cricket: '🏏',
    volleyball: '🏐'
  };

  useEffect(() => {
    fetchVenues();
  }, [filters, pagination.currentPage]);

  const fetchVenues = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.sport) params.append('sport', filters.sport);
      if (filters.search) params.append('search', filters.search);
      if (filters.minPrice) params.append('minPrice', filters.minPrice);
      if (filters.maxPrice) params.append('maxPrice', filters.maxPrice);
      params.append('page', pagination.currentPage);
      params.append('limit', 9);

      const response = await API.get(`/api/facilities?${params.toString()}`);
      setVenues(response.data.facilities || []);
      setPagination({
        currentPage: response.data.currentPage,
        totalPages: response.data.totalPages,
        total: response.data.total
      });
    } catch (error) {
      console.error('Error fetching venues:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPagination(prev => ({ ...prev, currentPage: 1 }));
  };

  const handlePageChange = (page) => {
    setPagination(prev => ({ ...prev, currentPage: page }));
  };

  const clearFilters = () => {
    setFilters({
      sport: '',
      search: '',
      minPrice: '',
      maxPrice: ''
    });
  };

  return (
    <div>
      <div className="venues-header">
        <h1>Sports Venues</h1>
        <p>Find and book the perfect sports facility for your game</p>
      </div>

      {/* Filters */}
      <div className="filters">
        <div className="filter-group">
          <label>Search</label>
          <input
            type="text"
            placeholder="Search venues or location..."
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
          />
        </div>
        
        <div className="filter-group">
          <label>Sport</label>
          <select
            value={filters.sport}
            onChange={(e) => handleFilterChange('sport', e.target.value)}
          >
            <option value="">All Sports</option>
            {sports.map(sport => (
              <option key={sport} value={sport}>
                {sportsIcons[sport]} {sport.charAt(0).toUpperCase() + sport.slice(1)}
              </option>
            ))}
          </select>
        </div>
        
        <div className="filter-group">
          <label>Min Price (₹/hour)</label>
          <input
            type="number"
            placeholder="Min price"
            value={filters.minPrice}
            onChange={(e) => handleFilterChange('minPrice', e.target.value)}
          />
        </div>
        
        <div className="filter-group">
          <label>Max Price (₹/hour)</label>
          <input
            type="number"
            placeholder="Max price"
            value={filters.maxPrice}
            onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
          />
        </div>
        
        <div className="filter-group">
          <label>&nbsp;</label>
          <button 
            onClick={clearFilters}
            className="btn btn-outline"
          >
            Clear Filters
          </button>
        </div>
      </div>

      {/* Results Summary */}
      <div className="results-summary">
        <p>
          {loading ? 'Loading...' : `Found ${pagination.total} venues`}
          {filters.sport && ` for ${filters.sport}`}
          {filters.search && ` matching "${filters.search}"`}
        </p>
      </div>

      {/* Venues Grid */}
      {loading ? (
        <div className="text-center">
          <p>Loading venues...</p>
        </div>
      ) : venues.length === 0 ? (
        <div className="text-center">
          <div className="card">
            <h3>No venues found</h3>
            <p>Try adjusting your search criteria or clear filters to see all venues.</p>
            <button onClick={clearFilters} className="btn btn-primary">
              Show All Venues
            </button>
          </div>
        </div>
      ) : (
        <div className="venues-grid">
          {venues.map((venue) => (
            <div key={venue._id} className="venue-card">
              <div className="venue-image">
                {venue.photos && venue.photos.length > 0 ? (
                  <img 
                    src={venue.photos[0].url} 
                    alt={venue.name}
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                ) : null}
                <div className="venue-placeholder">📍</div>
              </div>
              
              <div className="venue-info">
                <h3>{venue.name}</h3>
                <p className="venue-location">
                  📍 {venue.address?.city || 'Location not specified'}
                </p>
                
                <div className="venue-sports">
                  {venue.sportsSupported?.slice(0, 3).map(sport => (
                    <span key={sport} className="sport-tag">
                      {sportsIcons[sport]} {sport}
                    </span>
                  ))}
                  {venue.sportsSupported?.length > 3 && (
                    <span className="sport-tag">
                      +{venue.sportsSupported.length - 3} more
                    </span>
                  )}
                </div>
                
                <div className="venue-amenities">
                  {venue.amenities?.slice(0, 2).map(amenity => (
                    <span key={amenity} className="amenity-tag">
                      ✓ {amenity}
                    </span>
                  ))}
                </div>
                
                <div className="venue-footer">
                  <span className="venue-price">
                    From ₹{venue.startingPrice || 0}/hour
                  </span>
                  <div className="venue-rating">
                    ⭐ {venue.rating?.average?.toFixed(1) || 'New'}
                    {venue.rating?.count > 0 && (
                      <span className="rating-count">
                        ({venue.rating.count})
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="venue-actions">
                  <Link 
                    to={`/venue/${venue._id}`} 
                    className="btn btn-primary btn-small"
                  >
                    View Details
                  </Link>
                  <span className="court-count">
                    {venue.courts || 0} court{venue.courts !== 1 ? 's' : ''}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="pagination">
          <button
            onClick={() => handlePageChange(pagination.currentPage - 1)}
            disabled={pagination.currentPage === 1}
            className="btn btn-outline"
          >
            Previous
          </button>
          
          {[...Array(pagination.totalPages)].map((_, index) => {
            const page = index + 1;
            return (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`btn ${page === pagination.currentPage ? 'btn-primary' : 'btn-outline'}`}
              >
                {page}
              </button>
            );
          })}
          
          <button
            onClick={() => handlePageChange(pagination.currentPage + 1)}
            disabled={pagination.currentPage === pagination.totalPages}
            className="btn btn-outline"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default Venues;
