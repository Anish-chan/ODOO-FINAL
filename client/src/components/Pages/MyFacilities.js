import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import API from '../../api/axiosConfig';
import './MyFacilitiesImproved.css';

const MyFacilities = () => {
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
    pricing: {
      hourlyRate: '',
      peakHourRate: '',
      currency: 'USD'
    },
    reviews: {
      rating: 0,
      totalReviews: 0,
      comments: []
    },
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
      // All facility owners use their own facilities endpoint
      const response = await API.get('/api/facilities/owner/my-facilities');
      setFacilities(response.data);
    } catch (error) {
      console.error('Error fetching facilities:', error);
      setFacilities([]);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSportsChange = (sport) => {
    setFormData(prev => ({
      ...prev,
      sportsSupported: prev.sportsSupported.includes(sport)
        ? prev.sportsSupported.filter(s => s !== sport)
        : [...prev.sportsSupported, sport]
    }));
  };

  const handleAmenitiesChange = (amenity) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }));
  };

  const handleOperatingHoursChange = (day, field, value) => {
    setFormData(prev => ({
      ...prev,
      operatingHours: {
        ...prev.operatingHours,
        [day]: {
          ...prev.operatingHours[day],
          [field]: value
        }
      }
    }));
  };

  const handlePricingChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      pricing: {
        ...prev.pricing,
        [field]: value
      }
    }));
  };

  const handlePhotoUpload = (e) => {
    const files = Array.from(e.target.files);
    const photoUrls = files.map(file => URL.createObjectURL(file));
    setFormData(prev => ({
      ...prev,
      photos: [...prev.photos, ...photoUrls]
    }));
  };

  const removePhoto = (index) => {
    setFormData(prev => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index)
    }));
  };

  const resetForm = () => {
    setFormData({
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
      pricing: {
        hourlyRate: '',
        peakHourRate: '',
        currency: 'USD'
      },
      reviews: {
        rating: 0,
        totalReviews: 0,
        comments: []
      },
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
    setEditingFacility(null);
    setShowForm(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.sportsSupported.length === 0) {
      alert('Please select at least one sport');
      return;
    }

    try {
      setLoading(true);
      
      // Sanitize data before sending
      const sanitizedData = {
        ...formData,
        pricing: {
          hourlyRate: formData.pricing.hourlyRate ? parseFloat(formData.pricing.hourlyRate) : 0,
          peakHourRate: formData.pricing.peakHourRate ? parseFloat(formData.pricing.peakHourRate) : 0,
          currency: formData.pricing.currency || 'USD'
        },
        reviews: {
          rating: formData.reviews.rating || 0,
          totalReviews: formData.reviews.totalReviews || 0,
          comments: formData.reviews.comments || []
        },
        photos: formData.photos.map(photo => {
          if (typeof photo === 'string') {
            return { url: photo, caption: '' };
          }
          return photo;
        })
      };
      
      if (editingFacility) {
        // Update existing facility
        await API.put(`/api/facilities/${editingFacility._id}`, sanitizedData);
        alert('Facility updated successfully!');
      } else {
        // Create new facility
        await API.post('/api/facilities', sanitizedData);
        alert('Facility created successfully!');
      }
      
      resetForm();
      await fetchMyFacilities(); // Refresh the list
    } catch (error) {
      console.error('Error saving facility:', error);
      
      // Better error handling
      let errorMessage = 'Error saving facility. Please try again.';
      
      if (error.response?.data?.errors) {
        errorMessage = `Validation errors: ${error.response.data.errors.join(', ')}`;
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      alert(`Error: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (facility) => {
    // Process photos to ensure they're in the right format for editing
    const processedPhotos = (facility.photos || []).map(photo => {
      if (typeof photo === 'object' && photo.url) {
        return photo.url; // Extract URL from object format
      }
      return photo; // Already a URL string
    });

    setFormData({
      name: facility.name,
      description: facility.description,
      address: facility.address,
      sportsSupported: facility.sportsSupported,
      amenities: facility.amenities,
      photos: processedPhotos,
      pricing: facility.pricing || { hourlyRate: '', peakHourRate: '', currency: 'USD' },
      reviews: facility.reviews || { rating: 0, totalReviews: 0, comments: [] },
      operatingHours: facility.operatingHours || formData.operatingHours
    });
    setEditingFacility(facility);
    setShowForm(true);
  };

  const handleDelete = async (facilityId) => {
    if (!window.confirm('Are you sure you want to delete this facility?')) {
      return;
    }

    try {
      // Delete facility
      await API.delete(`/api/facilities/${facilityId}`);
      alert('Facility deleted successfully!');
      fetchMyFacilities();
    } catch (error) {
      console.error('Error deleting facility:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Error deleting facility. Please try again.';
      alert(`Delete Error: ${errorMessage}`);
      
      // If delete fails due to authorization, we can still refresh the list
      // to show current state
      fetchMyFacilities();
    }
  };

  const getStatusBadge = (status) => {
    const statusClasses = {
      approved: 'status-approved',
      pending: 'status-pending',
      rejected: 'status-rejected'
    };
    
    return (
      <span className={`status-badge ${statusClasses[status]}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="container">
        <div className="loading">Loading your facilities...</div>
      </div>
    );
  }

  return (
    <div className="my-facilities">
      <div className="container">
        <div className="page-header">
          <h1>My Facilities</h1>
          <button 
            onClick={() => setShowForm(!showForm)}
            className="btn btn-primary"
          >
            {showForm ? '❌ Cancel' : '➕ Add New Facility'}
          </button>
        </div>

        {/* Enhanced Add/Edit Form */}
        {showForm && (
          <div className="facility-form-card">
            <h2>{editingFacility ? '✏️ Edit Facility' : '➕ Add New Facility'}</h2>
            
            <form onSubmit={handleSubmit}>
              {/* Basic Information */}
              <div className="form-section">
                <h3>Basic Information</h3>
                
                <div className="form-group">
                  <label>Facility Name*</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter facility name..."
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Description*</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Describe your facility, its features, and what makes it special..."
                    rows={4}
                    required
                  />
                </div>
              </div>

              {/* Address */}
              <div className="form-section">
                <h3>Address</h3>
                
                <div className="form-group">
                  <label>Street Address*</label>
                  <input
                    type="text"
                    name="address.street"
                    value={formData.address.street}
                    onChange={handleInputChange}
                    placeholder="123 Main Street"
                    required
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>City*</label>
                    <input
                      type="text"
                      name="address.city"
                      value={formData.address.city}
                      onChange={handleInputChange}
                      placeholder="City name"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>State*</label>
                    <input
                      type="text"
                      name="address.state"
                      value={formData.address.state}
                      onChange={handleInputChange}
                      placeholder="State"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>ZIP Code*</label>
                    <input
                      type="text"
                      name="address.zipCode"
                      value={formData.address.zipCode}
                      onChange={handleInputChange}
                      placeholder="12345"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Sports */}
              <div className="form-section">
                <h3>Sports Offered*</h3>
                <div className="checkbox-group">
                  {availableSports.map(sport => (
                    <label key={sport} className="checkbox-item">
                      <input
                        type="checkbox"
                        checked={formData.sportsSupported.includes(sport)}
                        onChange={() => handleSportsChange(sport)}
                      />
                      <span>{sport.charAt(0).toUpperCase() + sport.slice(1)}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Amenities */}
              <div className="form-section">
                <h3>Amenities</h3>
                <div className="checkbox-group">
                  {commonAmenities.map(amenity => (
                    <label key={amenity} className="checkbox-item">
                      <input
                        type="checkbox"
                        checked={formData.amenities.includes(amenity)}
                        onChange={() => handleAmenitiesChange(amenity)}
                      />
                      <span>{amenity}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Pricing */}
              <div className="form-section">
                <h3>Pricing</h3>
                <div className="pricing-grid">
                  <div className="form-group">
                    <label>Regular Hourly Rate</label>
                    <input
                      type="number"
                      value={formData.pricing.hourlyRate}
                      onChange={(e) => handlePricingChange('hourlyRate', e.target.value)}
                      placeholder="25.00"
                      step="0.01"
                      min="0"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Peak Hour Rate</label>
                    <input
                      type="number"
                      value={formData.pricing.peakHourRate}
                      onChange={(e) => handlePricingChange('peakHourRate', e.target.value)}
                      placeholder="35.00"
                      step="0.01"
                      min="0"
                    />
                  </div>

                  <div className="form-group">
                    <label>Currency</label>
                    <select
                      value={formData.pricing.currency}
                      onChange={(e) => handlePricingChange('currency', e.target.value)}
                      className="currency-select"
                    >
                      <option value="USD">USD ($)</option>
                      <option value="EUR">EUR (€)</option>
                      <option value="GBP">GBP (£)</option>
                      <option value="INR">INR (₹)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Photo Upload */}
              <div className="form-section">
                <h3>Photos</h3>
                <div className="photo-upload-section">
                  <label htmlFor="photo-upload" className="photo-upload-btn">
                    📸 Upload Photos
                    <input
                      id="photo-upload"
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      style={{ display: 'none' }}
                    />
                  </label>
                  
                  {formData.photos.length > 0 && (
                    <div className="photo-preview-grid">
                      {formData.photos.map((photo, index) => (
                        <div key={index} className="photo-preview">
                          <img src={photo} alt={`Preview ${index + 1}`} />
                          <button
                            type="button"
                            className="photo-remove-btn"
                            onClick={() => removePhoto(index)}
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Reviews Section (Display Only for Editing) */}
              {editingFacility && (
                <div className="form-section">
                  <h3>Reviews & Rating</h3>
                  <div className="reviews-section">
                    <div className="review-stats">
                      <div className="stat-item">
                        <span className="stat-value">{formData.reviews.rating || 0}/5</span>
                        <span className="stat-label">Average Rating</span>
                      </div>
                      <div className="stat-item">
                        <span className="stat-value">{formData.reviews.totalReviews || 0}</span>
                        <span className="stat-label">Total Reviews</span>
                      </div>
                      <div className="stat-item">
                        <span className="stat-value">
                          {'⭐'.repeat(Math.floor(formData.reviews.rating || 0))}
                        </span>
                        <span className="stat-label">Star Rating</span>
                      </div>
                    </div>
                    <p style={{ color: '#718096', fontSize: '0.9rem', marginTop: '1rem' }}>
                      Reviews are managed automatically based on customer feedback
                    </p>
                  </div>
                </div>
              )}

              {/* Operating Hours */}
              <div className="form-section">
                <h3>Operating Hours</h3>
                <div className="operating-hours-grid">
                  {Object.keys(formData.operatingHours).map(day => (
                    <div key={day} className="operating-hour-row">
                      <div className="day-name">
                        {day.charAt(0).toUpperCase() + day.slice(1)}
                      </div>
                      
                      <label className="checkbox-item">
                        <input
                          type="checkbox"
                          checked={formData.operatingHours[day].isOpen}
                          onChange={(e) => handleOperatingHoursChange(day, 'isOpen', e.target.checked)}
                        />
                        <span>Open</span>
                      </label>
                      
                      {formData.operatingHours[day].isOpen && (
                        <div className="time-inputs">
                          <input
                            type="time"
                            value={formData.operatingHours[day].open}
                            onChange={(e) => handleOperatingHoursChange(day, 'open', e.target.value)}
                          />
                          <span>to</span>
                          <input
                            type="time"
                            value={formData.operatingHours[day].close}
                            onChange={(e) => handleOperatingHoursChange(day, 'close', e.target.value)}
                          />
                        </div>
                      )}
                      
                      {!formData.operatingHours[day].isOpen && (
                        <span style={{ color: '#718096', fontStyle: 'italic' }}>Closed</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="form-actions">
                <button type="button" onClick={resetForm} className="btn-cancel">
                  ❌ Cancel
                </button>
                <button type="submit" className="btn-submit" disabled={loading}>
                  {loading ? '⏳ Saving...' : (editingFacility ? '✅ Update Facility' : '🚀 Create Facility')}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Facilities List */}
        <div className="facilities-list">
          {facilities.length === 0 ? (
            <div className="no-facilities">
              <div className="no-facilities-icon">🏟️</div>
              <h3>No facilities in database</h3>
              <p>No facilities found in the database. Create your first facility to get started!</p>
            </div>
          ) : (
            facilities.map(facility => (
              <div key={facility._id} className="facility-card">
                <div className="facility-header">
                  <div className="facility-info">
                    <h3>{facility.name}</h3>
                    <p className="facility-address">
                      {facility.address.street}, {facility.address.city}, {facility.address.state}
                    </p>
                    <div className="facility-stats">
                      <span>🏟️ {facility.totalCourts || 0} Courts</span>
                      <span>🏃 {facility.sportsSupported.join(', ')}</span>
                    </div>
                  </div>
                  <div className="facility-status">
                    {getStatusBadge(facility.status)}
                  </div>
                </div>

                <div className="facility-details">
                  <p className="facility-description">
                    {facility.description || 'No description available'}
                  </p>
                  
                  {facility.amenities && facility.amenities.length > 0 && (
                    <div className="facility-amenities">
                      <strong>Amenities:</strong> {facility.amenities.join(', ')}
                    </div>
                  )}
                  
                  {facility.status === 'rejected' && facility.adminComments && (
                    <div className="admin-comments rejected">
                      <strong>Admin Feedback:</strong> {facility.adminComments}
                    </div>
                  )}
                  
                  {facility.status === 'approved' && facility.adminComments && (
                    <div className="admin-comments approved">
                      <strong>Admin Comments:</strong> {facility.adminComments}
                    </div>
                  )}
                </div>

                <div className="facility-actions">
                  <button 
                    onClick={() => handleEdit(facility)}
                    className="btn btn-outline"
                  >
                    ✏️ Edit
                  </button>
                  <button 
                    onClick={() => handleDelete(facility._id)}
                    className="btn btn-danger"
                  >
                    🗑️ Delete
                  </button>
                  {facility.status === 'approved' && (
                    <a 
                      href={`/venue/${facility._id}`}
                      className="btn btn-primary"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      👁️ View Public
                    </a>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default MyFacilities;
