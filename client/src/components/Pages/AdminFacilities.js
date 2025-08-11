import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import API from '../../api/axiosConfig';
import './FacilityManagement.css';

const AdminFacilities = () => {
  const [facilities, setFacilities] = useState([]);
  const [filter, setFilter] = useState('pending'); // pending, approved, rejected, all
  const [loading, setLoading] = useState(true);
  const [selectedFacility, setSelectedFacility] = useState(null);
  const [adminComments, setAdminComments] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [actionType, setActionType] = useState(''); // approve, reject
  const { user } = useAuth();

  useEffect(() => {
    fetchFacilities();
  }, [filter]);

  const fetchFacilities = async () => {
    try {
      let url = '/api/facilities/admin/all';
      
      if (filter === 'pending') {
        url = '/api/facilities/admin/pending';
      } else if (filter !== 'all') {
        url = `/api/facilities/admin/all?status=${filter}`;
      }
      
      const response = await API.get(url);
      setFacilities(response.data.facilities || response.data);
    } catch (error) {
      console.error('Error fetching facilities:', error);
      // Demo data for testing
      setFacilities([
        {
          _id: '1',
          name: 'Downtown Sports Complex',
          description: 'Premier sports facility in the city center with state-of-the-art equipment',
          address: {
            street: '123 Main St',
            city: 'Metro City',
            state: 'CA',
            zipCode: '12345'
          },
          owner: {
            _id: 'owner1',
            name: 'John Smith',
            email: 'john@example.com',
            phone: '+1-555-0123'
          },
          sportsSupported: ['basketball', 'tennis'],
          amenities: ['Parking', 'Locker Rooms', 'WiFi', 'Cafeteria'],
          status: 'pending',
          createdAt: '2024-01-15T10:30:00Z',
          adminComments: ''
        },
        {
          _id: '2',
          name: 'Elite Badminton Center',
          description: 'Professional badminton courts with modern equipment and air conditioning',
          address: {
            street: '456 Oak Ave',
            city: 'Metro City',
            state: 'CA',
            zipCode: '12346'
          },
          owner: {
            _id: 'owner2',
            name: 'Sarah Johnson',
            email: 'sarah@example.com',
            phone: '+1-555-0124'
          },
          sportsSupported: ['badminton'],
          amenities: ['Equipment Rental', 'Showers', 'Air Conditioning'],
          status: 'approved',
          createdAt: '2024-01-10T14:20:00Z',
          adminComments: 'Excellent facility with all required amenities'
        },
        {
          _id: '3',
          name: 'Basic Court Center',
          description: 'Simple facility with basic amenities',
          address: {
            street: '789 Pine St',
            city: 'Metro City',
            state: 'CA',
            zipCode: '12347'
          },
          owner: {
            _id: 'owner3',
            name: 'Mike Wilson',
            email: 'mike@example.com',
            phone: '+1-555-0125'
          },
          sportsSupported: ['tennis'],
          amenities: ['Parking'],
          status: 'rejected',
          createdAt: '2024-01-08T09:15:00Z',
          adminComments: 'Insufficient amenities and poor facility description. Please improve the facility and resubmit.'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const openApprovalModal = (facility, action) => {
    setSelectedFacility(facility);
    setActionType(action);
    setAdminComments(facility.adminComments || '');
    setShowModal(true);
  };

  const handleApprovalAction = async () => {
    if (actionType === 'reject' && !adminComments.trim()) {
      alert('Please provide a reason for rejection');
      return;
    }

    try {
      const url = `/api/facilities/admin/${selectedFacility._id}/approve`;
      
      await API.patch(url, {
        status: actionType === 'approve' ? 'approved' : 'rejected',
        comments: adminComments
      });

      alert(`Facility ${actionType}d successfully!`);
      setShowModal(false);
      setSelectedFacility(null);
      setAdminComments('');
      fetchFacilities();
    } catch (error) {
      console.error(`Error ${actionType}ing facility:`, error);
      alert(`Error ${actionType}ing facility. Please try again.`);
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

  const filteredFacilities = facilities.filter(facility => {
    if (filter === 'all') return true;
    return facility.status === filter;
  });

  if (loading) {
    return (
      <div className="container">
        <div className="loading">Loading facilities...</div>
      </div>
    );
  }

  return (
    <div className="admin-facilities">
      <div className="container">
        <div className="page-header">
          <h1>Facility Management</h1>
          <p>Review and approve facility submissions</p>
        </div>

        {/* Filter Tabs */}
        <div className="filter-tabs">
          <button 
            className={filter === 'pending' ? 'tab active' : 'tab'}
            onClick={() => setFilter('pending')}
          >
            Pending ({facilities.filter(f => f.status === 'pending').length})
          </button>
          <button 
            className={filter === 'approved' ? 'tab active' : 'tab'}
            onClick={() => setFilter('approved')}
          >
            Approved ({facilities.filter(f => f.status === 'approved').length})
          </button>
          <button 
            className={filter === 'rejected' ? 'tab active' : 'tab'}
            onClick={() => setFilter('rejected')}
          >
            Rejected ({facilities.filter(f => f.status === 'rejected').length})
          </button>
          <button 
            className={filter === 'all' ? 'tab active' : 'tab'}
            onClick={() => setFilter('all')}
          >
            All ({facilities.length})
          </button>
        </div>

        {/* Facilities List */}
        <div className="facilities-admin-list">
          {filteredFacilities.length === 0 ? (
            <div className="no-facilities">
              <div className="no-facilities-icon">📋</div>
              <h3>No {filter} facilities</h3>
              <p>No facilities found with {filter} status.</p>
            </div>
          ) : (
            filteredFacilities.map(facility => (
              <div key={facility._id} className="admin-facility-card">
                <div className="facility-header">
                  <div className="facility-basic-info">
                    <h3>{facility.name}</h3>
                    <div className="facility-meta">
                      <span className="submitted-date">
                        Submitted: {new Date(facility.createdAt).toLocaleDateString()}
                      </span>
                      {getStatusBadge(facility.status)}
                    </div>
                  </div>
                  
                  <div className="facility-actions">
                    {facility.status === 'pending' && (
                      <>
                        <button 
                          onClick={() => openApprovalModal(facility, 'approve')}
                          className="btn btn-success"
                        >
                          Approve
                        </button>
                        <button 
                          onClick={() => openApprovalModal(facility, 'reject')}
                          className="btn btn-danger"
                        >
                          Reject
                        </button>
                      </>
                    )}
                    {facility.status === 'rejected' && (
                      <button 
                        onClick={() => openApprovalModal(facility, 'approve')}
                        className="btn btn-success"
                      >
                        Approve Now
                      </button>
                    )}
                    {facility.status === 'approved' && (
                      <button 
                        onClick={() => openApprovalModal(facility, 'reject')}
                        className="btn btn-warning"
                      >
                        Revoke Approval
                      </button>
                    )}
                  </div>
                </div>

                <div className="facility-details">
                  <div className="detail-grid">
                    <div className="detail-section">
                      <h4>Owner Information</h4>
                      <p><strong>Name:</strong> {facility.owner.name}</p>
                      <p><strong>Email:</strong> {facility.owner.email}</p>
                      <p><strong>Phone:</strong> {facility.owner.phone}</p>
                    </div>

                    <div className="detail-section">
                      <h4>Location</h4>
                      <p>
                        {facility.address.street}<br/>
                        {facility.address.city}, {facility.address.state} {facility.address.zipCode}
                      </p>
                    </div>

                    <div className="detail-section">
                      <h4>Sports & Amenities</h4>
                      <div className="sports-list">
                        {facility.sportsSupported.map(sport => (
                          <span key={sport} className="sport-tag">{sport}</span>
                        ))}
                      </div>
                      <div className="amenities-list">
                        {facility.amenities.map(amenity => (
                          <span key={amenity} className="amenity-tag">{amenity}</span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="facility-description">
                    <h4>Description</h4>
                    <p>{facility.description}</p>
                  </div>

                  {facility.adminComments && (
                    <div className={`admin-comments ${facility.status}`}>
                      <h4>Admin Comments</h4>
                      <p>{facility.adminComments}</p>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Approval Modal */}
        {showModal && (
          <div className="modal-overlay">
            <div className="modal">
              <div className="modal-header">
                <h3>
                  {actionType === 'approve' ? 'Approve' : 'Reject'} Facility
                </h3>
                <button 
                  onClick={() => setShowModal(false)}
                  className="modal-close"
                >
                  ×
                </button>
              </div>

              <div className="modal-body">
                <div className="facility-summary">
                  <h4>{selectedFacility?.name}</h4>
                  <p>Owner: {selectedFacility?.owner.name}</p>
                </div>

                <div className="form-group">
                  <label>
                    {actionType === 'approve' ? 'Approval Comments (Optional)' : 'Rejection Reason (Required)'}
                  </label>
                  <textarea
                    value={adminComments}
                    onChange={(e) => setAdminComments(e.target.value)}
                    placeholder={
                      actionType === 'approve' 
                        ? 'Add any comments for the facility owner...' 
                        : 'Please explain why this facility is being rejected...'
                    }
                    rows={4}
                    required={actionType === 'reject'}
                  />
                </div>
              </div>

              <div className="modal-actions">
                <button 
                  onClick={() => setShowModal(false)}
                  className="btn btn-outline"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleApprovalAction}
                  className={`btn ${actionType === 'approve' ? 'btn-success' : 'btn-danger'}`}
                >
                  {actionType === 'approve' ? 'Approve Facility' : 'Reject Facility'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminFacilities;
