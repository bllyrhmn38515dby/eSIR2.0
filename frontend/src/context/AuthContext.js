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
  }, []);

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
      const response = await axios.post('http://localhost:3001/api/auth/refresh', {
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
    
    if (currentToken) {
      try {
        console.log('🔍 Checking authentication with token...');
        const response = await axios.get('http://localhost:3001/api/auth/profile', {
          headers: { Authorization: `Bearer ${currentToken}` }
        });
        console.log('✅ Profile response:', response.data);
        
        if (response.data.success && response.data.data) {
          setUser(response.data.data);
          setToken(currentToken);
          // Set axios default header
          axios.defaults.headers.common['Authorization'] = `Bearer ${currentToken}`;
          console.log('👤 User authenticated:', response.data.data.nama_lengkap);
        } else {
          console.log('❌ Invalid profile response format, trying refresh...');
          // Coba refresh token dulu
          const refreshResult = await refreshToken();
          if (!refreshResult.success) {
            console.log('❌ Refresh failed, logging out...');
            logout();
          }
        }
      } catch (error) {
        console.error('❌ Token invalid, trying refresh:', error.response?.data || error.message);
        // Coba refresh token sebelum logout
        const refreshResult = await refreshToken();
        if (!refreshResult.success) {
          console.log('❌ Refresh failed, logging out...');
          logout();
        }
      }
    } else {
      console.log('🔍 No token found, user not authenticated');
    }
    setLoading(false);
  }, [refreshToken, logout]);

  // Check if user is authenticated on app load
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const login = async (email, password) => {
    try {
      console.log('🔐 Attempting login with:', { email });
      
      const response = await axios.post('http://localhost:3001/api/auth/login', {
        email,
        password
      });

      console.log('✅ Login response:', response.data);

      if (response.data.success) {
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
          message: 'Response format tidak valid'
        };
      }
    } catch (error) {
      console.error('❌ Login error:', error.response?.data || error.message);
      return {
        success: false,
        message: error.response?.data?.message || 'Login gagal'
      };
    }
  };

  const register = async (userData) => {
    try {
      const response = await axios.post('http://localhost:3001/api/auth/register', userData);
      return { success: true, data: response.data.data };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Registrasi gagal'
      };
    }
  };

  const value = {
    user,
    token,
    loading,
    isRefreshing,
    login,
    register,
    logout,
    refreshToken,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
