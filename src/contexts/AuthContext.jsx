import { createContext, useState, useEffect, useCallback, useMemo } from 'react';
import * as authApi from '../api/auth';


// Constants
const TOKEN_KEY = 'token';
const USER_KEY = 'user';
const TOKEN_EXPIRY_KEY = 'tokenExpiry';
const TOKEN_DURATION_MS = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

// Create context
export const AuthContext = createContext(null);


/**
 * Decode JWT token payload
 * @param {string} token - JWT token string
 * @returns {object|null} - Decoded payload
 */
const decodeJwtPayload = (token) => {
  try {
    if (!token || typeof token !== 'string')
      return null;

    const parts = token.split('.');

    if (parts.length !== 3)
      return null;

    // Decode base64url to string
    const base64Url = parts[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');

    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );

    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Failed to decode JWT token:', error);
    return null;
  }
};

/**
 * Check if user has admin role
 * @param {object} user - User object
 * @returns {boolean} - True if user is admin
 */
const checkIsAdmin = (user) => {
  if (!user)
    return false;

  if (user.isAdmin === true)
    return true;

  if (Array.isArray(user.roles)) {
    return user.roles.some(role => 
      role === 'ROLE_ADMIN' || 
      role === 'ADMIN' || 
      role.authority === 'ROLE_ADMIN'
    );
  }

  if (user.role)
    return user.role === 'ROLE_ADMIN' || user.role === 'ADMIN';
  
  return false;
};

/**
 * Get stored authentication data from localStorage
 * @returns {object} - Object containing token, user, and expiry time
 */
const getStoredAuthData = () => {
  try {
    const token = localStorage.getItem(TOKEN_KEY);

    const userJson = localStorage.getItem(USER_KEY);
    const expiry = localStorage.getItem(TOKEN_EXPIRY_KEY);

    const user = userJson ? JSON.parse(userJson) : null;
    const expiryTime = expiry ? parseInt(expiry, 10) : null;
    
    return { token, user, expiryTime };
  } catch (error) {
    console.error('Failed to read auth data from localStorage:', error);
    return { token: null, user: null, expiryTime: null };
  }
};

/**
 * Store authentication data in localStorage
 * @param {string} token - JWT token
 * @param {object} user - User object
 */
const storeAuthData = (token, user) => {
  try {
    const expiryTime = Date.now() + TOKEN_DURATION_MS;
    
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    localStorage.setItem(TOKEN_EXPIRY_KEY, expiryTime.toString());
  } catch (error) {
    console.error('Failed to store auth data in localStorage:', error);
  }
};

/**
 * Clear authentication data from localStorage
 */
const clearAuthData = () => {
  try {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem(TOKEN_EXPIRY_KEY);
  } catch (error) {
    console.error('Failed to clear auth data from localStorage:', error);
  }
};

/**
 * Check if token is expired
 * @param {number} expiryTime - Token expiry timestamp
 * @returns {boolean} - True if token is expired
 */
const isTokenExpired = (expiryTime) => {
  if (!expiryTime) 
    return true;

  return Date.now() >= expiryTime;
};

/**
 * AuthProvider component
 * Provides authentication context to the application
 */
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const isAuthenticated = !!token && !!user;
  const isAdmin = checkIsAdmin(user);


  // Logout user function
  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    setError(null);
    clearAuthData();
  }, []);

  // Auth initialization
  useEffect(() => {
    const initializeAuth = () => {
      try {
        const { token: storedToken, user: storedUser, expiryTime } = getStoredAuthData();
        
        // Check stored token is valid and not expired
        if (storedToken && storedUser && !isTokenExpired(expiryTime)) {

          // Set auth state
          setToken(storedToken);
          setUser(storedUser);
        } else if (storedToken) {

          // Clear expired token data
          console.log('Token expired, logging out');
          clearAuthData();
        }
      } catch (error) {
        console.error('Failed to initialize auth:', error);
        clearAuthData();
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  // Auto-logout effect
  useEffect(() => {
    if (!token) 
      return;

    const { expiryTime } = getStoredAuthData();
    
    if (!expiryTime) 
      return;

    const timeUntilExpiry = expiryTime - Date.now();
    
    // Log out expired token
    if (timeUntilExpiry <= 0) {
      console.log('Token already expired, logging out');
      const timeoutId = setTimeout(logout, 0);
      return () => clearTimeout(timeoutId);
    }

    // Set auto-logout timer
    const timeoutId = setTimeout(() => {
      console.log('Token expired, auto-logging out');
      logout();
    }, timeUntilExpiry);

    return () => clearTimeout(timeoutId);
  }, [token, logout]);

  // Login function
  const login = useCallback(async (credentials) => {
    setIsLoading(true);
    setError(null);

    try {

      // Extract token from response
      const response = await authApi.login(credentials);
      const responseToken = response.token || response.accessToken;
      
      if (!responseToken)
        throw new Error('No token received from server');

      // Extract user data from response
      let userData = response.user || response;
      
      // Decode user data from token
      if (!userData.id && !userData.username) {
        const decodedToken = decodeJwtPayload(responseToken);

        if (decodedToken) {
          userData = {
            id: decodedToken.userId || decodedToken.sub,
            username: decodedToken.username || decodedToken.sub,
            email: decodedToken.email,
            roles: decodedToken.roles || decodedToken.authorities || [],
            firstName: decodedToken.firstName,
            lastName: decodedToken.lastName,
          };
        }
      }

      // Remove token and accessToken from user data
      const { token: _token, accessToken: _accessToken, ...cleanUserData } = userData;

      void _token;
      void _accessToken;

      // Update state
      setToken(responseToken);
      setUser(cleanUserData);
      
      // Store in localStorage
      storeAuthData(responseToken, cleanUserData);
      
      return cleanUserData;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error ||
                          error.message || 
                          'Login failed. Please check your credentials.';

      setError(errorMessage);

      throw new Error(errorMessage, { cause: error });
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Register function
  const register = useCallback(async (userData) => {
    setIsLoading(true);
    setError(null);

    try {

      // Register user
      const response = await authApi.register(userData);
      
      // Extract token from response
      const responseToken = response.token || response.accessToken;
      
      if (responseToken) {

        // Auto-login after registration
        let registeredUser = response.user || response;
        
        // Decode user data from token if not provided in response
        if (!registeredUser.id && !registeredUser.username) {
          const decodedToken = decodeJwtPayload(responseToken);

          if (decodedToken) {
            registeredUser = {
              id: decodedToken.userId || decodedToken.sub,
              username: decodedToken.username || decodedToken.sub,
              email: decodedToken.email,
              roles: decodedToken.roles || decodedToken.authorities || [],
              firstName: decodedToken.firstName,
              lastName: decodedToken.lastName,
            };
          }
        }

        // Remove token and accessToken from user data
        const { token: _token, accessToken: _accessToken, ...cleanUserData } = registeredUser;

        void _token;
        void _accessToken;

        // Update state and localStorage
        setToken(responseToken);
        setUser(cleanUserData);

        storeAuthData(responseToken, cleanUserData);
        
        return cleanUserData;
      }

      return response;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error ||
                          error.message || 
                          'Registration failed. Please try again.';

      setError(errorMessage);

      throw new Error(errorMessage, { cause: error });
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Clear error function
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Update user data in state and localStorage
  const updateUser = useCallback((updatedUserData) => {
    setUser(currentUser => {
      const newUser = { ...currentUser, ...updatedUserData };
      
      if (token)
        storeAuthData(token, newUser);
      
      return newUser;
    });
  }, [token]);

  // Memoize context value
  const contextValue = useMemo(() => ({

    // State
    user,
    token,
    isAuthenticated,
    isAdmin,
    isLoading,
    error,
    
    // Methods
    login,
    register,
    logout,
    clearError,
    updateUser,
  }), [
    user,
    token,
    isAuthenticated,
    isAdmin,
    isLoading,
    error,
    login,
    register,
    logout,
    clearError,
    updateUser,
  ]);


  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
