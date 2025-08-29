import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './ForgotPassword.css';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    try {
      const response = await axios.post('http://localhost:3001/api/auth/forgot-password', {
        email
      });

      if (response.data.success) {
        setMessage(response.data.message);
        setEmail('');
      } else {
        setError(response.data.message);
      }
    } catch (error) {
      console.error('Error forgot password:', error);
      setError(error.response?.data?.message || 'Terjadi kesalahan saat mengirim email reset password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="forgot-password-container">
      <div className="forgot-password-card">
        <div className="forgot-password-header">
          <h1>eSIR 2.0</h1>
          <p>Lupa Password</p>
        </div>
        
        <form onSubmit={handleSubmit} className="forgot-password-form">
          {error && (
            <div className="error-message">
              {error}
            </div>
          )}
          
          {message && (
            <div className="success-message">
              {message}
            </div>
          )}
          
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Masukkan email yang terdaftar"
              disabled={loading}
            />
          </div>
          
          <button 
            type="submit" 
            className="btn-submit"
            disabled={loading}
          >
            {loading ? 'Mengirim...' : 'Kirim Link Reset Password'}
          </button>
          
          <div className="form-footer">
            <Link to="/login" className="back-to-login">
              ← Kembali ke Login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
