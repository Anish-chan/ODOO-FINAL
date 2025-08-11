import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    countryCode: '+91',
    role: 'user'
  });
  
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Popular country codes with flags
  const countryCodes = [
    { code: '+91', country: 'IN', flag: '🇮🇳', name: 'India' },
    { code: '+1', country: 'US', flag: '🇺🇸', name: 'United States' },
    { code: '+44', country: 'GB', flag: '🇬🇧', name: 'United Kingdom' },
    { code: '+61', country: 'AU', flag: '🇦🇺', name: 'Australia' },
    { code: '+81', country: 'JP', flag: '🇯🇵', name: 'Japan' },
    { code: '+49', country: 'DE', flag: '🇩🇪', name: 'Germany' },
    { code: '+33', country: 'FR', flag: '🇫🇷', name: 'France' },
    { code: '+86', country: 'CN', flag: '🇨🇳', name: 'China' },
    { code: '+971', country: 'AE', flag: '🇦🇪', name: 'UAE' },
    { code: '+65', country: 'SG', flag: '🇸🇬', name: 'Singapore' }
  ];

  const validateForm = () => {
    const newErrors = {};

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = 'Full name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Phone validation
    if (!formData.phone) {
      newErrors.phone = 'Phone number is required';
    } else if (formData.phone.length < 8) {
      newErrors.phone = 'Phone number must be at least 8 digits';
    } else if (!/^\d+$/.test(formData.phone)) {
      newErrors.phone = 'Phone number must contain only digits';
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    // Confirm password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      // Simulate API call for demo
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // For demo purposes, show success and redirect to login
      alert('Account created successfully! Please login with demo credentials.');
      navigate('/login');
      
      // TODO: Implement actual registration API call
      // const response = await axios.post('/api/auth/register', {
      //   name: formData.name,
      //   email: formData.email,
      //   password: formData.password,
      //   phone: formData.countryCode + formData.phone,
      //   role: formData.role
      // });
    } catch (error) {
      setErrors({ general: 'Registration failed. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto h-12 w-12 bg-gradient-to-r from-green-600 to-blue-600 rounded-xl flex items-center justify-center mb-4">
            <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Account</h1>
          <p className="text-gray-600">Join QuickCourt and start booking sports venues</p>
        </div>

        {/* Main Card */}
        <div className="card bg-white shadow-xl border-0">
          <div className="card-body p-8">
            {/* Demo Notice */}
            <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-yellow-800">Demo Mode</h3>
                  <p className="text-sm text-yellow-700 mt-1">
                    Registration is available for testing. Use the form below or try our{' '}
                    <Link to="/login" className="font-medium underline hover:text-yellow-900">
                      demo accounts
                    </Link>
                  </p>
                </div>
              </div>
            </div>

            {/* Error Messages */}
            {errors.general && (
              <div className="alert alert-error mb-6">
                <div className="flex items-center">
                  <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  {errors.general}
                </div>
              </div>
            )}
            
            {/* Registration Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Full Name */}
              <div className="form-group">
                <label htmlFor="name" className="form-label">
                  Full Name <span className="required">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  className={`form-input ${errors.name ? 'error' : ''}`}
                />
                {errors.name && (
                  <div className="error-message">
                    <span className="icon">❌</span>
                    {errors.name}
                  </div>
                )}
              </div>

              {/* Email */}
              <div className="form-group">
                <label htmlFor="email" className="form-label">
                  Email Address <span className="required">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email address"
                  className={`form-input ${errors.email ? 'error' : ''}`}
                />
                {errors.email && (
                  <div className="error-message">
                    <span className="icon">❌</span>
                    {errors.email}
                  </div>
                )}
              </div>

              {/* Phone Number with Country Code */}
              <div className="form-group">
                <label htmlFor="phone" className="form-label">
                  Phone Number <span className="required">*</span>
                </label>
                <div className="phone-input-container">
                  <select
                    name="countryCode"
                    value={formData.countryCode}
                    onChange={handleChange}
                    className="country-select"
                  >
                    {countryCodes.map((country) => (
                      <option key={country.code} value={country.code}>
                        {country.flag} {country.code}
                      </option>
                    ))}
                  </select>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Enter phone number"
                    className="phone-number-input"
                  />
                </div>
                {errors.phone ? (
                  <div className="phone-validation-message error">
                    <span className="icon">❌</span>
                    {errors.phone}
                  </div>
                ) : formData.phone && formData.phone.length >= 8 ? (
                  <div className="phone-validation-message success">
                    <span className="icon">✅</span>
                    Valid phone number format
                  </div>
                ) : (
                  <div className="phone-validation-message">
                    <span className="icon">📱</span>
                    Format: {formData.countryCode} followed by your number (without leading zero)
                  </div>
                )}
              </div>

              {/* Account Type */}
              <div className="form-group">
                <label className="form-label">
                  Account Type
                </label>
                <div className="space-y-3">
                  <div 
                    className={`account-type-option ${formData.role === 'user' ? 'selected' : ''}`}
                    onClick={() => handleChange({ target: { name: 'role', value: 'user' } })}
                  >
                    <div className="account-type-icon">👤</div>
                    <div className="account-type-content">
                      <div className="account-type-title">Regular User</div>
                      <div className="account-type-description">
                        Book sports venues and manage your reservations
                      </div>
                    </div>
                  </div>
                  
                  <div 
                    className={`account-type-option ${formData.role === 'facility_owner' ? 'selected' : ''}`}
                    onClick={() => handleChange({ target: { name: 'role', value: 'facility_owner' } })}
                  >
                    <div className="account-type-icon">🏢</div>
                    <div className="account-type-content">
                      <div className="account-type-title">Facility Owner</div>
                      <div className="account-type-description">
                        Manage venues, courts, and bookings for your facilities
                      </div>
                    </div>
                  </div>
                </div>
                <div className="phone-validation-message">
                  <span className="icon">💡</span>
                  Choose your account type based on how you plan to use QuickCourt
                </div>
              </div>

              {/* Password */}
              <div className="form-group">
                <label htmlFor="password" className="form-label">
                  Password <span className="required">*</span>
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Create a strong password"
                  className={`form-input ${errors.password ? 'error' : ''}`}
                />
                {errors.password ? (
                  <div className="error-message">
                    <span className="icon">❌</span>
                    {errors.password}
                  </div>
                ) : (
                  <div className="phone-validation-message">
                    <span className="icon">🔒</span>
                    Minimum 6 characters required
                  </div>
                )}
              </div>

              {/* Confirm Password */}
              <div className="form-group">
                <label htmlFor="confirmPassword" className="form-label">
                  Confirm Password <span className="required">*</span>
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm your password"
                  className={`form-input ${errors.confirmPassword ? 'error' : ''}`}
                />
                {errors.confirmPassword ? (
                  <div className="error-message">
                    <span className="icon">❌</span>
                    {errors.confirmPassword}
                  </div>
                ) : formData.confirmPassword && formData.password === formData.confirmPassword ? (
                  <div className="success-message">
                    <span className="icon">✅</span>
                    Passwords match
                  </div>
                ) : null}
              </div>
              
              {/* Submit Button */}
              <button 
                type="submit" 
                className="btn btn-primary btn-lg w-full"
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center">
                    <div className="spinner mr-2"></div>
                    Creating Account...
                  </div>
                ) : (
                  'Create Account'
                )}
              </button>
            </form>
            
            {/* Footer */}
            <div className="mt-6 text-center">
              <p className="text-gray-600">
                Already have an account?{' '}
                <Link to="/login" className="text-blue-600 hover:text-blue-800 font-medium">
                  Sign in here
                </Link>
              </p>
            </div>

            {/* Demo Credentials */}
            <details className="mt-6 p-4 bg-gray-50 rounded-lg">
              <summary className="cursor-pointer text-sm font-medium text-gray-700 hover:text-gray-900 select-none">
                Quick Access - Demo Accounts
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

export default Register;
