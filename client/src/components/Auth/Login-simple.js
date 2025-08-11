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

  const setDemoAccount = (demoEmail, demoPassword) => {
    setFormData({ email: demoEmail, password: demoPassword });
  };

  const autoLogin = async (demoEmail, demoPassword) => {
    setFormData({ email: demoEmail, password: demoPassword });
    setLoading(true);
    setError('');

    const result = await login(demoEmail, demoPassword);
    
    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.message);
    }
    
    setLoading(false);
  };

  const handleUserDemo = () => setDemoAccount('user1@demo.com', '123456');
  const handleOwnerDemo = () => setDemoAccount('owner1@demo.com', '123456');
  const handleAdminDemo = () => autoLogin('admin1@demo.com', '123456');

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto h-12 w-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center mb-4">
            <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome back</h1>
          <p className="text-gray-600">Sign in to your QuickCourt account</p>
        </div>

        {/* Main Card */}
        <div className="card bg-white shadow-xl border-0">
          <div className="card-body p-8">
            {/* Quick Demo Section */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">Quick Demo Access</h3>
              <div className="grid grid-cols-3 gap-3">
                <button 
                  type="button"
                  onClick={handleUserDemo}
                  className="demo-btn demo-btn-user"
                >
                  <div className="text-2xl mb-1">👤</div>
                  <div className="text-xs font-medium">User</div>
                </button>
                <button 
                  type="button"
                  onClick={handleOwnerDemo}
                  className="demo-btn demo-btn-owner"
                >
                  <div className="text-2xl mb-1">🏢</div>
                  <div className="text-xs font-medium">Owner</div>
                </button>
                <button 
                  type="button"
                  onClick={handleAdminDemo}
                  className="demo-btn demo-btn-admin"
                >
                  <div className="text-2xl mb-1">👑</div>
                  <div className="text-xs font-medium">Admin</div>
                </button>
              </div>
            </div>

            {/* Divider */}
            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-3 bg-white text-gray-500">Or continue with email</span>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="alert alert-error mb-6">
                <div className="flex items-center">
                  <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  {error}
                </div>
              </div>
            )}
            
            {/* Login Form */}
            <form onSubmit={onSubmit} className="space-y-6">
              <div className="form-group">
                <label htmlFor="email" className="form-label">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={email}
                  onChange={onChange}
                  required
                  placeholder="Enter your email"
                  className="form-input"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="password" className="form-label">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={password}
                  onChange={onChange}
                  required
                  placeholder="Enter your password"
                  className="form-input"
                />
              </div>
              
              <button 
                type="submit" 
                className="btn btn-primary btn-lg w-full"
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center">
                    <div className="spinner mr-2"></div>
                    Signing in...
                  </div>
                ) : (
                  'Sign In'
                )}
              </button>
            </form>
            
            {/* Demo Credentials Collapsible */}
            <details className="mt-6 p-4 bg-gray-50 rounded-lg">
              <summary className="cursor-pointer text-sm font-medium text-gray-700 hover:text-gray-900 select-none">
                View Demo Credentials
              </summary>
              <div className="mt-3 space-y-3">
                <div className="demo-credential">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">👤 User Account</span>
                    <div className="text-xs text-gray-500">
                      <div>user1@demo.com</div>
                      <div>123456</div>
                    </div>
                  </div>
                </div>
                <div className="demo-credential">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">🏢 Owner Account</span>
                    <div className="text-xs text-gray-500">
                      <div>owner1@demo.com</div>
                      <div>123456</div>
                    </div>
                  </div>
                </div>
                <div className="demo-credential">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">👑 Admin Account</span>
                    <div className="text-xs text-gray-500">
                      <div>admin1@demo.com</div>
                      <div>123456</div>
                    </div>
                  </div>
                </div>
              </div>
            </details>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
