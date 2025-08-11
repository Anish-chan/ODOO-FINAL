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
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    if (formData.password !== formData.confirmPassword) {
      setMessage('Passwords do not match');
      setLoading(false);
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
    
    setLoading(false);
  };

  return (
    <div className="auth-container">
      <div className="container">
        <div className="auth-form">
          <h2>Register for QuickCourt</h2>
          
          <div className="demo-accounts-login">
            <h4>For Demo Purposes</h4>
            <p>Registration is not implemented yet. Please use the demo accounts to test the application.</p>
            <Link to="/login" className="btn btn-primary">
              Go to Login Page
            </Link>
          </div>

          {message && (
            <div className={`alert ${message.includes('success') ? 'alert-success' : 'alert-warning'}`}>
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Full Name:</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                disabled
              />
            </div>

            <div className="form-group">
              <label>Email:</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                disabled
              />
            </div>

            <div className="form-group">
              <label>Phone:</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                disabled
              />
            </div>

            <div className="form-group">
              <label>Role:</label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                disabled
              >
                <option value="user">User</option>
                <option value="facility_owner">Facility Owner</option>
              </select>
            </div>

            <div className="form-group">
              <label>Password:</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                disabled
              />
            </div>

            <div className="form-group">
              <label>Confirm Password:</label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                disabled
              />
            </div>

            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Registering...' : 'Register'}
            </button>
          </form>

          <div className="auth-link">
            <p>Already have an account? <Link to="/login">Login here</Link></p>
          </div>

          <div className="demo-credentials">
            <h4>Available Demo Accounts:</h4>
            <div className="credentials-list">
              <div><strong>User:</strong> user1@demo.com / 123456</div>
              <div><strong>Facility Owner:</strong> owner1@demo.com / 123456</div>
              <div><strong>Admin:</strong> admin1@demo.com / 123456</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
