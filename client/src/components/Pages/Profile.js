import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axiosConfig';

const Profile = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('all');
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    oldPassword: '',
    newPassword: ''
  });

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const response = await api.get('/bookings/my-bookings');
      if (response.data.success) {
        setBookings(response.data.bookings);
      }
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setProfileData({
      ...profileData,
      [e.target.name]: e.target.value
    });
  };

  const handleSave = async () => {
    try {
      // Handle profile update logic here
      console.log('Saving profile:', profileData);
      setEditMode(false);
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const filteredBookings = bookings.filter(booking => {
    if (activeTab === 'all') return true;
    if (activeTab === 'confirmed') return booking.status === 'confirmed';
    if (activeTab === 'cancelled') return booking.status === 'cancelled';
    return true;
  });

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (timeString) => {
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  return (
    <div className="profile-page">
      <div className="profile-container">
        {/* Left Sidebar - Profile Info */}
        <div className="profile-sidebar">
          <div className="profile-header">
            <div className="profile-avatar-large">
              {user?.name?.charAt(0).toUpperCase() || 'U'}
            </div>
            <h2 className="profile-name">{user?.name || 'User'}</h2>
            <p className="profile-email">{user?.email}</p>
          </div>

          <div className="profile-nav">
            <button 
              className={`profile-nav-btn ${editMode ? 'active' : ''}`}
              onClick={() => setEditMode(true)}
            >
              Edit Profile
            </button>
            <button 
              className={`profile-nav-btn ${!editMode ? 'active' : ''}`}
              onClick={() => setEditMode(false)}
            >
              All Bookings
            </button>
          </div>
        </div>

        {/* Right Content Area */}
        <div className="profile-content">
          {!editMode ? (
            // Bookings Section
            <div className="bookings-section">
              <div className="bookings-header">
                <h3>My Bookings</h3>
                <div className="booking-tabs">
                  <button 
                    className={`tab-btn ${activeTab === 'all' ? 'active' : ''}`}
                    onClick={() => setActiveTab('all')}
                  >
                    All Bookings
                  </button>
                  <button 
                    className={`tab-btn ${activeTab === 'confirmed' ? 'active' : ''}`}
                    onClick={() => setActiveTab('confirmed')}
                  >
                    Confirmed
                  </button>
                </div>
              </div>

              <div className="bookings-list">
                {loading ? (
                  <div className="loading-state">Loading bookings...</div>
                ) : filteredBookings.length > 0 ? (
                  filteredBookings.map((booking) => (
                    <div key={booking._id} className="booking-card">
                      <div className="booking-info">
                        <div className="booking-venue">
                          <span className="venue-icon">📍</span>
                          <span className="venue-name">
                            {booking.court?.facility?.name || 'Venue Name'}
                          </span>
                        </div>
                        <div className="booking-details">
                          <span className="booking-date">
                            📅 {formatDate(booking.date)}
                          </span>
                          <span className="booking-time">
                            🕐 {formatTime(booking.startTime)} - {formatTime(booking.endTime)}
                          </span>
                          <span className="booking-location">
                            📍 {booking.court?.facility?.address?.city || 'Location'}
                          </span>
                        </div>
                      </div>
                      <div className="booking-actions">
                        <span className={`booking-status ${booking.status}`}>
                          {booking.status === 'confirmed' ? '✅ Confirmed' : 
                           booking.status === 'cancelled' ? '❌ Cancelled' : 
                           booking.status}
                        </span>
                        <div className="booking-buttons">
                          <button className="btn-cancel">Cancel Booking</button>
                          <button className="btn-review">Write Review</button>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="empty-state">
                    <p>No bookings found.</p>
                    <button className="btn-cancel">Book a venue</button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            // Edit Profile Section
            <div className="edit-profile-section">
              <h3>Edit Profile</h3>
              <form className="edit-profile-form">
                <div className="form-group">
                  <label htmlFor="name">Full Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={profileData.name}
                    onChange={handleInputChange}
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={profileData.email}
                    onChange={handleInputChange}
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="phone">Phone (Optional)</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={profileData.phone}
                    onChange={handleInputChange}
                    className="form-input"
                    placeholder="Enter phone number"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="oldPassword">Old Password</label>
                  <input
                    type="password"
                    id="oldPassword"
                    name="oldPassword"
                    value={profileData.oldPassword}
                    onChange={handleInputChange}
                    className="form-input"
                    placeholder="Enter current password"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="newPassword">New Password</label>
                  <input
                    type="password"
                    id="newPassword"
                    name="newPassword"
                    value={profileData.newPassword}
                    onChange={handleInputChange}
                    className="form-input"
                    placeholder="Enter new password"
                  />
                </div>

                <div className="form-actions">
                  <button 
                    type="button" 
                    className="btn-reset"
                    onClick={() => setEditMode(false)}
                  >
                    Reset
                  </button>
                  <button 
                    type="button" 
                    className="btn-save"
                    onClick={handleSave}
                  >
                    Save
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
