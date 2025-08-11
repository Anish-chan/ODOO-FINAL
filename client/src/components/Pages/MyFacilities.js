import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import API from '../../api/axiosConfig';
import './FacilityManagement.css';

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
          description: 'Premier sports facility in the city center',
          address: { street: '123 Main St', city: 'Metro City', state: 'CA', zipCode: '12345' },
          sportsSupported: ['basketball', 'tennis'],
          amenities: ['Parking', 'Locker Rooms', 'WiFi'],
          status: 'approved',
          totalCourts: 5,
          activeCourts: 5,
          createdAt: '2024-01-01',
          adminComments: 'Great facility!'
        },
        {
          _id: '2',
          name: 'Elite Badminton Center',
          description: 'Professional badminton courts with modern equipment',
          address: { street: '456 Oak Ave', city: 'Metro City', state: 'CA', zipCode: '12346' },
          sportsSupported: ['badminton'],
          amenities: ['Equipment Rental', 'Showers', 'Air Conditioning'],
          status: 'pending',
          totalCourts: 3,
          activeCourts: 3,
          createdAt: '2024-01-15',
          adminComments: ''
        }
      ]);
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
      if (editingFacility) {
        await API.put(`/api/facilities/${editingFacility._id}`, formData);
        alert('Facility updated successfully!');
      } else {
        await API.post('/api/facilities', formData);
        alert('Facility created successfully! It will be visible after admin approval.');
      }
      
      resetForm();
      fetchMyFacilities();
    } catch (error) {
      console.error('Error saving facility:', error);
      alert('Error saving facility. Please try again.');
    }
  };

  const handleEdit = (facility) => {
    setFormData({
      name: facility.name,
      description: facility.description,
      address: facility.address,
      sportsSupported: facility.sportsSupported,
      amenities: facility.amenities,
      photos: facility.photos || [],
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
      await API.delete(`/api/facilities/${facilityId}`);
      alert('Facility deleted successfully!');
      fetchMyFacilities();
    } catch (error) {
      console.error('Error deleting facility:', error);
      alert('Error deleting facility. Please try again.');
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
            {showForm ? 'Cancel' : 'Add New Facility'}
          </button>
        </div>

        {/* Add/Edit Form */}
        {showForm && (
          <div className="facility-form-card">
            <h2>{editingFacility ? 'Edit Facility' : 'Add New Facility'}</h2>
            
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
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Description*</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
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
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Sports */}
              <div className="form-section">
                <h3>Sports Offered*</h3>
                <div className="checkbox-grid">
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
                <div className="checkbox-grid">
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

              {/* Operating Hours */}
              <div className="form-section">
                <h3>Operating Hours</h3>
                <div className="operating-hours">
                  {Object.keys(formData.operatingHours).map(day => (
                    <div key={day} className="day-hours">
                      <label className="day-label">
                        <input
                          type="checkbox"
                          checked={formData.operatingHours[day].isOpen}
                          onChange={(e) => handleOperatingHoursChange(day, 'isOpen', e.target.checked)}
                        />
                        {day.charAt(0).toUpperCase() + day.slice(1)}
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
                    </div>
                  ))}
                </div>
              </div>

              <div className="form-actions">
                <button type="button" onClick={resetForm} className="btn btn-outline">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingFacility ? 'Update Facility' : 'Create Facility'}
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
              <h3>No facilities yet</h3>
              <p>Create your first facility to get started!</p>
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
                      <span>{facility.totalCourts} Courts</span>
                      <span>{facility.sportsSupported.join(', ')}</span>
                    </div>
                  </div>
                  <div className="facility-status">
                    {getStatusBadge(facility.status)}
                  </div>
                </div>

                <div className="facility-details">
                  <p className="facility-description">{facility.description}</p>
                  
                  {facility.status === 'rejected' && facility.adminComments && (
                    <div className="admin-comments rejected">
                      <strong>Admin Comments:</strong> {facility.adminComments}
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
                    Edit
                  </button>
                  <button 
                    onClick={() => handleDelete(facility._id)}
                    className="btn btn-danger"
                  >
                    Delete
                  </button>
                  {facility.status === 'approved' && (
                    <a 
                      href={`/venue/${facility._id}`}
                      className="btn btn-primary"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      View Public Page
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
