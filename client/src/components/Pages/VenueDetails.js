import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import API from '../../api/axiosConfig';
import './VenueDetails.css';

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
    <div className="venue-details-page">
      <div className="vd-top">
        <div className="vd-media">
          <div className="vd-media-stage">
            {facility.photos && facility.photos.length > 0 ? (
              <img src={facility.photos[0]} alt={facility.name} />
            ) : (
              <div className="vd-media-placeholder">Images / Videos</div>
            )}
            {/* Simple prev/next placeholders */}
            {facility.photos && facility.photos.length > 1 && (
              <>
                <button className="vd-nav prev" aria-label="Previous image">&#60;</button>
                <button className="vd-nav next" aria-label="Next image">&#62;</button>
              </>
            )}
          </div>
        </div>
        <aside className="vd-side">
          <div className="vd-header">
            <h1 className="vd-title">{facility.name}</h1>
            <div className="vd-rating">
              <span className="vd-stars">{renderStars(facility.rating || 0)}</span>
              <span className="vd-rating-num">{facility.rating || 0} ({facility.totalReviews || 0})</span>
            </div>
            {facility.address && (
              <div className="vd-address-block">
                <div className="vd-address-label">Address</div>
                <div className="vd-address-text">{facility.address.street}, {facility.address.city}, {facility.address.state}, {facility.address.zipCode}</div>
              </div>
            )}
          </div>
          {facility.operatingHours && (
            <div className="vd-card">
              <div className="vd-card-title">Operating Hours</div>
              <div className="vd-hours">{facility.operatingHours.weekdays.open} - {facility.operatingHours.weekdays.close}</div>
            </div>
          )}
          <div className="vd-card">
            <div className="vd-card-title">Price Range</div>
            <div className="vd-price">₹{facility.priceRange.min} - ₹{facility.priceRange.max} / hr</div>
          </div>
          <button className="vd-book-btn" disabled={!user}>Book This Venue</button>
        </aside>
      </div>

      <div className="vd-section">
        <h2 className="vd-h2">Sports</h2>
        <div className="vd-sports-grid">
          {facility.sports && facility.sports.map((sport,i)=>(
            <div key={i} className="vd-sport-card">{sport}</div>
          ))}
        </div>
      </div>

      <div className="vd-section">
        <h2 className="vd-h2">Amenities</h2>
        <div className="vd-amenities">
          {facility.amenities && facility.amenities.map((a,i)=>(
            <span key={i} className="vd-amenity-tag">{a}</span>
          ))}
        </div>
      </div>

      <div className="vd-section">
        <h2 className="vd-h2">About Venue</h2>
        <ul className="vd-about-list">
          <li>Tournament Training Venue</li>
          <li>For more than 2 players extra charges may apply</li>
          <li>Equipment available on rent</li>
        </ul>
        {facility.description && <p className="vd-desc">{facility.description}</p>}
      </div>

      <div className="vd-section">
        <h2 className="vd-h2">Available Courts</h2>
        <div className="vd-booking-bar">
          <input type="date" value={selectedDate} onChange={e=>setSelectedDate(e.target.value)} />
          <select value={availabilityFilter} onChange={e=>setAvailabilityFilter(e.target.value)}>
            <option value="all">All Courts</option>
            <option value="available">Available</option>
            <option value="unavailable">Unavailable</option>
          </select>
        </div>
        <div className="vd-courts">
          {filteredCourts.map(court => {
            const availableSlots = getAvailableSlots(court);
            return (
              <div key={court._id} className="vd-court-card">
                <div className="vd-court-head">
                  <h3>{court.name}</h3>
                  <span className="vd-court-sport">{court.sport}</span>
                </div>
                <div className="vd-court-meta">₹{court.pricePerHour}/hr · Capacity {court.capacity}</div>
                <div className="vd-court-features">
                  {court.features.map((f,i)=><span key={i} className="vd-feature-tag">{f}</span>)}
                </div>
                <div className="vd-slots">
                  {availableSlots.length>0? availableSlots.map((slot,i)=>(
                    <Link key={i} className="vd-slot" to={`/book-court/${court._id}?date=${selectedDate}&time=${slot.start}-${slot.end}`}>{slot.start}-{slot.end}</Link>
                  )):<div className="vd-no-slots">No slots</div>}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="vd-section">
        <h2 className="vd-h2">Player Reviews & Ratings</h2>
        <div className="vd-reviews">
          {reviews.slice(0,5).map(r=> (
            <div key={r._id} className="vd-review-card">
              <div className="vd-review-head">
                <div className="vd-avatar">{r.user? r.user.name.charAt(0):'A'}</div>
                <div className="vd-reviewer">
                  <div className="vd-name">{r.user? r.user.name:'Anonymous'}</div>
                  <div className="vd-date">{new Date(r.date || r.createdAt).toLocaleDateString()}</div>
                </div>
                <div className="vd-review-stars">{renderStars(r.rating)}</div>
              </div>
              <p className="vd-review-text">{r.comment}</p>
            </div>
          ))}
          {reviews.length>5 && <div className="vd-more">(Load more reviews)</div>}
        </div>
      </div>
    </div>
  );
};

export default VenueDetails;
