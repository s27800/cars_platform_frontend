import { createContext, useState, useEffect, useCallback, useMemo } from 'react';
import * as authApi from '../api/auth';
import { STORAGE_KEYS } from '../utils/constants';


// Only used when a token arrives without an `exp` claim
const FALLBACK_TOKEN_LIFETIME_MS = 24 * 60 * 60 * 1000;

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
  } catch {
    return null;
  }
};

/**
 * Check if user has admin role
 * @param {object} user - User object
 * @returns {boolean} - True if user is admin
 */
const checkIsAdmin = (user) => {
  return user?.isAdmin === true;
};

/**
 * Get stored authentication data from localStorage
 * @returns {object} - Object containing token, user, and expiry time
 */
const getStoredAuthData = () => {
  try {
    const token = localStorage.getItem(STORAGE_KEYS.TOKEN);

    const userJson = localStorage.getItem(STORAGE_KEYS.USER);
    const expiry = localStorage.getItem(STORAGE_KEYS.TOKEN_EXPIRY);

    const user = userJson ? JSON.parse(userJson) : null;
    const expiryTime = expiry ? parseInt(expiry, 10) : null;

    return { token, user, expiryTime };
  } catch {
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
    const decoded = decodeJwtPayload(token);
    const expiryTime = decoded?.exp ? decoded.exp * 1000 : Date.now() + FALLBACK_TOKEN_LIFETIME_MS;

    localStorage.setItem(STORAGE_KEYS.TOKEN, token);
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    localStorage.setItem(STORAGE_KEYS.TOKEN_EXPIRY, expiryTime.toString());
  } catch {
    // nothing was stored
  }
};

/**
 * Clear authentication data from localStorage
 */
const clearAuthData = () => {
  try {
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER);
    localStorage.removeItem(STORAGE_KEYS.TOKEN_EXPIRY);
  } catch {
    // nothing was stored
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


  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    setError(null);
    clearAuthData();
  }, []);

  // Restore the session from localStorage
  useEffect(() => {
    const initializeAuth = () => {
      try {
        const { token: storedToken, user: storedUser, expiryTime } = getStoredAuthData();

        if (storedToken && storedUser && !isTokenExpired(expiryTime)) {
          setToken(storedToken);
          setUser(storedUser);
        } else if (storedToken) {
          clearAuthData();
        }
      } catch {
        clearAuthData();
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  // Log out by itself the moment the token expires
  useEffect(() => {
    if (!token)
      return;

    const { expiryTime } = getStoredAuthData();

    if (!expiryTime)
      return;

    const timeUntilExpiry = expiryTime - Date.now();

    if (timeUntilExpiry <= 0) {
      const timeoutId = setTimeout(logout, 0);
      return () => clearTimeout(timeoutId);
    }

    const timeoutId = setTimeout(logout, timeUntilExpiry);

    return () => clearTimeout(timeoutId);
  }, [token, logout]);

  const login = useCallback(async (credentials) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await authApi.login(credentials);

      if (!response.accessToken)
        throw new Error('No token received from server');

      const userData = {
        id: response.userId,
        username: response.username,
        isAdmin: response.isAdmin,
      };

      // Update state
      setToken(response.accessToken);
      setUser(userData);

      // Store in localStorage
      storeAuthData(response.accessToken, userData);

      return userData;
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

  const register = useCallback(async (userData) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await authApi.register(userData);

      if (response.accessToken) {
        const registeredUser = {
          id: response.userId,
          username: response.username,
          isAdmin: response.isAdmin,
        };

        setToken(response.accessToken);
        setUser(registeredUser);

        storeAuthData(response.accessToken, registeredUser);

        return registeredUser;
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

  const clearError = useCallback(() => {
    setError(null);
  }, []);

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
