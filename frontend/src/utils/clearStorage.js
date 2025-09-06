// Utility untuk membersihkan browser storage
export const clearAllStorage = () => {
  try {
    // Clear localStorage
    localStorage.clear();
    console.log('✅ localStorage cleared');
    
    // Clear sessionStorage
    sessionStorage.clear();
    console.log('✅ sessionStorage cleared');
    
    // Clear cookies (jika ada)
    document.cookie.split(";").forEach((c) => {
      document.cookie = c
        .replace(/^ +/, "")
        .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
    });
    console.log('✅ cookies cleared');
    
    return true;
  } catch (error) {
    console.error('❌ Error clearing storage:', error);
    return false;
  }
};

// Clear hanya token
export const clearToken = () => {
  try {
    localStorage.removeItem('token');
    console.log('✅ Token cleared');
    return true;
  } catch (error) {
    console.error('❌ Error clearing token:', error);
    return false;
  }
};

// Check jika ada token
export const hasToken = () => {
  try {
    const token = localStorage.getItem('token');
    return !!token;
  } catch (error) {
    console.error('❌ Error checking token:', error);
    return false;
  }
};

// Get token
export const getToken = () => {
  try {
    return localStorage.getItem('token');
  } catch (error) {
    console.error('❌ Error getting token:', error);
    return null;
  }
};

// Set token
export const setToken = (token) => {
  try {
    localStorage.setItem('token', token);
    console.log('✅ Token set');
    return true;
  } catch (error) {
    console.error('❌ Error setting token:', error);
    return false;
  }
};
