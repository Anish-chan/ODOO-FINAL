import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    role: 'user'
  });
  
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      setMessage('Passwords do not match');
      return;
    }

    try {
      setMessage('Registration feature coming soon! Please use demo accounts for now.');
      // TODO: Implement actual registration
      // const response = await axios.post('/api/auth/register', {
      //   name: formData.name,
      //   email: formData.email,
      //   password: formData.password,
      //   phone: formData.phone,
      //   role: formData.role
      // });
    } catch (error) {
      setMessage('Registration failed');
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-header">
          <h1>Create Account</h1>
          <p>Join QuickCourt and start booking sports venues</p>
        </div>
        
        <div className="demo-notice">
          <div className="notice-icon">🎯</div>
          <div className="notice-content">
            <h3>Demo Mode</h3>
            <p>Registration is disabled for demo purposes. Use the demo accounts to explore all features.</p>
            <Link to="/login" className="demo-login-btn">
              Try Demo Accounts
            </Link>
          </div>
        </div>

        {message && (
          <div className="error-message">
            <span>ℹ️</span>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form disabled-form">
          <div className="form-row">
            <div className="input-group">
              <label>Full Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your full name"
                className="auth-input"
                disabled
              />
            </div>
          </div>

          <div className="input-group">
            <label>Email Address</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              className="auth-input"
              disabled
            />
          </div>

          <div className="input-group">
            <label>Phone Number</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Enter your phone number"
              className="auth-input"
              disabled
            />
          </div>

          <div className="input-group">
            <label>Account Type</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="auth-input"
              disabled
            >
              <option value="user">Regular User</option>
              <option value="facility_owner">Facility Owner</option>
            </select>
          </div>

          <div className="form-row">
            <div className="input-group">
              <label>Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Create password"
                className="auth-input"
                disabled
              />
            </div>

            <div className="input-group">
              <label>Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm password"
                className="auth-input"
                disabled
              />
            </div>
          </div>

          <button type="submit" className="auth-submit-btn" disabled>
            Create Account
          </button>
        </form>

        <div className="auth-footer">
          <p>Already have an account? <Link to="/login" className="auth-link">Sign in here</Link></p>
        </div>

        <div className="demo-credentials">
          <details>
            <summary>Available Demo Accounts</summary>
            <div className="credentials-grid">
              <div className="credential-item">
                <span className="role">👤 User</span>
                <span className="email">user1@demo.com</span>
                <span className="password">123456</span>
              </div>
              <div className="credential-item">
                <span className="role">🏢 Owner</span>
                <span className="email">owner1@demo.com</span>
                <span className="password">123456</span>
              </div>
              <div className="credential-item">
                <span className="role">👑 Admin</span>
                <span className="email">admin1@demo.com</span>
                <span className="password">123456</span>
              </div>
            </div>
          </details>
        </div>
      </div>
    </div>
  );
};

export default Register;
