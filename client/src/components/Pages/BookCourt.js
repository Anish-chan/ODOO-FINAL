import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';

const BookCourt = () => {
  const { courtId, venueId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [court, setCourt] = useState(null);
  const [facility, setFacility] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('01:00 PM');
  const [selectedDuration, setSelectedDuration] = useState(2);
  const [selectedCourt, setSelectedCourt] = useState('');
  const [availableCourts, setAvailableCourts] = useState([]);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [totalAmount, setTotalAmount] = useState(1200);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchVenueDetails();
    
    // Set default date to today's date in the format shown in wireframe
    const today = new Date();
    const formattedDate = today.toISOString().split('T')[0];
    setSelectedDate(formattedDate);
  }, [courtId, venueId, searchParams]);

  useEffect(() => {
    // Calculate total amount based on duration and base price
    const basePrice = 600; // Base price per hour
    setTotalAmount(basePrice * selectedDuration);
  }, [selectedDuration]);

  const fetchVenueDetails = async () => {
    try {
      let response;
      
      // Try to fetch by venueId first (from venue page), then fallback to courtId
      if (venueId) {
        response = await axios.get(`/api/facilities/${venueId}`);
        setFacility(response.data);
        
        // Set up court data from facility
        setCourt({
          _id: 'default-court',
          name: 'Court 1',
          sport: response.data.sportsSupported?.[0] || 'Badminton',
          pricePerHour: response.data.pricePerHour || 600
        });
      } else if (courtId) {
        response = await axios.get(`/api/courts/${courtId}`);
        setCourt(response.data.court);
        setFacility(response.data.facility);
      } else {
        throw new Error('No venue or court ID provided');
      }

      // Set available courts - in real app this would come from API
      setAvailableCourts([
        { id: 'court-1', name: 'Court 1' },
        { id: 'court-2', name: 'Court 2' },
        { id: 'table-1', name: 'Table 1' },
        { id: 'table-2', name: 'Table 2' }
      ]);
      
    } catch (error) {
      console.error('Error fetching venue details:', error);
      
      // Fallback: Try to get venue data from search params or session storage
      const venueName = searchParams.get('venueName') || 
                       sessionStorage.getItem('selectedVenueName') || 
                       'SBR Badminton';
      const venueAddress = searchParams.get('venueAddress') || 
                          sessionStorage.getItem('selectedVenueAddress') || 
                          'Satellite, Jodhpur Village';
      const venueRating = searchParams.get('venueRating') || '4.5';
      const venueRatingCount = searchParams.get('venueRatingCount') || '6';
      const venueSport = searchParams.get('venueSport') || 'Badminton';
      
      // Set facility data from params or defaults
      setFacility({
        _id: venueId || 'facility1',
        name: venueName,
        address: venueAddress,
        rating: { 
          average: parseFloat(venueRating), 
          count: parseInt(venueRatingCount) 
        },
        sports: [venueSport],
        sportsSupported: [venueSport.toLowerCase()]
      });
      
      setCourt({
        _id: courtId || 'default-court',
        name: 'Court 1',
        sport: venueSport,
        pricePerHour: 600
      });

      setAvailableCourts([
        { id: 'court-1', name: 'Court 1' },
        { id: 'court-2', name: 'Court 2' },
        { id: 'table-1', name: 'Table 1' },
        { id: 'table-2', name: 'Table 2' }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const timeSlots = [
    '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
    '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM',
    '05:00 PM', '06:00 PM', '07:00 PM', '08:00 PM'
  ];

  const handleContinueToPayment = () => {
    if (!selectedDate || !selectedTime || !selectedCourt) {
      alert('Please fill in all required fields');
      return;
    }
    
    // Store booking details for potential API call
    const bookingDetails = {
      facilityId: facility._id,
      facilityName: facility.name,
      sport: facility.sports?.[0] || 'Badminton',
      date: selectedDate,
      time: selectedTime,
      duration: selectedDuration,
      court: selectedCourt,
      totalAmount,
      userEmail: user?.email,
      userId: user?._id
    };
    
    console.log('Booking details:', bookingDetails);
    
    // In a real application, you would send this to your booking API
    // For now, show confirmation
    alert(`Booking confirmed for ${facility.name}!\nSport: ${facility.sports?.[0] || 'Badminton'}\nDate: ${selectedDate}\nTime: ${selectedTime}\nDuration: ${selectedDuration} Hr\nCourt: ${availableCourts.find(c => c.id === selectedCourt)?.name}\nTotal: ₹${totalAmount}.00`);
    
    // Optionally navigate to booking confirmation page
    // navigate('/booking-confirmation', { state: bookingDetails });
  };

  const getSportIcon = (sport) => {
    const sportIcons = {
      'badminton': '🏸',
      'basketball': '🏀',
      'tennis': '🎾',
      'football': '⚽',
      'cricket': '🏏',
      'volleyball': '🏐',
      'table tennis': '🏓',
      'swimming': '🏊‍♂️'
    };
    return sportIcons[sport.toLowerCase()] || '🏸';
  };

  if (loading) {
    return (
      <div className="booking-container">
        <div className="booking-loading">Loading venue details...</div>
      </div>
    );
  }

  if (!facility) {
    return (
      <div className="booking-container">
        <div className="booking-error">Venue not found</div>
      </div>
    );
  }

  return (
    <div className="booking-container">
      <div className="booking-card">
        {/* Header */}
        <div className="booking-header-new">
          <h1 className="booking-title">Court Booking</h1>
        </div>

        {/* Venue Info */}
        <div className="venue-info-card">
          <h2 className="venue-name">{facility?.name || 'Loading...'}</h2>
          <div className="venue-details">
            <span className="venue-location">
              📍 {facility?.address || 'Loading address...'}
            </span>
            <span className="venue-rating">
              ⭐ {facility?.rating?.average || '0.0'} ({facility?.rating?.count || '0'})
            </span>
          </div>
        </div>

        {/* Booking Form */}
        <div className="booking-form">
          {/* Sport Selection */}
          <div className="form-group">
            <label className="form-label">Sport</label>
            <div className="sport-select-container">
              <select className="form-select sport-select" value={facility.sports?.[0] || 'Badminton'} disabled>
                {facility.sports?.map(sport => (
                  <option key={sport} value={sport}>
                    {getSportIcon(sport)} {sport}
                  </option>
                )) || <option value="Badminton">🏸 Badminton</option>}
              </select>
            </div>
          </div>

          {/* Date Selection */}
          <div className="form-group">
            <label className="form-label">Date</label>
            <div className="date-input-container">
              <input
                type="date"
                className="form-input date-input"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
              />
              <span className="date-icon">📅</span>
            </div>
          </div>

          {/* Start Time */}
          <div className="form-group">
            <label className="form-label">Start Time</label>
            <div className="time-select-container">
              <select 
                className="form-select time-select" 
                value={selectedTime}
                onChange={(e) => setSelectedTime(e.target.value)}
              >
                {timeSlots.map(time => (
                  <option key={time} value={time}>{time}</option>
                ))}
              </select>
              <span className="time-icon">🕐</span>
            </div>
          </div>

          {/* Duration */}
          <div className="form-group">
            <label className="form-label">Duration</label>
            <div className="duration-container">
              <button 
                className="duration-btn minus"
                onClick={() => selectedDuration > 1 && setSelectedDuration(selectedDuration - 1)}
                disabled={selectedDuration <= 1}
              >
                ➖
              </button>
              <span className="duration-display">{selectedDuration} Hr</span>
              <button 
                className="duration-btn plus"
                onClick={() => setSelectedDuration(selectedDuration + 1)}
              >
                ➕
              </button>
            </div>
          </div>

          {/* Court Selection */}
          <div className="form-group">
            <label className="form-label">Court</label>
            <div className="court-select-container">
              <select 
                className="form-select court-select" 
                value={selectedCourt}
                onChange={(e) => setSelectedCourt(e.target.value)}
              >
                <option value="">--Select Court--</option>
                {availableCourts.map(court => (
                  <option key={court.id} value={court.id}>{court.name}</option>
                ))}
              </select>
            </div>
            
            {/* Selected Courts Display */}
            {selectedCourt && (
              <div className="selected-courts">
                <span className="court-tag">
                  {availableCourts.find(c => c.id === selectedCourt)?.name}
                  <button 
                    className="remove-court"
                    onClick={() => setSelectedCourt('')}
                  >
                    ✕
                  </button>
                </span>
              </div>
            )}
          </div>

          {/* Continue Button */}
          <button 
            className="continue-payment-btn"
            onClick={handleContinueToPayment}
            disabled={!selectedCourt || submitting}
          >
            Continue to Payment - ₹{totalAmount}.00
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookCourt;
