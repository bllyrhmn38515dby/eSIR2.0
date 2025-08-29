import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLastPage } from '../context/LastPageContext';
import './Login.css';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const { login, isAuthenticated, loading: authLoading } = useAuth();
  const { getLastPage, clearLastPage } = useLastPage();
  const navigate = useNavigate();

  // Auto redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && !authLoading) {
      const lastPage = getLastPage();
      console.log('🔄 User already authenticated, redirecting to:', lastPage);
      navigate(lastPage);
    }
  }, [isAuthenticated, authLoading, navigate, getLastPage]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      console.log('🚀 Submitting login form...');
      const result = await login(formData.email, formData.password);
      
      if (result.success) {
        const lastPage = getLastPage();
        console.log('✅ Login successful, redirecting to:', lastPage);
        navigate(lastPage);
        // Clear the last page after successful redirect
        clearLastPage();
      } else {
        console.log('❌ Login failed:', result.message);
        setError(result.message);
      }
    } catch (error) {
      console.error('❌ Login error:', error);
      setError('Terjadi kesalahan saat login');
    } finally {
      setLoading(false);
    }
  };

  // Show loading if auth is still checking
  if (authLoading) {
    return (
      <div className="login-container">
        <div className="login-card">
          <div className="loading">Memeriksa autentikasi...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h1>eSIR 2.0</h1>
          <p>Sistem Informasi Rujukan Online</p>
        </div>
        
        <form onSubmit={handleSubmit} className="login-form">
          {error && (
            <div className="error-message">
              {error}
            </div>
          )}
          
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="Masukkan email"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className="password-input-container">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="Masukkan password"
              />
              <button
                type="button"
                className="password-toggle"
                onClick={togglePasswordVisibility}
              >
                {showPassword ? '🙈' : '👁️'}
              </button>
            </div>
          </div>
          
          <button 
            type="submit" 
            className="btn-submit"
            disabled={loading}
          >
            {loading ? 'Masuk...' : 'Masuk'}
          </button>
          
          <div className="form-footer">
            <Link to="/forgot-password" className="forgot-password-link">
              Lupa Password?
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
