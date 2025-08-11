import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, upcoming, past, cancelled
  const { user } = useAuth();

  useEffect(() => {
    fetchMyBookings();
  }, []);

  const fetchMyBookings = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/bookings/my-bookings', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setBookings(response.data);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      // For demo purposes, set some dummy data
      setBookings([
        {
          _id: '1',
          facility: {
            name: 'Downtown Sports Complex',
            address: '123 Main St, City Center'
          },
          court: {
            name: 'Basketball Court A',
            sport: 'Basketball'
          },
          date: '2024-01-20',
          timeSlot: {
            start: '09:00',
            end: '10:00'
          },
          totalAmount: 50,
          status: 'confirmed',
          bookingDate: '2024-01-15T10:30:00Z'
        },
        {
          _id: '2',
          facility: {
            name: 'Elite Tennis Club',
            address: '456 Oak Ave, Sports District'
          },
          court: {
            name: 'Tennis Court 2',
            sport: 'Tennis'
          },
          date: '2024-01-25',
          timeSlot: {
            start: '14:00',
            end: '15:30'
          },
          totalAmount: 75,
          status: 'confirmed',
          bookingDate: '2024-01-18T15:45:00Z'
        },
        {
          _id: '3',
          facility: {
            name: 'City Badminton Center',
            address: '789 Pine St, Recreation Area'
          },
          court: {
            name: 'Badminton Court 1',
            sport: 'Badminton'
          },
          date: '2024-01-10',
          timeSlot: {
            start: '18:00',
            end: '19:00'
          },
          totalAmount: 30,
          status: 'completed',
          bookingDate: '2024-01-08T12:20:00Z'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const cancelBooking = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.put(`/api/bookings/${bookingId}/cancel`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Update the booking status locally
      setBookings(bookings.map(booking => 
        booking._id === bookingId 
          ? { ...booking, status: 'cancelled' }
          : booking
      ));
      
      alert('Booking cancelled successfully!');
    } catch (error) {
      console.error('Error cancelling booking:', error);
      alert('Failed to cancel booking. Please try again.');
    }
  };

  const getStatusBadge = (status) => {
    const statusClasses = {
      confirmed: 'status-confirmed',
      completed: 'status-completed',
      cancelled: 'status-cancelled',
      pending: 'status-pending'
    };
    
    return (
      <span className={`status-badge ${statusClasses[status]}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const isUpcoming = (date, timeSlot) => {
    const bookingDateTime = new Date(`${date} ${timeSlot.start}`);
    return bookingDateTime > new Date();
  };

  const canCancel = (booking) => {
    return booking.status === 'confirmed' && isUpcoming(booking.date, booking.timeSlot);
  };

  const filteredBookings = bookings.filter(booking => {
    if (filter === 'all') return true;
    if (filter === 'upcoming') return booking.status === 'confirmed' && isUpcoming(booking.date, booking.timeSlot);
    if (filter === 'past') return booking.status === 'completed' || !isUpcoming(booking.date, booking.timeSlot);
    if (filter === 'cancelled') return booking.status === 'cancelled';
    return true;
  });

  if (loading) {
    return (
      <div className="container">
        <div className="loading">Loading your bookings...</div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="my-bookings">
        <div className="page-header">
          <h1>My Bookings</h1>
          <p>Manage all your court reservations</p>
        </div>

        {/* Filter Tabs */}
        <div className="filter-tabs">
          <button 
            className={filter === 'all' ? 'tab active' : 'tab'}
            onClick={() => setFilter('all')}
          >
            All Bookings ({bookings.length})
          </button>
          <button 
            className={filter === 'upcoming' ? 'tab active' : 'tab'}
            onClick={() => setFilter('upcoming')}
          >
            Upcoming ({bookings.filter(b => b.status === 'confirmed' && isUpcoming(b.date, b.timeSlot)).length})
          </button>
          <button 
            className={filter === 'past' ? 'tab active' : 'tab'}
            onClick={() => setFilter('past')}
          >
            Past ({bookings.filter(b => b.status === 'completed' || !isUpcoming(b.date, b.timeSlot)).length})
          </button>
          <button 
            className={filter === 'cancelled' ? 'tab active' : 'tab'}
            onClick={() => setFilter('cancelled')}
          >
            Cancelled ({bookings.filter(b => b.status === 'cancelled').length})
          </button>
        </div>

        {/* Bookings List */}
        {filteredBookings.length === 0 ? (
          <div className="no-bookings">
            <div className="no-bookings-icon">📅</div>
            <h3>No bookings found</h3>
            <p>
              {filter === 'all' 
                ? "You haven't made any bookings yet. Start by browsing venues!" 
                : `No ${filter} bookings found.`
              }
            </p>
            <a href="/venues" className="btn btn-primary">Browse Venues</a>
          </div>
        ) : (
          <div className="bookings-list">
            {filteredBookings.map(booking => (
              <div key={booking._id} className="booking-card">
                <div className="booking-header">
                  <div className="facility-info">
                    <h3>{booking.facility.name}</h3>
                    <p className="facility-address">{booking.facility.address}</p>
                  </div>
                  <div className="booking-status">
                    {getStatusBadge(booking.status)}
                  </div>
                </div>

                <div className="booking-details">
                  <div className="detail-row">
                    <div className="detail-item">
                      <span className="detail-label">Court:</span>
                      <span className="detail-value">
                        {booking.court.name} ({booking.court.sport})
                      </span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Date:</span>
                      <span className="detail-value">
                        {new Date(booking.date).toLocaleDateString('en-US', {
                          weekday: 'short',
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </span>
                    </div>
                  </div>

                  <div className="detail-row">
                    <div className="detail-item">
                      <span className="detail-label">Time:</span>
                      <span className="detail-value">
                        {booking.timeSlot.start} - {booking.timeSlot.end}
                      </span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Amount:</span>
                      <span className="detail-value amount">
                        ₹{booking.totalAmount}
                      </span>
                    </div>
                  </div>

                  <div className="detail-row">
                    <div className="detail-item">
                      <span className="detail-label">Booked on:</span>
                      <span className="detail-value">
                        {new Date(booking.bookingDate).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="booking-actions">
                  <a 
                    href={`/venues/${booking.facility._id}`} 
                    className="btn btn-outline"
                  >
                    View Venue
                  </a>
                  
                  {canCancel(booking) && (
                    <button 
                      onClick={() => cancelBooking(booking._id)}
                      className="btn btn-danger"
                    >
                      Cancel Booking
                    </button>
                  )}
                  
                  {booking.status === 'completed' && (
                    <button className="btn btn-primary">
                      Leave Review
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Booking Summary */}
        {bookings.length > 0 && (
          <div className="booking-summary">
            <h3>Booking Summary</h3>
            <div className="summary-stats">
              <div className="summary-stat">
                <span className="stat-number">{bookings.length}</span>
                <span className="stat-label">Total Bookings</span>
              </div>
              <div className="summary-stat">
                <span className="stat-number">
                  ₹{bookings.filter(b => b.status !== 'cancelled').reduce((sum, b) => sum + b.totalAmount, 0)}
                </span>
                <span className="stat-label">Total Spent</span>
              </div>
              <div className="summary-stat">
                <span className="stat-number">
                  {bookings.filter(b => b.status === 'confirmed' && isUpcoming(b.date, b.timeSlot)).length}
                </span>
                <span className="stat-label">Upcoming</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBookings;
