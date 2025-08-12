import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../api/axiosConfig';

const Signup = () => {
  const [step, setStep] = useState(1); // 1: Signup form, 2: OTP verification
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    role: 'user'
  });
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);

  const navigate = useNavigate();

  const { name, email, phone, password, confirmPassword, role } = formData;

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validation
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      setLoading(false);
      return;
    }

    try {
      const response = await api.post('/auth/register', {
        name,
        email,
        phone,
        password,
        role
      });

      if (response.data.success) {
        setStep(2);
      } else {
        setError(response.data.message);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }

    setLoading(false);
  };

  const verifyOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await api.post('/auth/verify-email', {
        email,
        otp
      });

      if (response.data.success) {
        // Store token
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        
        // Redirect to dashboard
        navigate('/dashboard');
      } else {
        setError(response.data.message);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'OTP verification failed');
    }

    setLoading(false);
  };

  const resendOTP = async () => {
    setResendLoading(true);
    setError('');

    try {
      const response = await api.post('/auth/resend-otp', {
        email,
        type: 'email'
      });

      if (response.data.success) {
        setError('');
        // Show success message temporarily
        setError('OTP sent successfully!');
        setTimeout(() => setError(''), 3000);
      } else {
        setError(response.data.message);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to resend OTP');
    }

    setResendLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-lg w-full space-y-8">
        {step === 1 ? (
          // Signup Form
          <div className="bg-white rounded-2xl shadow-2xl p-8 border-0 backdrop-blur-sm">
            <div className="text-center mb-8">
              <div className="mx-auto h-16 w-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mb-4">
                <span className="text-2xl">⚡</span>
              </div>
              <h2 className="text-3xl font-bold text-gray-900">Join QuickCourt</h2>
              <p className="text-gray-600 mt-2">Create your account and start booking!</p>
            </div>

            <form onSubmit={onSubmit} className="space-y-6">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                  {error}
                </div>
              )}

              <div className="space-y-1">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    value={name}
                    onChange={onChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 pl-12"
                    placeholder="Enter your full name"
                  />
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-400 text-lg">👤</span>
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={email}
                    onChange={onChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 pl-12"
                    placeholder="Enter your email"
                  />
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-400 text-lg">📧</span>
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number <span className="text-gray-400 text-sm">(Optional)</span>
                </label>
                <div className="relative">
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={phone}
                    onChange={onChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 pl-12"
                    placeholder="Enter your phone number"
                  />
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-400 text-lg">📱</span>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Account Type
                </label>
                <div className="space-y-3">
                  <div 
                    onClick={() => setFormData({...formData, role: 'user'})}
                    className={`cursor-pointer p-4 border-2 rounded-xl transition-all duration-200 ${
                      role === 'user' 
                        ? 'border-blue-500 bg-blue-50 shadow-md' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0 mt-1">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          role === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-600'
                        }`}>
                          👤
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center">
                          <h3 className="text-lg font-semibold text-gray-900">Regular User</h3>
                          {role === 'user' && (
                            <div className="ml-2 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                              <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            </div>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mt-1">
                          Book sports venues and manage your reservations
                        </p>
                      </div>
                    </div>
                  </div>

                  <div 
                    onClick={() => setFormData({...formData, role: 'facility_owner'})}
                    className={`cursor-pointer p-4 border-2 rounded-xl transition-all duration-200 ${
                      role === 'facility_owner' 
                        ? 'border-blue-500 bg-blue-50 shadow-md' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0 mt-1">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          role === 'facility_owner' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-600'
                        }`}>
                          🏢
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center">
                          <h3 className="text-lg font-semibold text-gray-900">Facility Owner</h3>
                          {role === 'facility_owner' && (
                            <div className="ml-2 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                              <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            </div>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mt-1">
                          Manage venues, courts, and bookings for your facilities
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <span className="text-yellow-600">💡</span>
                    </div>
                    <div className="ml-2">
                      <p className="text-sm text-yellow-800">
                        Choose your account type based on how you plan to use QuickCourt
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    value={password}
                    onChange={onChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 pl-12"
                    placeholder="Enter your password"
                    minLength={6}
                  />
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-400 text-lg">🔒</span>
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-1">Minimum 6 characters</p>
              </div>

              <div className="space-y-1">
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={onChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 pl-12"
                    placeholder="Confirm your password"
                    minLength={6}
                  />
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-400 text-lg">🔐</span>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Creating Account...
                  </div>
                ) : (
                  <div className="flex items-center justify-center">
                    <span className="mr-2">🚀</span>
                    Create Account
                  </div>
                )}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-gray-600">
                Already have an account?{' '}
                <Link to="/login" className="text-blue-600 hover:text-blue-500 font-medium">
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        ) : (
          // OTP Verification
          <div className="bg-white rounded-2xl shadow-2xl p-8 border-0 backdrop-blur-sm">
            <div className="text-center mb-8">
              <div className="mx-auto h-16 w-16 bg-gradient-to-br from-green-500 to-blue-600 rounded-2xl flex items-center justify-center mb-4">
                <span className="text-2xl">📧</span>
              </div>
              <h2 className="text-3xl font-bold text-gray-900">Check Your Email</h2>
              <p className="text-gray-600 mt-2">
                We've sent a verification code to<br />
                <span className="font-medium text-blue-600">{email}</span>
              </p>
            </div>

            <form onSubmit={verifyOTP} className="space-y-6">
              {error && (
                <div className={`border px-4 py-3 rounded-lg ${
                  error.includes('successfully') 
                    ? 'bg-green-50 border-green-200 text-green-700'
                    : 'bg-red-50 border-red-200 text-red-700'
                }`}>
                  {error}
                </div>
              )}

              <div className="space-y-1">
                <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-2 text-center">
                  Enter Verification Code
                </label>
                <div className="relative">
                  <input
                    id="otp"
                    name="otp"
                    type="text"
                    required
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    className="w-full px-4 py-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center text-2xl tracking-[0.5em] font-mono transition-all duration-200"
                    placeholder="000000"
                    maxLength={6}
                  />
                </div>
                <p className="text-xs text-gray-500 text-center mt-2">Enter the 6-digit code</p>
              </div>

              <button
                type="submit"
                disabled={loading || otp.length !== 6}
                className="w-full bg-gradient-to-r from-green-600 to-blue-600 text-white py-3 px-4 rounded-xl font-semibold hover:from-green-700 hover:to-blue-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Verifying...
                  </div>
                ) : (
                  <div className="flex items-center justify-center">
                    <span className="mr-2">✅</span>
                    Verify Email
                  </div>
                )}
              </button>
            </form>

            <div className="mt-6 text-center space-y-4">
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                <p className="text-gray-600 text-sm mb-3">
                  Didn't receive the code?
                </p>
                <button
                  onClick={resendOTP}
                  disabled={resendLoading}
                  className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {resendLoading ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600 mr-2"></div>
                      Sending...
                    </div>
                  ) : (
                    '📤 Resend Code'
                  )}
                </button>
              </div>
              
              <button
                onClick={() => setStep(1)}
                className="text-gray-500 hover:text-gray-700 text-sm font-medium flex items-center justify-center"
              >
                ← Back to signup
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Signup;
