import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';

const BookCourt = () => {
  const { courtId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [court, setCourt] = useState(null);
  const [facility, setFacility] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('');
  const [availableSlots, setAvailableSlots] = useState([]);
  const [bookingData, setBookingData] = useState({
    duration: 1,
    totalAmount: 0,
    notes: ''
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [step, setStep] = useState(1); // 1: Select Time, 2: Confirm Details, 3: Payment

  useEffect(() => {
    fetchCourtDetails();
    
    // Get initial values from URL params
    const urlDate = searchParams.get('date');
    const urlTime = searchParams.get('time');
    
    if (urlDate) {
      setSelectedDate(urlDate);
    } else {
      // Set default date to tomorrow
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      setSelectedDate(tomorrow.toISOString().split('T')[0]);
    }
    
    if (urlTime) {
      setSelectedTimeSlot(urlTime);
    }
  }, [courtId, searchParams]);

  useEffect(() => {
    if (selectedDate && court) {
      fetchAvailability();
    }
  }, [selectedDate, court]);

  useEffect(() => {
    if (court && bookingData.duration) {
      setBookingData(prev => ({
        ...prev,
        totalAmount: court.pricePerHour * bookingData.duration
      }));
    }
  }, [court, bookingData.duration]);

  const fetchCourtDetails = async () => {
    try {
      const response = await axios.get(`/api/courts/${courtId}`);
      setCourt(response.data.court);
      setFacility(response.data.facility);
    } catch (error) {
      console.error('Error fetching court details:', error);
      // For demo purposes, set dummy data
      setCourt({
        _id: courtId,
        name: 'Basketball Court A',
        sport: 'Basketball',
        pricePerHour: 50,
        capacity: 10,
        features: ['Indoor', 'Air Conditioned', 'Professional Lighting'],
        operatingHours: {
          start: '06:00',
          end: '23:00'
        }
      });
      
      setFacility({
        _id: 'facility1',
        name: 'Downtown Sports Complex',
        address: '123 Main St, City Center',
        phone: '+1 (555) 123-4567'
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchAvailability = async () => {
    try {
      const response = await axios.get(`/api/courts/${courtId}/availability`, {
        params: { date: selectedDate }
      });
      setAvailableSlots(response.data.availableSlots);
    } catch (error) {
      console.error('Error fetching availability:', error);
      // For demo purposes, set dummy availability
      setAvailableSlots([
        { start: '09:00', end: '10:00' },
        { start: '10:00', end: '11:00' },
        { start: '11:00', end: '12:00' },
        { start: '14:00', end: '15:00' },
        { start: '15:00', end: '16:00' },
        { start: '16:00', end: '17:00' },
        { start: '18:00', end: '19:00' },
        { start: '19:00', end: '20:00' }
      ]);
    }
  };

  const handleTimeSlotSelect = (slot) => {
    setSelectedTimeSlot(`${slot.start}-${slot.end}`);
    setStep(2);
  };

  const handleBookingSubmit = async () => {
    if (!selectedTimeSlot || !selectedDate) {
      alert('Please select a date and time slot');
      return;
    }

    setSubmitting(true);
    
    try {
      const [startTime, endTime] = selectedTimeSlot.split('-');
      
      const bookingPayload = {
        courtId: court._id,
        date: selectedDate,
        timeSlot: {
          start: startTime,
          end: endTime
        },
        duration: bookingData.duration,
        totalAmount: bookingData.totalAmount,
        notes: bookingData.notes
      };

      const token = localStorage.getItem('token');
      const response = await axios.post('/api/bookings', bookingPayload, {
        headers: { Authorization: `Bearer ${token}` }
      });

      alert('Booking confirmed successfully!');
      navigate('/my-bookings');
    } catch (error) {
      console.error('Error creating booking:', error);
      
      // For demo purposes, simulate successful booking
      setTimeout(() => {
        alert('Demo booking confirmed successfully!');
        navigate('/my-bookings');
      }, 1000);
    } finally {
      setSubmitting(false);
    }
  };

  const getEndTime = (startTime, duration) => {
    const [hours, minutes] = startTime.split(':').map(Number);
    const endHours = hours + duration;
    return `${endHours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="container">
        <div className="loading">Loading court details...</div>
      </div>
    );
  }

  if (!court) {
    return (
      <div className="container">
        <div className="error">Court not found</div>
      </div>
    );
  }

  return (
    <div className="book-court">
      <div className="container">
        {/* Header */}
        <div className="booking-header">
          <button onClick={() => navigate(-1)} className="back-btn">
            ← Back
          </button>
          <h1>Book {court.name}</h1>
          <div className="facility-info">
            <h3>{facility.name}</h3>
            <p>{facility.address}</p>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="booking-steps">
          <div className={`step ${step >= 1 ? 'active' : ''}`}>
            <div className="step-number">1</div>
            <div className="step-label">Select Time</div>
          </div>
          <div className={`step ${step >= 2 ? 'active' : ''}`}>
            <div className="step-number">2</div>
            <div className="step-label">Confirm Details</div>
          </div>
          <div className={`step ${step >= 3 ? 'active' : ''}`}>
            <div className="step-number">3</div>
            <div className="step-label">Payment</div>
          </div>
        </div>

        <div className="booking-content">
          {/* Court Information */}
          <div className="court-summary">
            <h3>Court Information</h3>
            <div className="court-details">
              <div className="detail-row">
                <span className="label">Court:</span>
                <span className="value">{court.name}</span>
              </div>
              <div className="detail-row">
                <span className="label">Sport:</span>
                <span className="value">{court.sport}</span>
              </div>
              <div className="detail-row">
                <span className="label">Price:</span>
                <span className="value">₹{court.pricePerHour}/hour</span>
              </div>
              <div className="detail-row">
                <span className="label">Capacity:</span>
                <span className="value">{court.capacity} players</span>
              </div>
            </div>
            
            <div className="court-features">
              <strong>Features:</strong>
              <div className="features-list">
                {court.features.map((feature, index) => (
                  <span key={index} className="feature-tag">{feature}</span>
                ))}
              </div>
            </div>
          </div>

          {/* Step 1: Time Selection */}
          {step === 1 && (
            <div className="time-selection">
              <h3>Select Date & Time</h3>
              
              <div className="date-selector">
                <label htmlFor="booking-date">Date:</label>
                <input
                  id="booking-date"
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>

              <div className="available-slots">
                <h4>Available Time Slots</h4>
                {availableSlots.length > 0 ? (
                  <div className="slots-grid">
                    {availableSlots.map((slot, index) => (
                      <button
                        key={index}
                        className={`slot-btn ${selectedTimeSlot === `${slot.start}-${slot.end}` ? 'selected' : ''}`}
                        onClick={() => handleTimeSlotSelect(slot)}
                      >
                        {slot.start} - {slot.end}
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="no-slots">
                    No available slots for selected date
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Step 2: Booking Details */}
          {step === 2 && (
            <div className="booking-details">
              <h3>Confirm Booking Details</h3>
              
              <div className="booking-summary">
                <div className="summary-row">
                  <span className="label">Date:</span>
                  <span className="value">
                    {new Date(selectedDate).toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </span>
                </div>
                <div className="summary-row">
                  <span className="label">Time:</span>
                  <span className="value">{selectedTimeSlot}</span>
                </div>
                <div className="summary-row">
                  <span className="label">Duration:</span>
                  <span className="value">
                    <select
                      value={bookingData.duration}
                      onChange={(e) => setBookingData({
                        ...bookingData,
                        duration: parseInt(e.target.value)
                      })}
                    >
                      <option value={1}>1 hour</option>
                      <option value={2}>2 hours</option>
                      <option value={3}>3 hours</option>
                    </select>
                  </span>
                </div>
                <div className="summary-row total">
                  <span className="label">Total Amount:</span>
                  <span className="value">₹{bookingData.totalAmount}</span>
                </div>
              </div>

              <div className="notes-section">
                <label htmlFor="booking-notes">Additional Notes (Optional):</label>
                <textarea
                  id="booking-notes"
                  value={bookingData.notes}
                  onChange={(e) => setBookingData({
                    ...bookingData,
                    notes: e.target.value
                  })}
                  placeholder="Any special requirements or notes..."
                  rows={3}
                />
              </div>

              <div className="booking-actions">
                <button 
                  onClick={() => setStep(1)}
                  className="btn btn-outline"
                >
                  Back to Time Selection
                </button>
                <button 
                  onClick={() => setStep(3)}
                  className="btn btn-primary"
                >
                  Proceed to Payment
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Payment */}
          {step === 3 && (
            <div className="payment-section">
              <h3>Payment</h3>
              
              <div className="payment-summary">
                <h4>Booking Summary</h4>
                <div className="final-summary">
                  <div className="summary-item">
                    <span>Court:</span>
                    <span>{court.name}</span>
                  </div>
                  <div className="summary-item">
                    <span>Date:</span>
                    <span>{new Date(selectedDate).toLocaleDateString()}</span>
                  </div>
                  <div className="summary-item">
                    <span>Time:</span>
                    <span>{selectedTimeSlot}</span>
                  </div>
                  <div className="summary-item">
                    <span>Duration:</span>
                    <span>{bookingData.duration} hour(s)</span>
                  </div>
                  <div className="summary-item total">
                    <span>Total Amount:</span>
                    <span>₹{bookingData.totalAmount}</span>
                  </div>
                </div>
              </div>

              <div className="payment-method">
                <h4>Payment Method</h4>
                <div className="demo-payment">
                  <div className="payment-info">
                    <p><strong>Demo Mode:</strong> This is a demonstration. No actual payment will be processed.</p>
                    <p>In a real application, you would integrate with payment gateways like Razorpay, Stripe, or PayPal.</p>
                  </div>
                </div>
              </div>

              <div className="booking-actions">
                <button 
                  onClick={() => setStep(2)}
                  className="btn btn-outline"
                  disabled={submitting}
                >
                  Back to Details
                </button>
                <button 
                  onClick={handleBookingSubmit}
                  className="btn btn-primary"
                  disabled={submitting}
                >
                  {submitting ? 'Processing...' : 'Confirm Booking'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookCourt;
