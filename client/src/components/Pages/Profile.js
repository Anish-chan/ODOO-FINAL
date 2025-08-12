import React, { useState, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import './Profile.css';

const Profile = () => {
  const { user } = useAuth();
  const fileInputRef = useRef(null);
  
  const [activeTab, setActiveTab] = useState('profile');
  const [profileData, setProfileData] = useState({
    fullName: 'Mitchell Admin',
    email: 'mitchelladmin2017@gmail.com',
    phone: '9999999999',
    profilePicture: null
  });
  
  const [passwordData, setPasswordData] = useState({
    oldPassword: '',
    newPassword: ''
  });

  // Mock bookings data
  const [bookings] = useState([
    {
      id: 1,
      venue: 'Skyline Badminton Court (Badminton)',
      date: '18 June 2024',
      time: '5:00 PM - 6:00 PM',
      location: 'Rajkot, Gujarat',
      status: 'Confirmed',
      type: 'current'
    },
    {
      id: 2,
      venue: 'Skyline Badminton Court (Badminton)',
      date: '10 June 2024',
      time: '5:00 PM - 6:00 PM',
      location: 'Rajkot, Gujarat',
      status: 'Confirmed',
      type: 'past'
    }
  ]);

  const handleProfilePictureClick = () => {
    fileInputRef.current?.click();
  };

  const handleProfilePictureChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfileData(prev => ({
          ...prev,
          profilePicture: e.target.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProfileChange = (field, value) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePasswordChange = (field, value) => {
    setPasswordData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSaveProfile = () => {
    console.log('Saving profile:', profileData);
    // Add API call here
  };

  const handleResetProfile = () => {
    setProfileData({
      fullName: 'Mitchell Admin',
      email: 'mitchelladmin2017@gmail.com',
      phone: '9999999999',
      profilePicture: null
    });
    setPasswordData({
      oldPassword: '',
      newPassword: ''
    });
  };

  const handleCancelBooking = (bookingId) => {
    console.log('Canceling booking:', bookingId);
    // Add API call here
  };

  const handleWriteReview = (bookingId) => {
    console.log('Writing review for booking:', bookingId);
    // Add navigation to review page
  };

  const renderProfileTab = () => (
    <div className="profile-content">
      <div className="profile-left">
        <div className="profile-picture-section">
          <div className="profile-picture-container" onClick={handleProfilePictureClick}>
            {profileData.profilePicture ? (
              <img src={profileData.profilePicture} alt="Profile" className="profile-picture" />
            ) : (
              <div className="profile-picture-placeholder">
                <span>📷</span>
              </div>
            )}
            <div className="profile-picture-overlay">
              <span>Change Photo</span>
            </div>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleProfilePictureChange}
            style={{ display: 'none' }}
          />
          <h3>{profileData.fullName}</h3>
          <p>{profileData.phone}</p>
          <p>{profileData.email}</p>
        </div>
        
        <button 
          className="edit-profile-btn"
          onClick={() => setActiveTab('edit')}
        >
          Edit Profile
        </button>
        
        <button 
          className="all-bookings-btn"
          onClick={() => setActiveTab('bookings')}
        >
          All Bookings
        </button>
      </div>
      
      <div className="profile-right">
        {activeTab === 'bookings' ? (
          <>
            <div className="tab-buttons">
              <button 
                className="tab-btn active"
                onClick={() => setActiveTab('bookings')}
              >
                All Bookings
              </button>
              <button className="tab-btn cancelled">
                Cancelled
              </button>
            </div>
            
            <div className="bookings-list">
              {bookings.map(booking => (
                <div key={booking.id} className="booking-card">
                  <div className="booking-header">
                    <h4>📍 {booking.venue}</h4>
                  </div>
                  <div className="booking-details">
                    <p>📅 {booking.date}</p>
                    <p>🕐 {booking.time}</p>
                    <p>📍 {booking.location}</p>
                    <div className="booking-status">
                      <span className="status-badge confirmed">✅ {booking.status}</span>
                    </div>
                  </div>
                  <div className="booking-actions">
                    {booking.type === 'current' && (
                      <button 
                        className="cancel-btn"
                        onClick={() => handleCancelBooking(booking.id)}
                      >
                        Cancel Booking
                      </button>
                    )}
                    <button 
                      className="review-btn"
                      onClick={() => handleWriteReview(booking.id)}
                    >
                      Write Review
                    </button>
                  </div>
                </div>
              ))}
              {bookings.length === 0 && (
                <div className="no-bookings">
                  <p>No cancel booking button for past dates</p>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="profile-welcome">
            <p>Click "All Bookings" to view your booking history</p>
          </div>
        )}
      </div>
    </div>
  );

  const renderEditTab = () => (
    <div className="edit-profile-content">
      <div className="edit-left">
        <div className="profile-picture-section">
          <div className="profile-picture-container" onClick={handleProfilePictureClick}>
            {profileData.profilePicture ? (
              <img src={profileData.profilePicture} alt="Profile" className="profile-picture" />
            ) : (
              <div className="profile-picture-placeholder">
                <span>📷</span>
              </div>
            )}
            <div className="profile-picture-overlay">
              <span>Change Photo</span>
            </div>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleProfilePictureChange}
            style={{ display: 'none' }}
          />
          <h3>{profileData.fullName}</h3>
          <p>{profileData.phone}</p>
          <p>{profileData.email}</p>
        </div>
        
        <button 
          className="all-bookings-btn"
          onClick={() => setActiveTab('bookings')}
        >
          All Bookings
        </button>
      </div>
      
      <div className="edit-right">
        <div className="edit-form">
          <div className="form-group">
            <label>Full Name</label>
            <input
              type="text"
              value={profileData.fullName}
              onChange={(e) => handleProfileChange('fullName', e.target.value)}
              className="form-control"
            />
          </div>
          
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={profileData.email}
              onChange={(e) => handleProfileChange('email', e.target.value)}
              className="form-control"
            />
          </div>
          
          <div className="form-group">
            <label>Old Password</label>
            <div className="password-input">
              <input
                type="password"
                value={passwordData.oldPassword}
                onChange={(e) => handlePasswordChange('oldPassword', e.target.value)}
                className="form-control"
              />
              <span className="password-toggle">👁</span>
            </div>
          </div>
          
          <div className="form-group">
            <label>New Password</label>
            <div className="password-input">
              <input
                type="password"
                value={passwordData.newPassword}
                onChange={(e) => handlePasswordChange('newPassword', e.target.value)}
                className="form-control"
              />
              <span className="password-toggle">👁</span>
            </div>
          </div>
          
          <div className="form-actions">
            <button className="reset-btn" onClick={handleResetProfile}>
              Reset
            </button>
            <button className="save-btn" onClick={handleSaveProfile}>
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="profile-page">
      <div className="profile-header">
        <div className="header-left">
          <h1>QUICKCOURT</h1>
        </div>
        <div className="header-right">
          <button className="book-btn">📖 Book</button>
          <span className="user-info">👤 Mitchell Admin</span>
        </div>
      </div>
      <div className="profile-container">
        <h2 className="page-title">Profile Page</h2>
        
        {activeTab === 'edit' ? renderEditTab() : renderProfileTab()}
      </div>
    </div>
  );
};

export default Profile;
