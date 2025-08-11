import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import API from '../../api/axiosConfig';
import './FacilityManagement.css';

const MyFacilitiesFixed = () => {
  const [facilities, setFacilities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingFacility, setEditingFacility] = useState(null);
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      coordinates: { lat: 0, lng: 0 }
    },
    sportsSupported: [],
    amenities: [],
    photos: [],
    operatingHours: {
      monday: { open: '09:00', close: '21:00', isOpen: true },
      tuesday: { open: '09:00', close: '21:00', isOpen: true },
      wednesday: { open: '09:00', close: '21:00', isOpen: true },
      thursday: { open: '09:00', close: '21:00', isOpen: true },
      friday: { open: '09:00', close: '21:00', isOpen: true },
      saturday: { open: '08:00', close: '22:00', isOpen: true },
      sunday: { open: '08:00', close: '22:00', isOpen: true }
    }
  });

  const availableSports = ['badminton', 'tennis', 'basketball', 'football', 'cricket', 'volleyball'];
  const commonAmenities = ['Parking', 'Locker Rooms', 'Showers', 'Equipment Rental', 'Cafeteria', 'WiFi', 'Air Conditioning', 'First Aid', 'Spectator Seating'];

  useEffect(() => {
    fetchMyFacilities();
  }, []);

  const fetchMyFacilities = async () => {
    try {
      const response = await API.get('/api/facilities/owner/my-facilities');
      setFacilities(response.data);
    } catch (error) {
      console.error('Error fetching facilities:', error);
      // Demo data for testing
      setFacilities([
        {
          _id: '1',
          name: 'Downtown Sports Complex',
          description: 'Premier sports facility in the city center with state-of-the-art equipment and professional courts.',
          address: { street: '123 Main St', city: 'Metro City', state: 'CA', zipCode: '12345' },
          sportsSupported: ['basketball', 'tennis'],
          amenities: ['Parking', 'Locker Rooms', 'WiFi'],
          status: 'approved',
          totalCourts: 5,
          activeCourts: 5,
          createdAt: '2024-01-01',
          adminComments: 'Great facility with excellent maintenance!',
          revenue: 15420,
          bookingsThisMonth: 45,
          rating: 4.8,
          images: ['court1.jpg', 'court2.jpg']
        },
        {
          _id: '2',
          name: 'Elite Badminton Center',
          description: 'Professional badminton courts with modern equipment and air conditioning for optimal playing conditions.',
          address: { street: '456 Oak Ave', city: 'Metro City', state: 'CA', zipCode: '12346' },
          sportsSupported: ['badminton'],
          amenities: ['Equipment Rental', 'Showers', 'Air Conditioning'],
          status: 'pending',
          totalCourts: 3,
          activeCourts: 3,
          createdAt: '2024-01-15',
          adminComments: '',
          revenue: 0,
          bookingsThisMonth: 0,
          rating: 0,
          images: []
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      approved: { class: 'status-approved', icon: '✅', text: 'Approved' },
      pending: { class: 'status-pending', icon: '⏳', text: 'Pending Review' },
      rejected: { class: 'status-rejected', icon: '❌', text: 'Rejected' }
    };
    
    const config = statusConfig[status] || statusConfig.pending;
    
    return (
      <span className={`status-badge ${config.class}`}>
        <span className="status-icon">{config.icon}</span>
        {config.text}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="my-facilities-container">
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <h3>Loading your facilities...</h3>
          <p>Please wait while we fetch your facility data</p>
        </div>
      </div>
    );
  }

  return (
    <div className="my-facilities-container">
      {/* Header Section */}
      <div className="facilities-header">
        <div className="header-content">
          <div className="header-text">
            <h1>My Facilities</h1>
            <p>Manage and monitor your sports facilities</p>
          </div>
          <button 
            onClick={() => setShowForm(!showForm)}
            className="add-facility-btn"
          >
            <span className="btn-icon">+</span>
            {showForm ? 'Cancel' : 'Add New Facility'}
          </button>
        </div>
      </div>

      {/* Facilities List */}
      <div className="facilities-content">
        {facilities.length === 0 ? (
          <div className="no-facilities">
            <div className="no-facilities-icon">🏟️</div>
            <h3>No facilities yet</h3>
            <p>Create your first facility to get started!</p>
          </div>
        ) : (
          <div className="facilities-grid grid">
            {facilities.map(facility => (
              <div key={facility._id} className="facility-card grid">
                <div className="facility-card-header">
                  <div className="facility-image">
                    {facility.images && facility.images.length > 0 ? (
                      <img src={`/api/uploads/${facility.images[0]}`} alt={facility.name} />
                    ) : (
                      <div className="placeholder-image">
                        <span>🏟️</span>
                      </div>
                    )}
                    <div className="facility-status-overlay">
                      {getStatusBadge(facility.status)}
                    </div>
                  </div>
                  
                  <div className="facility-info">
                    <h3 className="facility-name">{facility.name}</h3>
                    <p className="facility-address">
                      📍 {facility.address.street}, {facility.address.city}, {facility.address.state}
                    </p>
                    <div className="facility-sports">
                      {facility.sportsSupported.map(sport => (
                        <span key={sport} className="sport-tag">{sport}</span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="facility-description">
                  <p>{facility.description}</p>
                </div>

                {facility.status === 'approved' && (
                  <div className="facility-metrics">
                    <div className="metric">
                      <span className="metric-icon">💰</span>
                      <div className="metric-content">
                        <span className="metric-value">${facility.revenue?.toLocaleString() || '0'}</span>
                        <span className="metric-label">Revenue</span>
                      </div>
                    </div>
                    <div className="metric">
                      <span className="metric-icon">📅</span>
                      <div className="metric-content">
                        <span className="metric-value">{facility.bookingsThisMonth || 0}</span>
                        <span className="metric-label">Bookings</span>
                      </div>
                    </div>
                    <div className="metric">
                      <span className="metric-icon">⭐</span>
                      <div className="metric-content">
                        <span className="metric-value">{facility.rating ? facility.rating.toFixed(1) : 'N/A'}</span>
                        <span className="metric-label">Rating</span>
                      </div>
                    </div>
                    <div className="metric">
                      <span className="metric-icon">🏟️</span>
                      <div className="metric-content">
                        <span className="metric-value">{facility.totalCourts || 0}</span>
                        <span className="metric-label">Courts</span>
                      </div>
                    </div>
                  </div>
                )}

                <div className="facility-amenities">
                  <h4>Amenities:</h4>
                  <div className="amenities-list">
                    {facility.amenities.map(amenity => (
                      <span key={amenity} className="amenity-tag">{amenity}</span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyFacilitiesFixed;
