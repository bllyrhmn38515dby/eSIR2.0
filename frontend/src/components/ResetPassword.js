import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import './ResetPassword.css';

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    newPassword: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [tokenValid, setTokenValid] = useState(false);
  const [userInfo, setUserInfo] = useState(null);

  const token = searchParams.get('token');

  useEffect(() => {
    const verifyToken = async () => {
      try {
        const response = await axios.get(`/api/auth/verify-reset-token/${token}`);
        
        if (response.data.success) {
          setTokenValid(true);
          setUserInfo(response.data.data);
        } else {
          setError('Token tidak valid atau sudah kadaluarsa');
        }
      } catch (error) {
        console.error('Error verifying token:', error);
        setError('Token tidak valid atau sudah kadaluarsa');
      } finally {
        setVerifying(false);
      }
    };

    if (!token) {
      setError('Token reset password tidak ditemukan');
      setVerifying(false);
      return;
    }

    verifyToken();
  }, [token]);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    // Validasi password
    if (formData.newPassword.length < 6) {
      setError('Password minimal 6 karakter');
      setLoading(false);
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setError('Konfirmasi password tidak cocok');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post('/api/auth/reset-password', {
        token,
        newPassword: formData.newPassword
      });

      if (response.data.success) {
        setMessage(response.data.message);
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      } else {
        setError(response.data.message);
      }
    } catch (error) {
      console.error('Error reset password:', error);
      setError(error.response?.data?.message || 'Terjadi kesalahan saat reset password');
    } finally {
      setLoading(false);
    }
  };

  if (verifying) {
    return (
      <div className="reset-password-container">
        <div className="reset-password-card">
          <div className="loading">Memverifikasi token...</div>
        </div>
      </div>
    );
  }

  if (!tokenValid) {
    return (
      <div className="reset-password-container">
        <div className="reset-password-card">
          <div className="reset-password-header">
            <h1>eSIR 2.0</h1>
            <p>Reset Password</p>
          </div>
          
          <div className="error-message">
            {error}
          </div>
          
          <div className="form-footer">
            <button 
              onClick={() => navigate('/forgot-password')} 
              className="btn-secondary"
            >
              Minta Link Reset Baru
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="reset-password-container">
      <div className="reset-password-card">
        <div className="reset-password-header">
          <h1>eSIR 2.0</h1>
          <p>Reset Password</p>
        </div>
        
        {userInfo && (
          <div className="user-info">
            <p>Reset password untuk: <strong>{userInfo.email}</strong></p>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="reset-password-form">
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
            <label htmlFor="newPassword">Password Baru</label>
            <input
              type="password"
              id="newPassword"
              name="newPassword"
              value={formData.newPassword}
              onChange={handleInputChange}
              required
              placeholder="Masukkan password baru (min. 6 karakter)"
              disabled={loading}
              minLength={6}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="confirmPassword">Konfirmasi Password</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              required
              placeholder="Konfirmasi password baru"
              disabled={loading}
            />
          </div>
          
          <button 
            type="submit" 
            className="btn-submit"
            disabled={loading}
          >
            {loading ? 'Mereset Password...' : 'Reset Password'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
