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
  const [shakeForm, setShakeForm] = useState(false);
  
  const { login, isAuthenticated, loading: authLoading } = useAuth();
  const { getLastPage, clearLastPage } = useLastPage();
  const navigate = useNavigate();

  // Auto redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && !authLoading) {
      const lastPage = getLastPage();
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

  const triggerShakeAnimation = () => {
    setShakeForm(true);
    setTimeout(() => {
      setShakeForm(false);
    }, 500); // Duration matches CSS animation
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Clear any existing session data first
      localStorage.removeItem('token');
      
      const result = await login(formData.emailOrUsername, formData.password);
      
      if (result.success) {
        const lastPage = getLastPage();
        navigate(lastPage);
        clearLastPage(); // Clear the last page after redirect
        } else {
          setError(result.message);
          triggerShakeAnimation();
        }
      } catch (error) {
        setError('Terjadi kesalahan saat login');
        triggerShakeAnimation();
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
              className="btn-submit"
              style={{ maxWidth: '200px' }}
            >
              Force Logout & Reload
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Predefined positions for background text
  const positions = [
    { top: "10%", left: "15%", rotate: "-10deg" },
    { top: "25%", left: "70%", rotate: "15deg" },
    { top: "40%", left: "5%", rotate: "-20deg" },
    { top: "60%", left: "60%", rotate: "10deg" },
    { top: "75%", left: "20%", rotate: "5deg" },
    { top: "85%", left: "80%", rotate: "-15deg" },
  ];

  return (
    <div className="login-container">
      {/* Background abstract text */}
      <div className="login-background">
        {positions.map((pos, i) => (
          <span
            key={i}
            className="login-bg-text"
            style={{
              top: pos.top,
              left: pos.left,
              transform: `rotate(${pos.rotate})`,
            }}
          >
            eSIR2.0
          </span>
        ))}
      </div>

      <div className="login-card">
        {/* Overlay: reflection + bubbles */}
        <div className="login-card-overlay">
          <div className="login-reflection" />
          <div className="login-bubble1" />
          <div className="login-bubble2" />
          <div className="login-bubble3" /> {/* Tambahan bubble baru */}
        </div>

        <div className="login-content">
          {/* Logo / Title */}
          <div className="login-header">
            <div className="login-logo">
              <img 
                src="/esir20vlogo.png" 
                alt="eSIR 2.0 Logo" 
                className="login-logo-img"
              />
            </div>
            <p>Sistem Informasi Rujukan Online</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className={`login-form ${shakeForm ? 'shake' : ''}`}>
            {error && (
              <div className="error-message">
                {error}
              </div>
            )}
            
            {/* Email */}
            <div className="form-group">
              <label htmlFor="emailOrUsername">Email atau Username</label>
              <div className="input-container">
                <input
                  type="text"
                  id="emailOrUsername"
                  name="emailOrUsername"
                  value={formData.emailOrUsername}
                  onChange={handleChange}
                  required
                  placeholder="Masukkan email atau username"
                  className="form-input"
                />
              </div>
            </div>
            
            {/* Password */}
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <div className="input-container">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  placeholder="Masukkan password"
                  className="form-input password-field"
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={togglePasswordVisibility}
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            {/* Remember me + Forgot */}
            <div className="form-options">
              <label className="remember-me">
                <input type="checkbox" />
                <span>Ingat saya</span>
              </label>
              <Link to="/forgot-password" className="forgot-password-link">
                Lupa Password?
              </Link>
            </div>
            
            {/* Button */}
            <button 
              type="submit" 
              className="btn-submit"
              disabled={loading}
            >
              {loading ? 'Masuk...' : '🔑 Masuk'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
