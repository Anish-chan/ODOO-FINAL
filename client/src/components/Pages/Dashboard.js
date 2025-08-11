import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Dashboard = () => {
  const { user, getDashboardStats } = useAuth();
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const dashboardStats = await getDashboardStats();
      setStats(dashboardStats || {});
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderUserDashboard = () => (
    <div>
      <h1>User Dashboard</h1>
      <p>Welcome back, {user?.name}!</p>
      
      <div className="stats-grid">
        <div className="stat-card">
          <h3>{stats.totalBookings || 0}</h3>
          <p>Total Bookings</p>
        </div>
        <div className="stat-card">
          <h3>{stats.confirmedBookings || 0}</h3>
          <p>Confirmed Bookings</p>
        </div>
        <div className="stat-card">
          <h3>{stats.completedBookings || 0}</h3>
          <p>Completed Games</p>
        </div>
        <div className="stat-card">
          <h3>₹{stats.totalSpent || 0}</h3>
          <p>Total Spent</p>
        </div>
      </div>

      <div className="quick-actions">
        <h2>Quick Actions</h2>
        <div className="actions-grid">
          <a href="/venues" className="action-card">
            <div className="action-icon">🏸</div>
            <h3>Book a Court</h3>
            <p>Find and book sports facilities</p>
          </a>
          <a href="/my-bookings" className="action-card">
            <div className="action-icon">📅</div>
            <h3>My Bookings</h3>
            <p>View and manage your bookings</p>
          </a>
          <a href="/venues" className="action-card">
            <div className="action-icon">⭐</div>
            <h3>Leave Review</h3>
            <p>Rate your recent experiences</p>
          </a>
        </div>
      </div>
    </div>
  );

  const renderFacilityOwnerDashboard = () => (
    <div>
      <h1>Facility Owner Dashboard</h1>
      <p>Welcome back, {user?.name}!</p>
      
      <div className="stats-grid">
        <div className="stat-card">
          <h3>{stats.totalFacilities || 0}</h3>
          <p>Total Facilities</p>
        </div>
        <div className="stat-card">
          <h3>{stats.approvedFacilities || 0}</h3>
          <p>Approved Facilities</p>
        </div>
        <div className="stat-card">
          <h3>{stats.totalBookings || 0}</h3>
          <p>Total Bookings</p>
        </div>
        <div className="stat-card">
          <h3>₹{stats.totalEarnings || 0}</h3>
          <p>Total Earnings</p>
        </div>
      </div>

      <div className="quick-actions">
        <h2>Quick Actions</h2>
        <div className="actions-grid">
          <Link to="/my-facilities" className="action-card">
            <div className="action-icon">🏢</div>
            <h3>My Facilities</h3>
            <p>Manage your sports facilities</p>
          </Link>
          <Link to="/my-facilities" className="action-card">
            <div className="action-icon">➕</div>
            <h3>Add Facility</h3>
            <p>Register a new sports facility</p>
          </Link>
          <div className="action-card">
            <div className="action-icon">📊</div>
            <h3>View Analytics</h3>
            <p>Track your performance metrics</p>
          </div>
        </div>
      </div>

      {stats.pendingFacilities > 0 && (
        <div className="alert alert-info">
          <h3>⏳ Pending Approval</h3>
          <p>You have {stats.pendingFacilities} facilities waiting for admin approval.</p>
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
      <div className="text-center">
        <h2>Loading dashboard...</h2>
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
