import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Dashboard = () => {
  const { user, getDashboardStats } = useAuth();
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [recentBookings, setRecentBookings] = useState([]);
  const [favoriteVenues, setFavoriteVenues] = useState([]);
  const [timeOfDay, setTimeOfDay] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchStats();
    setTimeGreeting();
    fetchRecentBookings();
    fetchFavoriteVenues();
  }, []);

  const setTimeGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) setTimeOfDay('Good Morning');
    else if (hour < 17) setTimeOfDay('Good Afternoon');
    else setTimeOfDay('Good Evening');
  };

  const fetchStats = async () => {
    setLoading(true);
    try {
      const dashboardStats = await getDashboardStats();
      setStats(dashboardStats || {});
    } catch (error) {
      console.error('Error fetching stats:', error);
      // Demo data based on user role
      if (user?.role === 'facility_owner') {
        setStats({
          totalFacilities: 3,
          approvedFacilities: 2,
          pendingFacilities: 1,
          totalBookings: 145,
          monthlyBookings: 28,
          totalEarnings: 45000,
          monthlyEarnings: 12500,
          averageRating: 4.2,
          totalReviews: 67,
          occupancyRate: 78,
          popularSport: 'Badminton'
        });
      } else {
        setStats({
          totalBookings: 12,
          confirmedBookings: 8,
          completedBookings: 7,
          totalSpent: 3500,
          upcomingBookings: 3,
          cancelledBookings: 2,
          favoriteVenues: 4,
          totalHoursPlayed: 24
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchRecentBookings = async () => {
    try {
      // Demo recent bookings data based on user role
      if (user?.role === 'facility_owner') {
        setRecentBookings([
          {
            id: 1,
            customer: 'Rahul Sharma',
            venue: 'Elite Badminton Center',
            sport: 'Badminton',
            date: '2025-08-15',
            time: '6:00 PM - 7:00 PM',
            status: 'confirmed',
            price: 800,
            court: 'Court 1',
            phone: '+91 98765 43210'
          },
          {
            id: 2,
            customer: 'Priya Patel',
            venue: 'Elite Badminton Center',
            sport: 'Badminton',
            date: '2025-08-15',
            time: '7:00 PM - 8:00 PM',
            status: 'confirmed',
            price: 800,
            court: 'Court 2',
            phone: '+91 87654 32109'
          },
          {
            id: 3,
            customer: 'Amit Kumar',
            venue: 'Sports Arena Pro',
            sport: 'Tennis',
            date: '2025-08-14',
            time: '9:00 AM - 10:00 AM',
            status: 'completed',
            price: 1200,
            court: 'Court A',
            phone: '+91 76543 21098'
          },
          {
            id: 4,
            customer: 'Sneha Desai',
            venue: 'Elite Badminton Center',
            sport: 'Badminton',
            date: '2025-08-16',
            time: '8:00 AM - 9:00 AM',
            status: 'pending',
            price: 600,
            court: 'Court 3',
            phone: '+91 65432 10987'
          }
        ]);
      } else {
        setRecentBookings([
          {
            id: 1,
            venue: 'SBR Badminton',
            sport: 'Badminton',
            date: '2025-08-15',
            time: '6:00 PM - 7:00 PM',
            status: 'confirmed',
            price: 500,
            court: 'Court 1'
          },
          {
            id: 2,
            venue: 'Tennis Club Pro',
            sport: 'Tennis',
            date: '2025-08-18',
            time: '9:00 AM - 10:00 AM',
            status: 'confirmed',
            price: 800,
            court: 'Court A'
          },
          {
            id: 3,
            venue: 'Basketball Arena',
            sport: 'Basketball',
            date: '2025-08-12',
            time: '7:00 PM - 8:00 PM',
            status: 'completed',
            price: 600,
            court: 'Full Court'
          }
        ]);
      }
    } catch (error) {
      console.error('Error fetching recent bookings:', error);
    }
  };

  const fetchFavoriteVenues = async () => {
    try {
      // Demo data based on user role
      if (user?.role === 'facility_owner') {
        setFavoriteVenues([
          {
            id: 1,
            name: 'Elite Badminton Center',
            location: 'Satellite, Ahmedabad',
            rating: 4.3,
            image: '/api/placeholder/150/100',
            sport: 'Badminton',
            status: 'approved',
            bookings: 89,
            revenue: 28500
          },
          {
            id: 2,
            name: 'Sports Arena Pro',
            location: 'Vastrapur, Ahmedabad',
            rating: 4.6,
            image: '/api/placeholder/150/100',
            sport: 'Tennis',
            status: 'approved',
            bookings: 56,
            revenue: 16500
          },
          {
            id: 3,
            name: 'Multi-Sport Complex',
            location: 'SG Highway, Ahmedabad',
            rating: 0,
            image: '/api/placeholder/150/100',
            sport: 'Multiple',
            status: 'pending',
            bookings: 0,
            revenue: 0
          }
        ]);
      } else {
        setFavoriteVenues([
          {
            id: 1,
            name: 'SBR Badminton',
            location: 'Satellite, Ahmedabad',
            rating: 4.3,
            image: '/api/placeholder/150/100',
            sport: 'Badminton'
          },
          {
            id: 2,
            name: 'Tennis Club Pro',
            location: 'Vastrapur, Ahmedabad',
            rating: 4.6,
            image: '/api/placeholder/150/100',
            sport: 'Tennis'
          },
          {
            id: 3,
            name: 'Football Ground',
            location: 'SG Highway, Ahmedabad',
            rating: 4.1,
            image: '/api/placeholder/150/100',
            sport: 'Football'
          }
        ]);
      }
    } catch (error) {
      console.error('Error fetching favorite venues:', error);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return 'text-green-600 bg-green-100';
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'completed': return 'text-blue-600 bg-blue-100';
      case 'cancelled': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getSportIcon = (sport) => {
    const icons = {
      'Badminton': '🏸',
      'Tennis': '🎾',
      'Basketball': '🏀',
      'Football': '⚽',
      'Cricket': '🏏',
      'Volleyball': '🏐',
      'Table Tennis': '🏓'
    };
    return icons[sport] || '🏸';
  };

  const renderUserDashboard = () => (
    <div className="user-dashboard">
      {/* Welcome Header */}
      <div className="dashboard-header">
        <div className="welcome-section">
          <div className="welcome-text">
            <h1 className="dashboard-title">
              {timeOfDay}, {user?.name}! 👋
            </h1>
            <p className="dashboard-subtitle">
              Ready to book your next game? Let's get you on the court!
            </p>
          </div>
          <div className="header-actions">
            <button 
              onClick={() => navigate('/venues')}
              className="btn btn-primary"
            >
              <span className="mr-2">🏸</span>
              Book Now
            </button>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="stats-section">
        <h2 className="section-title">Your Activity</h2>
        <div className="stats-grid">
          <div className="stat-card primary">
            <div className="stat-icon">📅</div>
            <div className="stat-content">
              <h3 className="stat-number">{stats.totalBookings || 0}</h3>
              <p className="stat-label">Total Bookings</p>
              <div className="stat-trend">
                <span className="trend-up">↗️ +2 this month</span>
              </div>
            </div>
          </div>
          
          <div className="stat-card success">
            <div className="stat-icon">✅</div>
            <div className="stat-content">
              <h3 className="stat-number">{stats.confirmedBookings || 0}</h3>
              <p className="stat-label">Confirmed</p>
              <div className="stat-trend">
                <span className="trend-neutral">{stats.upcomingBookings || 0} upcoming</span>
              </div>
            </div>
          </div>
          
          <div className="stat-card info">
            <div className="stat-icon">🏆</div>
            <div className="stat-content">
              <h3 className="stat-number">{stats.completedBookings || 0}</h3>
              <p className="stat-label">Games Played</p>
              <div className="stat-trend">
                <span className="trend-up">{stats.totalHoursPlayed || 0}h total</span>
              </div>
            </div>
          </div>
          
          <div className="stat-card warning">
            <div className="stat-icon">💰</div>
            <div className="stat-content">
              <h3 className="stat-number">₹{stats.totalSpent || 0}</h3>
              <p className="stat-label">Total Spent</p>
              <div className="stat-trend">
                <span className="trend-neutral">Avg ₹{Math.round((stats.totalSpent || 0) / (stats.totalBookings || 1))}/game</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="quick-actions-section">
        <h2 className="section-title">Quick Actions</h2>
        <div className="actions-grid">
          <Link to="/venues" className="action-card primary-action">
            <div className="action-icon-large">🏸</div>
            <div className="action-content">
              <h3>Find Courts</h3>
              <p>Discover and book sports venues near you</p>
              <div className="action-arrow">→</div>
            </div>
          </Link>
          
          <Link to="/my-bookings" className="action-card">
            <div className="action-icon">📋</div>
            <div className="action-content">
              <h3>My Bookings</h3>
              <p>Manage your reservations</p>
            </div>
          </Link>
          
          <Link to="/profile" className="action-card">
            <div className="action-icon">👤</div>
            <div className="action-content">
              <h3>Profile</h3>
              <p>Update your information</p>
            </div>
          </Link>
          
          <div className="action-card" onClick={() => navigate('/venues')}>
            <div className="action-icon">⭐</div>
            <div className="action-content">
              <h3>Leave Review</h3>
              <p>Rate your experiences</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Bookings */}
      <div className="recent-bookings-section">
        <div className="section-header">
          <h2 className="section-title">Recent Bookings</h2>
          <Link to="/my-bookings" className="view-all-link">
            View All →
          </Link>
        </div>
        
        <div className="bookings-list">
          {recentBookings.slice(0, 3).map((booking) => (
            <div key={booking.id} className="booking-card">
              <div className="booking-sport-icon">
                {getSportIcon(booking.sport)}
              </div>
              <div className="booking-details">
                <div className="booking-main-info">
                  <h4 className="booking-venue">{booking.venue}</h4>
                  <span className={`booking-status ${getStatusColor(booking.status)}`}>
                    {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                  </span>
                </div>
                <div className="booking-sub-info">
                  <span className="booking-date">📅 {booking.date}</span>
                  <span className="booking-time">🕐 {booking.time}</span>
                  <span className="booking-court">🏟️ {booking.court}</span>
                </div>
                <div className="booking-price">₹{booking.price}</div>
              </div>
              <div className="booking-actions">
                {booking.status === 'confirmed' && (
                  <button className="btn-small btn-outline">
                    Modify
                  </button>
                )}
                {booking.status === 'completed' && (
                  <button className="btn-small btn-primary">
                    Review
                  </button>
                )}
              </div>
            </div>
          ))}
          
          {recentBookings.length === 0 && (
            <div className="empty-state">
              <div className="empty-icon">🏸</div>
              <h3>No bookings yet</h3>
              <p>Start by booking your first court!</p>
              <button 
                onClick={() => navigate('/venues')}
                className="btn btn-primary"
              >
                Browse Venues
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Favorite Venues */}
      <div className="favorites-section">
        <div className="section-header">
          <h2 className="section-title">Your Favorite Venues</h2>
          <Link to="/venues" className="view-all-link">
            Explore More →
          </Link>
        </div>
        
        <div className="favorites-grid">
          {favoriteVenues.slice(0, 3).map((venue) => (
            <Link 
              key={venue.id} 
              to={`/venue/${venue.id}`}
              className="favorite-card"
            >
              <div className="favorite-image">
                <img src={venue.image} alt={venue.name} />
                <div className="favorite-sport-badge">
                  {getSportIcon(venue.sport)}
                </div>
              </div>
              <div className="favorite-content">
                <h4 className="favorite-name">{venue.name}</h4>
                <p className="favorite-location">📍 {venue.location}</p>
                <div className="favorite-rating">
                  <span className="rating-stars">⭐⭐⭐⭐⭐</span>
                  <span className="rating-number">{venue.rating}</span>
                </div>
              </div>
            </Link>
          ))}
          
          {favoriteVenues.length === 0 && (
            <div className="empty-favorites">
              <div className="empty-icon">❤️</div>
              <p>No favorites yet. Start exploring venues!</p>
            </div>
          )}
        </div>
      </div>

      {/* Upcoming Games Reminder */}
      {stats.upcomingBookings > 0 && (
        <div className="reminder-section">
          <div className="reminder-card">
            <div className="reminder-icon">⏰</div>
            <div className="reminder-content">
              <h3>Upcoming Games</h3>
              <p>You have {stats.upcomingBookings} upcoming bookings. Don't forget to check in!</p>
            </div>
            <Link to="/my-bookings" className="btn btn-outline">
              View Details
            </Link>
          </div>
        </div>
      )}
    </div>
  );

  const renderFacilityOwnerDashboard = () => (
    <div className="facility-owner-dashboard">
      {/* Welcome Header */}
      <div className="dashboard-header owner-header">
        <div className="welcome-section">
          <div className="welcome-text">
            <h1 className="dashboard-title">
              {timeOfDay}, {user?.name}! 🏢
            </h1>
            <p className="dashboard-subtitle">
              Manage your sports facilities and track your business performance
            </p>
          </div>
          <div className="header-actions">
            <button 
              onClick={() => navigate('/my-facilities')}
              className="btn btn-primary"
            >
              <span className="mr-2">➕</span>
              Add Facility
            </button>
          </div>
        </div>
      </div>

      {/* Business Overview Stats */}
      <div className="stats-section">
        <h2 className="section-title">Business Overview</h2>
        <div className="stats-grid owner-stats">
          <div className="stat-card primary">
            <div className="stat-icon">🏢</div>
            <div className="stat-content">
              <h3 className="stat-number">{stats.totalFacilities || 0}</h3>
              <p className="stat-label">Total Facilities</p>
              <div className="stat-trend">
                <span className="trend-up">{stats.approvedFacilities || 0} approved</span>
              </div>
            </div>
          </div>
          
          <div className="stat-card success">
            <div className="stat-icon">📅</div>
            <div className="stat-content">
              <h3 className="stat-number">{stats.totalBookings || 0}</h3>
              <p className="stat-label">Total Bookings</p>
              <div className="stat-trend">
                <span className="trend-up">+{stats.monthlyBookings || 0} this month</span>
              </div>
            </div>
          </div>
          
          <div className="stat-card warning">
            <div className="stat-icon">💰</div>
            <div className="stat-content">
              <h3 className="stat-number">₹{stats.totalEarnings || 0}</h3>
              <p className="stat-label">Total Revenue</p>
              <div className="stat-trend">
                <span className="trend-up">₹{stats.monthlyEarnings || 0} this month</span>
              </div>
            </div>
          </div>
          
          <div className="stat-card info">
            <div className="stat-icon">⭐</div>
            <div className="stat-content">
              <h3 className="stat-number">{stats.averageRating || 0}</h3>
              <p className="stat-label">Average Rating</p>
              <div className="stat-trend">
                <span className="trend-neutral">{stats.totalReviews || 0} reviews</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="performance-section">
        <h2 className="section-title">Performance Metrics</h2>
        <div className="performance-grid">
          <div className="performance-card">
            <div className="performance-header">
              <h3>Occupancy Rate</h3>
              <span className="performance-value">{stats.occupancyRate || 0}%</span>
            </div>
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ width: `${stats.occupancyRate || 0}%` }}
              ></div>
            </div>
            <p className="performance-note">Target: 85%</p>
          </div>
          
          <div className="performance-card">
            <div className="performance-header">
              <h3>Popular Sport</h3>
              <span className="performance-value">{getSportIcon(stats.popularSport || 'Badminton')}</span>
            </div>
            <p className="performance-sport">{stats.popularSport || 'Badminton'}</p>
            <p className="performance-note">Most booked sport</p>
          </div>
          
          <div className="performance-card">
            <div className="performance-header">
              <h3>Monthly Growth</h3>
              <span className="performance-value trend-up">+12%</span>
            </div>
            <p className="performance-note">Bookings vs last month</p>
          </div>
        </div>
      </div>

      {/* Quick Actions for Owners */}
      <div className="quick-actions-section">
        <h2 className="section-title">Quick Actions</h2>
        <div className="actions-grid owner-actions">
          <Link to="/my-facilities" className="action-card primary-action">
            <div className="action-icon-large">🏢</div>
            <div className="action-content">
              <h3>Manage Facilities</h3>
              <p>View and edit your sports facilities</p>
              <div className="action-arrow">→</div>
            </div>
          </Link>
          
          <div className="action-card" onClick={() => navigate('/my-facilities')}>
            <div className="action-icon">➕</div>
            <div className="action-content">
              <h3>Add New Facility</h3>
              <p>Register another venue</p>
            </div>
          </div>
          
          <div className="action-card">
            <div className="action-icon">📊</div>
            <div className="action-content">
              <h3>Analytics</h3>
              <p>Detailed performance reports</p>
            </div>
          </div>
          
          <div className="action-card">
            <div className="action-icon">💳</div>
            <div className="action-content">
              <h3>Payments</h3>
              <p>Revenue and transactions</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Bookings for Owners */}
      <div className="recent-bookings-section">
        <div className="section-header">
          <h2 className="section-title">Recent Bookings</h2>
          <div className="booking-filters">
            <select className="filter-select">
              <option>All Facilities</option>
              <option>Elite Badminton Center</option>
              <option>Sports Arena Pro</option>
            </select>
            <Link to="/bookings" className="view-all-link">
              View All →
            </Link>
          </div>
        </div>
        
        <div className="bookings-list owner-bookings">
          {recentBookings.slice(0, 4).map((booking) => (
            <div key={booking.id} className="booking-card owner-booking-card">
              <div className="booking-sport-icon">
                {getSportIcon(booking.sport)}
              </div>
              <div className="booking-details">
                <div className="booking-main-info">
                  <h4 className="booking-customer">{booking.customer}</h4>
                  <span className={`booking-status ${getStatusColor(booking.status)}`}>
                    {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                  </span>
                </div>
                <div className="booking-sub-info">
                  <span className="booking-venue">🏢 {booking.venue}</span>
                  <span className="booking-date">📅 {booking.date}</span>
                  <span className="booking-time">🕐 {booking.time}</span>
                  <span className="booking-court">🏟️ {booking.court}</span>
                </div>
                <div className="booking-contact">
                  <span className="booking-phone">📞 {booking.phone}</span>
                </div>
              </div>
              <div className="booking-price-section">
                <div className="booking-price">₹{booking.price}</div>
                <div className="booking-actions">
                  {booking.status === 'pending' && (
                    <>
                      <button className="btn-small btn-primary">
                        Confirm
                      </button>
                      <button className="btn-small btn-outline">
                        Decline
                      </button>
                    </>
                  )}
                  {booking.status === 'confirmed' && (
                    <button className="btn-small btn-outline">
                      Contact
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
          
          {recentBookings.length === 0 && (
            <div className="empty-state">
              <div className="empty-icon">�</div>
              <h3>No recent bookings</h3>
              <p>New bookings will appear here</p>
            </div>
          )}
        </div>
      </div>

      {/* My Facilities */}
      <div className="facilities-section">
        <div className="section-header">
          <h2 className="section-title">My Facilities</h2>
          <Link to="/my-facilities" className="view-all-link">
            Manage All →
          </Link>
        </div>
        
        <div className="facilities-grid">
          {favoriteVenues.map((facility) => (
            <div key={facility.id} className="facility-card">
              <div className="facility-image">
                <img src={facility.image} alt={facility.name} />
                <div className="facility-status-badge">
                  <span className={`status-dot ${facility.status === 'approved' ? 'approved' : 'pending'}`}></span>
                  {facility.status.charAt(0).toUpperCase() + facility.status.slice(1)}
                </div>
              </div>
              <div className="facility-content">
                <h4 className="facility-name">{facility.name}</h4>
                <p className="facility-location">📍 {facility.location}</p>
                <div className="facility-sport">
                  <span>{getSportIcon(facility.sport)} {facility.sport}</span>
                </div>
                
                {facility.status === 'approved' && (
                  <div className="facility-stats">
                    <div className="facility-stat">
                      <span className="stat-label">Rating</span>
                      <span className="stat-value">⭐ {facility.rating}</span>
                    </div>
                    <div className="facility-stat">
                      <span className="stat-label">Bookings</span>
                      <span className="stat-value">{facility.bookings}</span>
                    </div>
                    <div className="facility-stat">
                      <span className="stat-label">Revenue</span>
                      <span className="stat-value">₹{facility.revenue}</span>
                    </div>
                  </div>
                )}
                
                {facility.status === 'pending' && (
                  <div className="facility-pending">
                    <p>⏳ Waiting for admin approval</p>
                  </div>
                )}
              </div>
              <div className="facility-actions">
                <button className="btn-small btn-primary">
                  {facility.status === 'approved' ? 'Edit' : 'View'}
                </button>
                <button className="btn-small btn-outline">
                  {facility.status === 'approved' ? 'Analytics' : 'Delete'}
                </button>
              </div>
            </div>
          ))}
          
          {favoriteVenues.length === 0 && (
            <div className="empty-facilities">
              <div className="empty-icon">🏢</div>
              <h3>No facilities yet</h3>
              <p>Add your first sports facility to get started</p>
              <button 
                onClick={() => navigate('/my-facilities')}
                className="btn btn-primary"
              >
                Add Facility
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Alerts and Notifications */}
      {stats.pendingFacilities > 0 && (
        <div className="alerts-section">
          <div className="alert-card pending">
            <div className="alert-icon">⏳</div>
            <div className="alert-content">
              <h3>Facility Approval Pending</h3>
              <p>You have {stats.pendingFacilities} facilities waiting for admin approval. This usually takes 24-48 hours.</p>
            </div>
            <button className="btn btn-outline">
              View Details
            </button>
          </div>
        </div>
      )}

      {recentBookings.filter(b => b.status === 'pending').length > 0 && (
        <div className="alerts-section">
          <div className="alert-card warning">
            <div className="alert-icon">🔔</div>
            <div className="alert-content">
              <h3>Pending Bookings</h3>
              <p>You have {recentBookings.filter(b => b.status === 'pending').length} booking requests that need your attention.</p>
            </div>
            <button className="btn btn-primary">
              Review Bookings
            </button>
          </div>
        </div>
      )}
    </div>
  );

  const renderAdminDashboard = () => (
    <div>
      <h1>Admin Dashboard</h1>
      <p>Platform Overview</p>
      
      <div className="stats-grid">
        <div className="stat-card">
          <h3>{stats.totalUsers || 0}</h3>
          <p>Total Users</p>
        </div>
        <div className="stat-card">
          <h3>{stats.totalFacilityOwners || 0}</h3>
          <p>Facility Owners</p>
        </div>
        <div className="stat-card">
          <h3>{stats.totalFacilities || 0}</h3>
          <p>Total Facilities</p>
        </div>
        <div className="stat-card">
          <h3>{stats.totalBookings || 0}</h3>
          <p>Total Bookings</p>
        </div>
      </div>

      <div className="quick-actions">
        <h2>Admin Actions</h2>
        <div className="actions-grid">
          <Link to="/admin/facilities" className="action-card">
            <div className="action-icon">✅</div>
            <h3>Approve Facilities</h3>
            <p>{stats.pendingApprovals || 0} pending approvals</p>
          </Link>
          <div className="action-card">
            <div className="action-icon">👥</div>
            <h3>Manage Users</h3>
            <p>View and moderate users</p>
          </div>
          <div className="action-card">
            <div className="action-icon">📈</div>
            <h3>Platform Analytics</h3>
            <p>View detailed statistics</p>
          </div>
        </div>
      </div>

      {stats.pendingApprovals > 0 && (
        <div className="alert alert-warning">
          <h3>⚠️ Action Required</h3>
          <p>There are {stats.pendingApprovals} facilities waiting for your approval.</p>
        </div>
      )}
    </div>
  );

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="loading-spinner">
          <div className="spinner"></div>
        </div>
        <h2>Loading your dashboard...</h2>
        <p>Preparing your sports journey</p>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      {user?.role === 'user' && renderUserDashboard()}
      {user?.role === 'facility_owner' && renderFacilityOwnerDashboard()}
      {user?.role === 'admin' && renderAdminDashboard()}
    </div>
  );
};

export default Dashboard;
