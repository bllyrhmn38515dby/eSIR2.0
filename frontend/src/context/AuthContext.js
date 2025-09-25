import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    console.log('👋 User logged out');
  }, []);

  const refreshToken = useCallback(async () => {
    if (isRefreshing) {
      return { success: false };
    }

    setIsRefreshing(true);
    try {
      const currentToken = localStorage.getItem('token');
      if (!currentToken) {
        return { success: false };
      }

      console.log('🔄 Attempting to refresh token...');
      const response = await axios.post(`${process.env.REACT_APP_API_URL || 'http://192.168.1.7:3001/api'}/auth/refresh`, {
        token: currentToken
      });

      if (response.data.success) {
        const newToken = response.data.data.token;
        const userData = response.data.data.user;
        
        setToken(newToken);
        setUser(userData);
        localStorage.setItem('token', newToken);
        
        // Update axios default header
        axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
        
        console.log('✅ Token refreshed successfully');
        return { success: true, token: newToken };
      } else {
        console.log('❌ Token refresh failed: Invalid response');
        return { success: false };
      }
    } catch (error) {
      console.error('❌ Refresh token error:', error.response?.data || error.message);
      return { success: false };
    } finally {
      setIsRefreshing(false);
    }
  }, [isRefreshing]);

  const checkAuth = useCallback(async () => {
    const currentToken = localStorage.getItem('token');
    console.log('🔍 Checking authentication...', { hasToken: !!currentToken });
    
    // Set timeout untuk mencegah loading terlalu lama
    const timeoutId = setTimeout(() => {
      console.log('⏰ Auth check timeout, setting loading to false');
      setLoading(false);
    }, 5000); // 5 detik timeout
    
    if (currentToken) {
      try {
        console.log('🔍 Checking authentication with token...');
        const response = await axios.get(`${process.env.REACT_APP_API_URL || 'http://192.168.1.7:3001/api'}/auth/profile`, {
          headers: { Authorization: `Bearer ${currentToken}` },
          timeout: 3000 // 3 detik timeout untuk request
        });
        console.log('✅ Profile response:', response.data);
        
        if (response.data.success && response.data.data) {
          setUser(response.data.data);
          setToken(currentToken);
          // Set axios default header
          axios.defaults.headers.common['Authorization'] = `Bearer ${currentToken}`;
          console.log('👤 User authenticated:', response.data.data.nama_lengkap);
        } else {
          console.log('❌ Invalid profile response format, logging out...');
          logout();
        }
      } catch (error) {
        console.error('❌ Token invalid:', error.response?.data || error.message);
        
        // Handle different error types
        if (error.code === 'ECONNREFUSED' || error.message.includes('Network Error') || error.code === 'ECONNABORTED') {
          console.log('⚠️ Server not available or timeout, clearing token and allowing login');
          logout(); // Clear token jika server tidak tersedia
        } else if (error.response?.status === 401) {
          console.log('❌ Token expired or invalid, logging out...');
          logout();
        } else {
          console.log('❌ Other error, logging out...');
          logout();
        }
      }
    } else {
      console.log('🔍 No token found, user not authenticated');
    }
    
    clearTimeout(timeoutId);
    setLoading(false);
  }, [logout]);

  // Check if user is authenticated on app load
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // Setup axios default config dengan interceptor
  useEffect(() => {
    // Request interceptor untuk menambahkan token
    const requestInterceptor = axios.interceptors.request.use(
      (config) => {
        const currentToken = localStorage.getItem('token');
        if (currentToken) {
          config.headers.Authorization = `Bearer ${currentToken}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor untuk handle token expired
    const responseInterceptor = axios.interceptors.response.use(
      (response) => {
        return response;
      },
      async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          // Coba refresh token
          try {
            const refreshResult = await refreshToken();
            if (refreshResult.success) {
              // Retry original request dengan token baru
              originalRequest.headers.Authorization = `Bearer ${refreshResult.token}`;
              return axios(originalRequest);
            } else {
              // Refresh gagal, logout user
              logout();
              return Promise.reject(error);
            }
          } catch (refreshError) {
            console.error('Token refresh failed:', refreshError);
            logout();
            return Promise.reject(error);
          }
        }

        return Promise.reject(error);
      }
    );

    // Cleanup interceptors
    return () => {
      axios.interceptors.request.eject(requestInterceptor);
      axios.interceptors.response.eject(responseInterceptor);
    };
  }, [logout, refreshToken]);

  const login = async (emailOrUsername, password) => {
    try {
      console.log('🔐 Attempting login with:', { emailOrUsername });
      console.log('📤 Sending to API:', { emailOrUsername, password: password ? '***' : 'empty' });
      
      // Clear any existing token first
      localStorage.removeItem('token');
      setToken(null);
      setUser(null);
      
      const response = await axios.post(`${process.env.REACT_APP_API_URL || 'http://192.168.1.7:3001/api'}/auth/login`, {
        emailOrUsername,
        password
      });

      console.log('✅ Login response:', response.data);

      if (response.data && response.data.success) {
        const { user: userData, token: userToken } = response.data.data || response.data;
        
        console.log('👤 User data:', userData);
        console.log('🔑 Token:', userToken ? 'Token received' : 'No token');
        
        setUser(userData);
        setToken(userToken);
        localStorage.setItem('token', userToken);
        
        // Set axios default header
        axios.defaults.headers.common['Authorization'] = `Bearer ${userToken}`;
        
        console.log('✅ Login successful, user authenticated');
        return { success: true };
      } else {
        return {
          success: false,
          message: response.data?.message || 'Response format tidak valid'
        };
      }
    } catch (error) {
      console.error('❌ Login error:', error.response?.data || error.message);
      
      // Handle different types of errors
      if (error.code === 'ECONNREFUSED' || error.message.includes('Network Error')) {
        return {
          success: false,
          message: 'Server tidak tersedia. Pastikan backend berjalan di port 3001.'
        };
      } else if (error.response?.status === 401) {
        return {
          success: false,
          message: 'Email atau password salah'
        };
      } else if (error.response?.status === 500) {
        return {
          success: false,
          message: 'Terjadi kesalahan server. Silakan coba lagi.'
        };
      } else {
        return {
          success: false,
          message: error.response?.data?.message || 'Login gagal. Silakan coba lagi.'
        };
      }
    }
  };

  const register = async (userData) => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL || 'http://192.168.1.7:3001/api'}/auth/register`, userData);
      return { success: true, data: response.data.data };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Registrasi gagal'
      };
    }
  };

  const forceLogout = useCallback(async () => {
    try {
      const currentToken = localStorage.getItem('token');
      if (currentToken) {
        await axios.post(`${process.env.REACT_APP_API_URL || 'http://192.168.1.7:3001/api'}/auth/force-logout`, {}, {
          headers: { Authorization: `Bearer ${currentToken}` }
        });
        console.log('🔄 Force logout successful');
      }
    } catch (error) {
      console.error('❌ Force logout error:', error);
    } finally {
      logout();
    }
  }, [logout]);

  const value = {
    user,
    token,
    loading,
    isRefreshing,
    login,
    register,
    logout,
    forceLogout,
    refreshToken,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
