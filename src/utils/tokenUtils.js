// Token utility functions for development and debugging

/**
 * Clear the current authentication token from localStorage
 */
export const clearAuthToken = () => {
  localStorage.removeItem('authToken');
  console.log('✅ Auth token cleared from localStorage');
};

/**
 * Get the current authentication token from localStorage
 */
export const getCurrentToken = () => {
  return localStorage.getItem('authToken');
};

/**
 * Set a new authentication token in localStorage
 */
export const setAuthToken = (token) => {
  localStorage.setItem('authToken', token);
  console.log('✅ New auth token set in localStorage');
};

/**
 * Refresh the demo token (useful for development)
 */
export const refreshDemoToken = () => {
  clearAuthToken();
  // Force a page reload to trigger token recreation
  window.location.reload();
};

/**
 * Check if the current token is valid by making a test API call
 */
export const validateToken = async () => {
  try {
    const token = getCurrentToken();
    if (!token) {
      console.log('❌ No token found');
      return false;
    }

    const response = await fetch(`${process.env.REACT_APP_API_URL || 'https://clicko-flow-api.onrender.com/api'}/health`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (response.ok) {
      console.log('✅ Token is valid');
      return true;
    } else {
      console.log('❌ Token is invalid:', response.status);
      return false;
    }
  } catch (error) {
    console.error('❌ Error validating token:', error);
    return false;
  }
};
