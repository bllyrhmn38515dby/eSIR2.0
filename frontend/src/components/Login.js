import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLastPage } from '../context/LastPageContext';
import './Login.css';

const Login = () => {
  const [formData, setFormData] = useState({
    emailOrUsername: '',
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
      console.log('📝 Form data:', formData);
      console.log('📝 EmailOrUsername:', formData.emailOrUsername);
      console.log('📝 Password:', formData.password ? '***' : 'empty');
      
      // Clear any existing session data first
      localStorage.removeItem('token');
      
      const result = await login(formData.emailOrUsername, formData.password);
      
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
          <div style={{ marginTop: '20px', textAlign: 'center' }}>
            <button 
              onClick={() => {
                localStorage.removeItem('token');
                window.location.reload();
              }}
              style={{
                padding: '8px 16px',
                backgroundColor: '#e74c3c',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Force Logout & Reload
            </button>
          </div>
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
          {/* Debug info - DISABLED */}
          {/* <div style={{ 
            fontSize: '12px', 
            color: '#666', 
            marginTop: '10px',
            padding: '5px',
            backgroundColor: '#f5f5f5',
            borderRadius: '3px'
          }}>
            Debug: Auth={isAuthenticated ? 'Yes' : 'No'}, Loading={authLoading ? 'Yes' : 'No'}, Token={localStorage.getItem('token') ? 'Exists' : 'None'}
          </div> */}
        </div>
        
        <form onSubmit={handleSubmit} className="login-form">
          {error && (
            <div className="error-message">
              {error}
            </div>
          )}
          
          <div className="form-group">
            <label htmlFor="emailOrUsername">Email atau Username</label>
            <input
              type="text"
              id="emailOrUsername"
              name="emailOrUsername"
              value={formData.emailOrUsername}
              onChange={handleChange}
              required
              placeholder="Masukkan email atau username"
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
