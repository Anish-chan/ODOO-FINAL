import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import API from '../../api/axiosConfig';
import './VenueDetailsWireframe.css';

const VenueDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [facility, setFacility] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showPricingModal, setShowPricingModal] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedSport, setSelectedSport] = useState(null);
  const [bookingData, setBookingData] = useState({
    sport: '',
    date: '',
    startTime: '',
    duration: 2,
    selectedCourts: ['Court 1'], // Default to one court
    totalPrice: 1200,
    hourlyRate: 600
  });
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      await fetchFacilityDetails();
    };
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchFacilityDetails = async () => {
    try {
      console.log('Fetching facility details for ID:', id);
      const response = await API.get(`/api/facilities/${id}`);
      console.log('Facility data received:', response.data);
      
      const facilityData = response.data;
      setFacility({
        ...facilityData,
        rating: facilityData.rating?.average || 4.5,
        totalReviews: facilityData.rating?.count || 128,
        sports: facilityData.sportsSupported || [],
        photos: facilityData.photos ? facilityData.photos.map(photo => photo.url || photo) : []
      });
      
      if (facilityData.reviews) setReviews(facilityData.reviews);
      
      setLoading(false);
    } catch (error) {
      console.error('Error fetching facility:', error);
      
      // Demo data matching wireframe design
      setFacility({
        _id: id,
        name: 'SBR Badminton',
        location: 'Satellite, Jodhpur Village',
        description: 'Tournament Training Venue',
        address: {
          line1: 'Nr. Akash Heights, Satellite,',
          line2: 'Jodhpur Village, Ahmedabad, Gujarat',
          line3: '380015, India'
        },
        contact: {
          phone: '+91 9876543210',
          email: 'info@sbrbadminton.com'
        },
        rating: 4.5,
        totalReviews: 6,
        priceRange: '₹0 - ₹0 / hr',
        operatingHours: '7:00AM - 11:00PM',
        sports: [
          { name: 'Badminton', icon: '🏸' },
          { name: 'Table Tennis', icon: '🏓' },
          { name: 'Box Cricket', icon: '🏏' }
        ],
        amenities: [
          'Parking',
          'Restroom', 
          'Refreshments',
          'CCTV Surveillance',
          'WiFi',
          'Library',
          'Seating Management',
          'Centrally Air Conditioned Hall'
        ],
        aboutVenue: [
          'Tournament Training Venue',
          'For more than 2 players Rs. 50 extra per person',
          'Equipment available on rent'
        ],
        photos: [
          '/api/placeholder/600/400',
          '/api/placeholder/600/400',
          '/api/placeholder/600/400'
        ]
      });

      setReviews([
        {
          _id: '1',
          user: { name: 'Ritesh J Admin' },
          rating: 5,
          comment: 'Nice turf, well maintained',
          createdAt: '2025-06-18T09:30:00Z'
        },
        {
          _id: '2',
          user: { name: 'Ritesh J Admin' },
          rating: 5,
          comment: 'Nice turf, well maintained',
          createdAt: '2025-06-18T09:30:00Z'
        },
        {
          _id: '3',
          user: { name: 'Ritesh J Admin' },
          rating: 5,
          comment: 'Nice turf, well maintained',
          createdAt: '2025-06-18T09:30:00Z'
        },
        {
          _id: '4',
          user: { name: 'Ritesh J Admin' },
          rating: 5,
          comment: 'Nice turf, well maintained',
          createdAt: '2025-06-18T09:30:00Z'
        },
        {
          _id: '5',
          user: { name: 'Ritesh J Admin' },
          rating: 5,
          comment: 'Nice turf, well maintained',
          createdAt: '2025-06-18T09:30:00Z'
        },
        {
          _id: '6',
          user: { name: 'Ritesh J Admin' },
          rating: 5,
          comment: 'Nice turf, well maintained',
          createdAt: '2025-06-18T09:30:00Z'
        }
      ]);

      setLoading(false);
    }
  };

  const nextImage = () => {
    if (facility?.photos?.length > 0) {
      setCurrentImageIndex((prev) => 
        prev === facility.photos.length - 1 ? 0 : prev + 1
      );
    }
  };

  const prevImage = () => {
    if (facility?.photos?.length > 0) {
      setCurrentImageIndex((prev) => 
        prev === 0 ? facility.photos.length - 1 : prev - 1
      );
    }
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <span 
        key={index} 
        className={index < Math.floor(rating) ? 'star filled' : 'star'}
      >
        ★
      </span>
    ));
  };

  // Helper function to get sport icon
  const getSportIcon = (sportName) => {
    const icons = {
      'badminton': '🏸',
      'table tennis': '🏓',
      'tennis': '🎾',
      'basketball': '🏀',
      'football': '⚽',
      'cricket': '🏏',
      'volleyball': '🏐',
      'squash': '🎾',
      'pool': '🎱',
      'snooker': '🎱'
    };
    return icons[sportName.toLowerCase()] || '🏸';
  };

  // Handle sport click to show pricing
  const handleSportClick = (sport) => {
    setSelectedSport(sport);
    setShowPricingModal(true);
  };

  // Handle book venue click
  const handleBookVenue = () => {
    setShowBookingModal(true);
  };

  // Mock pricing data
  const getPricingForSport = (sportName) => {
    const pricing = {
      'Badminton': { peak: 800, nonPeak: 600, weekend: 1000 },
      'Table Tennis': { peak: 500, nonPeak: 400, weekend: 600 },
      'Box Cricket': { peak: 1200, nonPeak: 1000, weekend: 1500 }
    };
    return pricing[sportName] || { peak: 600, nonPeak: 500, weekend: 800 };
  };

  // Handle booking form changes
  const handleBookingChange = (field, value) => {
    setBookingData(prev => {
      const updated = { ...prev, [field]: value };
      
      // Recalculate price when relevant fields change
      if (field === 'sport' || field === 'selectedCourts') {
        const basePrice = field === 'sport' ? getPricingForSport(value) : getPricingForSport(updated.sport);
        const hourlyRate = basePrice ? basePrice.peak : 600;
        updated.hourlyRate = hourlyRate;
        updated.totalPrice = updated.duration * hourlyRate * Math.max(1, updated.selectedCourts.length);
      }
      
      return updated;
    });
  };

  // Handle duration change with dynamic pricing
  const changeDuration = (increment) => {
    const newDuration = Math.max(1, bookingData.duration + increment);
    const hourlyRate = bookingData.hourlyRate || 600;
    
    setBookingData(prev => ({
      ...prev,
      duration: newDuration,
      totalPrice: newDuration * hourlyRate * Math.max(1, prev.selectedCourts.length)
    }));
  };

  if (loading || !facility) {
    return (
      <div className="venue-details-wireframe">
        <div className="venue-container">
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            height: '50vh',
            color: '#6b7280'
          }}>
            Loading venue details...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="venue-details-wireframe">
      <div className="venue-main-container">
        <div className="venue-content-wireframe">
          {/* Left Content */}
          <div className="venue-left-content">
            {/* Venue Title */}
            <div className="venue-title-section">
              <h1 className="venue-name">{facility.name}</h1>
              <div className="venue-meta">
                <span className="venue-location">📍 {facility.location}</span>
                <div className="venue-rating">
                  <div className="venue-stars">
                    {renderStars(facility.rating)}
                  </div>
                  <span className="venue-rating-text">
                    {facility.rating} ({facility.totalReviews})
                  </span>
                </div>
              </div>
            </div>

            {/* Image Gallery */}
            <div className="venue-image-section">
              <div className="venue-image-container">
                {facility.photos?.length > 1 && (
                  <button className="venue-nav-btn venue-prev" onClick={prevImage}>
                    ‹
                  </button>
                )}
                <img 
                  src={facility.photos[currentImageIndex] || '/images/placeholder-venue.jpg'} 
                  alt="Venue"
                  className="venue-main-image"
                />
                {facility.photos?.length > 1 && (
                  <button className="venue-nav-btn venue-next" onClick={nextImage}>
                    ›
                  </button>
                )}
                <div className="venue-image-label">
                  Images / Videos
                </div>
              </div>
            </div>

            {/* Sports Available */}
            <section className="venue-section">
              <h3 className="section-title">Sports Available <span className="section-subtitle">Click on sports to view price chart</span></h3>
              <div className="sports-grid-wireframe">
                {(facility.sports || []).map((sport, index) => (
                  <div 
                    key={index} 
                    className="sport-card-wireframe clickable"
                    onClick={() => handleSportClick(sport)}
                  >
                    <div className="sport-icon">
                      {typeof sport === 'object' ? sport.icon : getSportIcon(sport)}
                    </div>
                    <span className="sport-name">
                      {typeof sport === 'object' ? sport.name : sport}
                    </span>
                  </div>
                ))}
              </div>
            </section>

            {/* Amenities */}
            <section className="venue-section">
              <h3 className="section-title">Amenities</h3>
              <div className="amenities-grid-wireframe">
                {(facility.amenities || []).map((amenity, index) => (
                  <div key={index} className="amenity-item-wireframe">
                    <span className="amenity-check">✓</span>
                    <span className="amenity-name">
                      {typeof amenity === 'object' ? amenity.name : amenity}
                    </span>
                  </div>
                ))}
              </div>
            </section>

            {/* About Venue */}
            <section className="venue-section">
              <h3 className="section-title">About Venue</h3>
              <ul className="about-list-wireframe">
                {facility.aboutVenue ? facility.aboutVenue.map((item, index) => (
                  <li key={index}>— {item}</li>
                )) : (
                  <>
                    <li>— Professional quality courts</li>
                    <li>— Equipment rental available</li>
                    <li>— Experienced coaching staff</li>
                  </>
                )}
              </ul>
            </section>

            {/* Reviews */}
            <section className="venue-section">
              <h3 className="section-title">Player Reviews & Ratings</h3>
              <div className="reviews-list-wireframe">
                {reviews.map((review) => (
                  <div key={review._id} className="review-card-wireframe">
                    <div className="review-header">
                      <div className="reviewer-info">
                        <div className="reviewer-avatar">
                          {review.user.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="reviewer-details">
                          <span className="reviewer-name">{review.user.name}</span>
                          <div className="review-stars">
                            {renderStars(review.rating)}
                          </div>
                        </div>
                      </div>
                      <span className="review-date">
                        📅 {new Date(review.createdAt).toLocaleDateString('en-GB', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric'
                        })}, ⏰ {new Date(review.createdAt).toLocaleTimeString('en-GB', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </div>
                    <p className="review-comment">{review.comment}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Right Sidebar */}
          <div className="venue-sidebar-wireframe">
            <button 
              className="book-venue-btn-wireframe"
              onClick={handleBookVenue}
            >
              Book This Venue
            </button>
            
            <div className="sidebar-card">
              <div className="card-header">
                <span className="card-icon">🕐</span>
                <span className="card-title">Operating Hours</span>
              </div>
              <div className="card-content">
                <div className="operating-hours">
                  {typeof facility.operatingHours === 'string' 
                    ? facility.operatingHours 
                    : '7:00AM - 11:00PM'
                  }
                </div>
              </div>
            </div>

            <div className="sidebar-card">
              <div className="card-header">
                <span className="card-icon">📍</span>
                <span className="card-title">Address</span>
              </div>
              <div className="card-content">
                <div className="address-content">
                  {facility.address?.line1 ? (
                    <>
                      <p>{facility.address.line1}</p>
                      <p>{facility.address.line2}</p>
                      <p>{facility.address.line3}</p>
                    </>
                  ) : (
                    <>
                      <p>{facility.address?.street || facility.location}</p>
                      <p>{facility.address?.city || 'City'}</p>
                      <p>{facility.address?.state || 'State'} - {facility.address?.zipCode || '000000'}</p>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="sidebar-card">
              <h4 className="map-title">Location Map</h4>
              <div className="map-container">
                <div className="map-placeholder">
                  🗺️ Map View
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Pricing Modal */}
      {showPricingModal && (
        <div className="modal-overlay" onClick={() => setShowPricingModal(false)}>
          <div className="pricing-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>
                {selectedSport?.icon || getSportIcon(selectedSport?.name || selectedSport)} 
                {" "}{selectedSport?.name || selectedSport} Pricing
              </h3>
              <button className="close-btn" onClick={() => setShowPricingModal(false)}>×</button>
            </div>
            <div className="pricing-content">
              {(() => {
                const pricing = getPricingForSport(selectedSport?.name || selectedSport);
                return (
                  <div className="pricing-grid">
                    <div className="pricing-item">
                      <span className="time-label">Peak Hours (6PM - 10PM)</span>
                      <span className="price">₹{pricing.peak}/hr</span>
                    </div>
                    <div className="pricing-item">
                      <span className="time-label">Non-Peak Hours</span>
                      <span className="price">₹{pricing.nonPeak}/hr</span>
                    </div>
                    <div className="pricing-item">
                      <span className="time-label">Weekends</span>
                      <span className="price">₹{pricing.weekend}/hr</span>
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>
        </div>
      )}

      {/* Booking Modal */}
      {showBookingModal && (
        <div className="modal-overlay" onClick={() => setShowBookingModal(false)}>
          <div className="booking-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Book {facility.name}</h2>
              <button 
                className="close-btn" 
                onClick={() => setShowBookingModal(false)}
              >
                ×
              </button>
            </div>
            
            <div className="booking-content">
              <div className="booking-form">
                <div className="form-section">
                  <label>Sport</label>
                  <select 
                    value={bookingData.sport} 
                    onChange={(e) => handleBookingChange('sport', e.target.value)}
                    className="form-control"
                  >
                    <option value="">Select Sport</option>
                    <option value="Badminton">🏸 Badminton</option>
                    <option value="Table Tennis">🏓 Table Tennis</option>
                    <option value="Box Cricket">🏏 Box Cricket</option>
                  </select>
                </div>

                <div className="form-section">
                  <label>Date</label>
                  <input 
                    type="date" 
                    className="form-control"
                    value={bookingData.date}
                    onChange={(e) => handleBookingChange('date', e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>

                <div className="form-section">
                  <label>Start Time</label>
                  <input 
                    type="time" 
                    className="form-control"
                    value={bookingData.startTime}
                    onChange={(e) => handleBookingChange('startTime', e.target.value)}
                  />
                </div>

                <div className="form-section">
                  <label>Duration (Hours)</label>
                  <div className="duration-control">
                    <button 
                      type="button" 
                      onClick={() => changeDuration(-1)}
                      className="duration-btn"
                    >
                      -
                    </button>
                    <span className="duration-value">{bookingData.duration} Hr</span>
                    <button 
                      type="button" 
                      onClick={() => changeDuration(1)}
                      className="duration-btn"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="form-section">
                  <label>Court</label>
                  <select 
                    className="form-control"
                    value={`${bookingData.selectedCourts.length}`}
                    onChange={(e) => {
                      const count = parseInt(e.target.value);
                      const courts = [];
                      for (let i = 1; i <= count; i++) {
                        courts.push(`Table ${i}`);
                      }
                      handleBookingChange('selectedCourts', courts);
                    }}
                  >
                    <option value="0">--Select Court--</option>
                    <option value="1">1 × Table</option>
                    <option value="2">2 × Table</option>
                    <option value="3">3 × Table</option>
                  </select>
                </div>

                <button 
                  className="continue-payment-btn"
                  disabled={!bookingData.sport || !bookingData.date || !bookingData.startTime || bookingData.selectedCourts.length === 0}
                >
                  {!bookingData.sport || !bookingData.date || !bookingData.startTime || bookingData.selectedCourts.length === 0 
                    ? 'Please complete your selection' 
                    : `Continue to Payment - ₹${bookingData.duration * (bookingData.hourlyRate || 600) * Math.max(1, bookingData.selectedCourts.length)}.00`
                  }
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VenueDetails;
