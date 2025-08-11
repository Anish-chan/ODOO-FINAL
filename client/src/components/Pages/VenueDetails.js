import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import API from '../../api/axiosConfig';

const VenueDetails = () => {
  const { id } = useParams();
  const [facility, setFacility] = useState(null);
  const [courts, setCourts] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState('');
  const [availabilityFilter, setAvailabilityFilter] = useState('all');
  const { user } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      await fetchFacilityDetails();
    };
    
    fetchData();
    
    // Set default date to tomorrow
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    setSelectedDate(tomorrow.toISOString().split('T')[0]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchFacilityDetails = async () => {
    try {
      console.log('Fetching facility details for ID:', id);
      const response = await API.get(`/api/facilities/${id}`);
      console.log('Facility data received:', response.data);
      
      // Process the facility data to match our component expectations
      const facilityData = response.data;
      
      // Calculate price range from courts
      let priceRange = { min: 0, max: 0 };
      if (facilityData.courts && facilityData.courts.length > 0) {
        const prices = facilityData.courts.map(court => court.pricePerHour);
        priceRange = {
          min: Math.min(...prices),
          max: Math.max(...prices)
        };
      }
      
      // Process operating hours to a simpler format
      let operatingHours = null;
      if (facilityData.operatingHours) {
        const weekdayHours = facilityData.operatingHours.monday || { open: '09:00', close: '21:00' };
        const weekendHours = facilityData.operatingHours.saturday || { open: '09:00', close: '21:00' };
        
        operatingHours = {
          weekdays: weekdayHours,
          weekends: weekendHours
        };
      }
      
      // Process photos to extract URLs
      const photos = facilityData.photos ? facilityData.photos.map(photo => photo.url || photo) : [];
      
      // Set the processed facility data
      setFacility({
        ...facilityData,
        priceRange,
        operatingHours,
        photos,
        rating: facilityData.rating?.average || 0,
        totalReviews: facilityData.rating?.count || 0,
        sports: facilityData.sportsSupported || []
      });
      
      // Set courts and reviews from the response
      if (facilityData.courts) {
        setCourts(facilityData.courts);
      }
      if (facilityData.reviews) {
        setReviews(facilityData.reviews);
      }
      
      setLoading(false);
    } catch (error) {
      console.error('Error fetching facility:', error);
      console.log('Using demo data for facility ID:', id);
      // For demo purposes, set dummy data
      setFacility({
        _id: id,
        name: 'Downtown Sports Complex',
        description: 'Premier sports facility in the heart of the city offering world-class courts and amenities for all skill levels.',
        address: {
          street: '123 Main St',
          city: 'City Center', 
          state: 'State',
          zipCode: '12345'
        },
        phone: '+1 (555) 123-4567',
        email: 'info@downtownsports.com',
        website: 'www.downtownsports.com',
        sports: ['Basketball', 'Tennis', 'Badminton'],
        sportsSupported: ['basketball', 'tennis', 'badminton'],
        photos: [
          'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
          'https://images.unsplash.com/photo-1594736797933-d0b22e4d7de3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
          'https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80'
        ],
        amenities: ['Parking', 'Lockers', 'Showers', 'Equipment Rental', 'Cafeteria', 'WiFi', 'AC'],
        operatingHours: {
          weekdays: { open: '06:00', close: '23:00' },
          weekends: { open: '07:00', close: '22:00' }
        },
        rating: 4.5,
        totalReviews: 128,
        priceRange: {
          min: 30,
          max: 75
        },
        owner: {
          name: 'John Smith',
          email: 'john@example.com',
          phone: '+1 (555) 987-6543'
        }
      });
      
      // Set demo courts
      setCourts([
        {
          _id: 'court1',
          name: 'Basketball Court A',
          sport: 'Basketball',
          pricePerHour: 50,
          capacity: 10,
          features: ['Indoor', 'Air Conditioned', 'Professional Lighting'],
          isActive: true,
          availability: {
            '2025-08-12': [
              { start: '09:00', end: '10:00', available: true },
              { start: '10:00', end: '11:00', available: false },
              { start: '11:00', end: '12:00', available: true },
              { start: '14:00', end: '15:00', available: true },
              { start: '15:00', end: '16:00', available: true },
              { start: '18:00', end: '19:00', available: false },
              { start: '19:00', end: '20:00', available: true }
            ]
          }
        },
        {
          _id: 'court2',
          name: 'Tennis Court 1',
          sport: 'Tennis',
          pricePerHour: 75,
          capacity: 4,
          features: ['Outdoor', 'Flood Lights', 'Clay Surface'],
          isActive: true,
          availability: {
            '2025-08-12': [
              { start: '08:00', end: '09:30', available: true },
              { start: '09:30', end: '11:00', available: true },
              { start: '11:00', end: '12:30', available: false },
              { start: '14:00', end: '15:30', available: true },
              { start: '15:30', end: '17:00', available: true },
              { start: '17:00', end: '18:30', available: false }
            ]
          }
        },
        {
          _id: 'court3',
          name: 'Badminton Court 1',
          sport: 'Badminton',
          pricePerHour: 30,
          capacity: 4,
          features: ['Indoor', 'Wooden Floor', 'Professional Net'],
          isActive: true,
          availability: {
            '2025-08-12': [
              { start: '07:00', end: '08:00', available: true },
              { start: '08:00', end: '09:00', available: true },
              { start: '09:00', end: '10:00', available: false },
              { start: '18:00', end: '19:00', available: true },
              { start: '19:00', end: '20:00', available: true },
              { start: '20:00', end: '21:00', available: false }
            ]
          }
        }
      ]);
      
      // Set demo reviews
      setReviews([
        {
          _id: 'review1',
          user: { name: 'John Smith', avatar: '' },
          rating: 5,
          comment: 'Excellent facility with top-notch courts and great staff. The basketball court is professional quality!',
          date: '2025-08-05T10:30:00Z'
        },
        {
          _id: 'review2',
          user: { name: 'Sarah Johnson', avatar: '' },
          rating: 4,
          comment: 'Good courts and convenient location. The only issue is parking can be limited during peak hours.',
          date: '2025-08-02T14:20:00Z'
        },
        {
          _id: 'review3',
          user: { name: 'Mike Chen', avatar: '' },
          rating: 5,
          comment: 'Love playing tennis here! The courts are well-maintained and the booking system is easy to use.',
          date: '2025-07-30T16:45:00Z'
        }
      ]);
      
      setLoading(false);
    }
  };

  const getAvailableSlots = (court) => {
    if (!court.availability || !court.availability[selectedDate]) {
      return [];
    }
    return court.availability[selectedDate].filter(slot => slot.available);
  };

  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    const stars = [];

    for (let i = 0; i < fullStars; i++) {
      stars.push(<span key={i} className="star filled">★</span>);
    }
    
    if (hasHalfStar) {
      stars.push(<span key="half" className="star half">★</span>);
    }
    
    const remainingStars = 5 - Math.ceil(rating);
    for (let i = 0; i < remainingStars; i++) {
      stars.push(<span key={`empty-${i}`} className="star empty">★</span>);
    }
    
    return stars;
  };

  const filteredCourts = courts.filter(court => {
    if (availabilityFilter === 'all') return true;
    if (availabilityFilter === 'available') return getAvailableSlots(court).length > 0;
    if (availabilityFilter === 'unavailable') return getAvailableSlots(court).length === 0;
    return true;
  });

  if (loading || !facility) {
    return (
      <div className="container">
        <div className="loading">Loading venue details...</div>
      </div>
    );
  }

  return (
    <div className="venue-details">
      {/* Back Button */}
      <Link to="/venues" className="back-link">
        ← Back to Venues
      </Link>

      {/* Venue Header */}
      <div className="venue-header">
        <div className="venue-info">
          <h1>{facility.name}</h1>
          <div className="venue-rating">
            <div className="stars">
              {renderStars(facility.rating || 0)}
            </div>
            <span className="rating-text">
              {facility.rating || 0} ({facility.totalReviews || 0} reviews)
            </span>
          </div>
          {facility.address && (
            <p className="venue-address">
              📍 {facility.address.street}, {facility.address.city}, {facility.address.state} {facility.address.zipCode}
            </p>
          )}
          <p className="venue-description">{facility.description}</p>
          
          <div className="venue-contact">
            {(facility.phone || (facility.owner && facility.owner.phone)) && (
              <div className="contact-item">
                <strong>Phone:</strong> {facility.phone || facility.owner.phone}
              </div>
            )}
            {(facility.email || (facility.owner && facility.owner.email)) && (
              <div className="contact-item">
                <strong>Email:</strong> {facility.email || facility.owner.email}
              </div>
            )}
            {facility.website && (
              <div className="contact-item">
                <strong>Website:</strong> 
                <a href={`https://${facility.website}`} target="_blank" rel="noopener noreferrer">
                  {facility.website}
                </a>
              </div>
            )}
            {facility.owner && facility.owner.name && (
              <div className="contact-item">
                <strong>Facility Owner:</strong> {facility.owner.name}
              </div>
            )}
          </div>
        </div>

        <div className="venue-sidebar">
          {facility.priceRange && facility.priceRange.min && facility.priceRange.max && (
            <div className="price-range">
              <h3>Price Range</h3>
              <div className="price">₹{facility.priceRange.min} - ₹{facility.priceRange.max} per hour</div>
            </div>
          )}
          
          {facility.operatingHours && facility.operatingHours.weekdays && facility.operatingHours.weekends && (
            <div className="operating-hours">
              <h3>Operating Hours</h3>
              <div className="hours">
                <div><strong>Weekdays:</strong> {facility.operatingHours.weekdays.open} - {facility.operatingHours.weekdays.close}</div>
                <div><strong>Weekends:</strong> {facility.operatingHours.weekends.open} - {facility.operatingHours.weekends.close}</div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Photo Gallery */}
      {facility.photos && facility.photos.length > 0 && (
        <div className="venue-gallery">
          {facility.photos.map((photo, index) => (
            <img key={index} src={photo} alt={`${facility.name} ${index + 1}`} />
          ))}
        </div>
      )}

      {/* Amenities */}
      <div className="section">
        <h2>Amenities</h2>
        <div className="venue-amenities">
          {facility.amenities && facility.amenities.map((amenity, index) => (
            <span key={index} className="amenity-tag">{amenity}</span>
          ))}
        </div>
      </div>

      {/* Sports Available */}
      <div className="section">
        <h2>Sports Available</h2>
        <div className="sports-list">
          {facility.sports && facility.sports.map((sport, index) => (
            <span key={index} className="sport-tag">{sport}</span>
          ))}
        </div>
      </div>

      {/* Court Booking Section */}
      <div className="section">
        <h2>Available Courts</h2>
        
        {/* Date Selector */}
        <div className="booking-controls">
          <div className="date-selector">
            <label htmlFor="booking-date">Select Date:</label>
            <input
              id="booking-date"
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
            />
          </div>
          
          <div className="availability-filter">
            <label>Filter by availability:</label>
            <select 
              value={availabilityFilter} 
              onChange={(e) => setAvailabilityFilter(e.target.value)}
            >
              <option value="all">All Courts</option>
              <option value="available">Available Only</option>
              <option value="unavailable">Unavailable Only</option>
            </select>
          </div>
        </div>

        {/* Courts List */}
        <div className="courts-list">
          {filteredCourts.map(court => {
            const availableSlots = getAvailableSlots(court);
            
            return (
              <div key={court._id} className="court-card">
                <div className="court-header">
                  <h3>{court.name}</h3>
                  <div className="court-sport">{court.sport}</div>
                </div>
                
                <div className="court-details">
                  <div className="court-price">₹{court.pricePerHour}/hour</div>
                  <div className="court-capacity">Capacity: {court.capacity} players</div>
                </div>
                
                <div className="court-features">
                  {court.features.map((feature, index) => (
                    <span key={index} className="feature-tag">{feature}</span>
                  ))}
                </div>
                
                <div className="court-availability">
                  <h4>Available Time Slots ({selectedDate})</h4>
                  {availableSlots.length > 0 ? (
                    <div className="time-slots">
                      {availableSlots.map((slot, index) => (
                        <Link
                          key={index}
                          to={`/book-court/${court._id}?date=${selectedDate}&time=${slot.start}-${slot.end}`}
                          className="time-slot"
                        >
                          {slot.start} - {slot.end}
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <div className="no-slots">No available slots for selected date</div>
                  )}
                </div>
                
                {availableSlots.length > 0 && user && (
                  <div className="court-actions">
                    <Link 
                      to={`/book-court/${court._id}?date=${selectedDate}`}
                      className="btn btn-primary"
                    >
                      Book This Court
                    </Link>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Reviews Section */}
      <div className="section">
        <h2>Customer Reviews</h2>
        
        {reviews.length > 0 ? (
          <div className="reviews-list">
            {reviews.slice(0, 5).map(review => (
              <div key={review._id} className="review-card">
                <div className="review-header">
                  <div className="reviewer-info">
                    <div className="reviewer-avatar">
                      {review.user && review.user.avatar ? (
                        <img src={review.user.avatar} alt={review.user.name} />
                      ) : (
                        <div className="avatar-placeholder">
                          {review.user ? review.user.name.charAt(0) : 'A'}
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="reviewer-name">{review.user ? review.user.name : 'Anonymous'}</div>
                      <div className="review-date">
                        {new Date(review.date || review.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <div className="review-rating">
                    {renderStars(review.rating)}
                  </div>
                </div>
                <div className="review-comment">{review.comment}</div>
              </div>
            ))}
            
            {reviews.length > 5 && (
              <div className="view-more-reviews">
                <button className="btn btn-outline">View All Reviews</button>
              </div>
            )}
          </div>
        ) : (
          <div className="no-reviews">
            <p>No reviews yet. Be the first to review this venue!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default VenueDetails;
