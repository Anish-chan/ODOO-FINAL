import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const { email, password } = formData;

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const result = await login(email, password);
    
    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.message);
    }
    
    setLoading(false);
  };

  const useDemoAccount = (demoEmail, demoPassword) => {
    setFormData({ email: demoEmail, password: demoPassword });
  };

  const handleUserDemo = () => useDemoAccount('user1@demo.com', '123456');
  const handleOwnerDemo = () => useDemoAccount('owner1@demo.com', '123456');
  const handleAdminDemo = () => useDemoAccount('admin1@demo.com', '123456');

  return (
    <div className="form-container">
      <h2>Login to QuickCourt</h2>
      
      {/* Demo Accounts */}
      <div className="demo-accounts-login">
        <h3>Quick Demo Login</h3>
        <div className="demo-buttons">
          <button 
            type="button"
            onClick={handleUserDemo}
            className="btn btn-outline btn-small"
          >
            👤 User Demo
          </button>
          <button 
            type="button"
            onClick={handleOwnerDemo}
            className="btn btn-outline btn-small"
          >
            🏢 Owner Demo
          </button>
          <button 
            type="button"
            onClick={handleAdminDemo}
            className="btn btn-outline btn-small"
          >
            👑 Admin Demo
          </button>
        </div>
      </div>

      {error && <div className="alert alert-error">{error}</div>}
      
      <form onSubmit={onSubmit}>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={onChange}
            required
            placeholder="Enter your email"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={password}
            onChange={onChange}
            required
            placeholder="Enter your password"
          />
        </div>
        
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
      
      <p className="auth-link">
        Don't have an account? <Link to="/register">Register here</Link>
      </p>

      <div className="demo-credentials">
        <h4>Demo Credentials:</h4>
        <div className="credentials-list">
          <div>
            <strong>User:</strong> user1@demo.com / 123456
          </div>
          <div>
            <strong>Facility Owner:</strong> owner1@demo.com / 123456
          </div>
          <div>
            <strong>Admin:</strong> admin1@demo.com / 123456
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
