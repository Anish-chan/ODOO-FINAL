import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../../api/axiosConfig';

const Venues = () => {
  const [venues, setVenues] = useState([]);
  const [filters, setFilters] = useState({
    sport: '',
    search: '',
    priceMin: '',
    priceMax: '',
    venueType: [],
    rating: ''
  });
  const [loading, setLoading] = useState(false);

  const sports = ['All Sports', 'Badminton', 'Tennis', 'Basketball', 'Football', 'Cricket', 'Table Tennis', 'Volleyball'];

  // Demo venues data matching your wireframe
  const demoVenues = [
    {
      _id: '1',
      name: 'SBR Badminton',
      images: ['/api/placeholder/300/200'],
      sport: 'Badminton',
      rating: { average: 4.5, count: 6 },
      address: { area: 'Vasllaskhvadi', city: 'Surat' },
      startingPrice: 250,
      amenities: ['Badminton', 'Outdoor', 'Top Rated', 'Premium']
    },
    {
      _id: '2', 
      name: 'SBR Badminton',
      images: ['/api/placeholder/300/200'],
      sport: 'Badminton',
      rating: { average: 4.5, count: 6 },
      address: { area: 'Vasllaskhvadi', city: 'Surat' },
      startingPrice: 250,
      amenities: ['Badminton', 'Outdoor', 'Top Rated', 'Premium']
    },
    {
      _id: '3',
      name: 'SBR Badminton', 
      images: ['/api/placeholder/300/200'],
      sport: 'Badminton',
      rating: { average: 4.5, count: 6 },
      address: { area: 'Vasllaskhvadi', city: 'Surat' },
      startingPrice: 250,
      amenities: ['Badminton', 'Outdoor', 'Top Rated', 'Premium']
    },
    {
      _id: '4',
      name: 'SBR Badminton',
      images: ['/api/placeholder/300/200'], 
      sport: 'Badminton',
      rating: { average: 4.5, count: 6 },
      address: { area: 'Vasllaskhvadi', city: 'Surat' },
      startingPrice: 250,
      amenities: ['Badminton', 'Outdoor', 'Top Rated', 'Premium']
    },
    {
      _id: '5',
      name: 'SBR Badminton',
      images: ['/api/placeholder/300/200'],
      sport: 'Badminton', 
      rating: { average: 4.5, count: 6 },
      address: { area: 'Vasllaskhvadi', city: 'Surat' },
      startingPrice: 250,
      amenities: ['Badminton', 'Outdoor', 'Top Rated', 'Premium']
    },
    {
      _id: '6',
      name: 'SBR Badminton',
      images: ['/api/placeholder/300/200'],
      sport: 'Badminton',
      rating: { average: 4.5, count: 6 },
      address: { area: 'Vasllaskhvadi', city: 'Surat' },
      startingPrice: 250,
      amenities: ['Badminton', 'Outdoor', 'Top Rated', 'Premium']
    }
  ];

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
      setVenues(response.data.facilities || demoVenues);
    } catch (error) {
      console.error('Error fetching venues:', error);
      // Use demo data on error
      setVenues(demoVenues);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (field, value) => {
    setFilters({ ...filters, [field]: value });
  };

  const handleVenueTypeChange = (type) => {
    const currentTypes = filters.venueType;
    if (currentTypes.includes(type)) {
      setFilters({ ...filters, venueType: currentTypes.filter(t => t !== type) });
    } else {
      setFilters({ ...filters, venueType: [...currentTypes, type] });
    }
  };

  const clearFilters = () => {
    setFilters({
      sport: '',
      search: '',
      priceMin: '',
      priceMax: '',
      venueType: [],
      rating: ''
    });
  };

  return (
    <div className="venues-page-new">
      <div className="venues-layout">
        {/* Left Sidebar - Filters */}
        <div className="venues-sidebar">
          {/* Search by venue name */}
          <div className="sidebar-section">
            <h3 className="sidebar-title">Search by venue name</h3>
            <div className="search-input-container">
              <input
                type="text"
                placeholder="Search for venues"
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="venue-search-input"
              />
            </div>
          </div>

          {/* Filter by sport type */}
          <div className="sidebar-section">
            <h3 className="sidebar-title">Filter by sport type</h3>
            <select 
              className="sport-select"
              value={filters.sport}
              onChange={(e) => handleFilterChange('sport', e.target.value)}
            >
              <option value="">All Sports</option>
              {sports.slice(1).map(sport => (
                <option key={sport} value={sport}>{sport}</option>
              ))}
            </select>
          </div>

          {/* Price range */}
          <div className="sidebar-section">
            <h3 className="sidebar-title">Price range (per hour)</h3>
            <div className="price-range-inputs">
              <input
                type="number"
                placeholder="₹ 0.00"
                value={filters.priceMin}
                onChange={(e) => handleFilterChange('priceMin', e.target.value)}
                className="price-input"
              />
              <span className="price-separator">-</span>
              <input
                type="number"
                placeholder="₹ 5,500.00"
                value={filters.priceMax}
                onChange={(e) => handleFilterChange('priceMax', e.target.value)}
                className="price-input"
              />
            </div>
          </div>

          {/* Choose Venue Type */}
          <div className="sidebar-section">
            <h3 className="sidebar-title">Choose Venue Type</h3>
            <div className="venue-type-options">
              <label className="venue-type-option">
                <input
                  type="radio"
                  name="venueType"
                  value="indoor"
                  checked={filters.venueType.includes('indoor')}
                  onChange={() => handleVenueTypeChange('indoor')}
                />
                <span className="radio-custom"></span>
                Indoor
              </label>
              <label className="venue-type-option">
                <input
                  type="radio"
                  name="venueType"
                  value="outdoor"
                  checked={filters.venueType.includes('outdoor')}
                  onChange={() => handleVenueTypeChange('outdoor')}
                />
                <span className="radio-custom"></span>
                Outdoor
              </label>
            </div>
          </div>

          {/* Rating */}
          <div className="sidebar-section">
            <h3 className="sidebar-title">Rating</h3>
            <div className="rating-options">
              {[5, 4, 3, 2, 1].map(rating => (
                <label key={rating} className="rating-option">
                  <input
                    type="checkbox"
                    checked={filters.rating === rating.toString()}
                    onChange={() => handleFilterChange('rating', filters.rating === rating.toString() ? '' : rating.toString())}
                  />
                  <span className="checkbox-custom"></span>
                  <span className="rating-stars">
                    {'★'.repeat(rating)}{'☆'.repeat(5-rating)}
                  </span>
                  & up
                </label>
              ))}
            </div>
          </div>

          {/* Clear Search Button */}
          <button className="clear-search-btn" onClick={clearFilters}>
            Clear Search
          </button>
        </div>

        {/* Right Content - Venues Grid */}
        <div className="venues-content-area">
          {loading ? (
            <div className="venues-loading">
              <div className="loading-spinner-new"></div>
              <p>Loading venues...</p>
            </div>
          ) : (
            <div className="venues-grid-new">
              {(venues.length > 0 ? venues : demoVenues).map(venue => (
                <div key={venue._id} className="venue-card-new">
                  <div className="venue-card-image">
                    <img 
                      src={venue.images?.[0] || '/api/placeholder/300/200'} 
                      alt={venue.name}
                      onError={(e) => {
                        e.target.src = '/api/placeholder/300/200';
                      }}
                    />
                  </div>
                  
                  <div className="venue-card-content">
                    <div className="venue-sport-type">{venue.sport || 'SBR Badminton'}</div>
                    
                    <div className="venue-rating-row">
                      <span className="venue-rating-star">★</span>
                      <span className="venue-rating-value">
                        {venue.rating?.average?.toFixed(1) || '4.5'}
                      </span>
                      <span className="venue-rating-count">
                        ({venue.rating?.count || '6'})
                      </span>
                    </div>
                    
                    <div className="venue-location-row">
                      <span className="location-icon">📍</span>
                      <span className="venue-location-text">
                        {venue.address?.area || 'Vasllaskhvadi'} Cir
                      </span>
                    </div>
                    
                    <div className="venue-price-row">
                      <span className="venue-price">₹ {venue.startingPrice || '250'} per hour</span>
                    </div>
                    
                    <div className="venue-amenities-tags">
                      {(venue.amenities || ['Badminton', 'Outdoor', 'Top Rated', 'Premium']).map((amenity, index) => (
                        <span key={index} className={`amenity-tag ${amenity.toLowerCase().replace(' ', '-')}`}>
                          {amenity}
                        </span>
                      ))}
                    </div>
                    
                    <Link to={`/venue/${venue._id}`} className="view-details-btn">
                      View Details
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Venues;
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
