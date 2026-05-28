import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';


/**
 * Custom hook to access authentication context
 * Provides access to auth state and methods
 * 
 * @returns {object} Authentication Context - contains:
 * - user: Current user object
 * - token: JWT token string
 * - isAuthenticated: Boolean
 * - isAdmin: Boolean
 * - isLoading: Boolean
 * - error: Error message string
 * - login: Login function
 * - register: Register function
 * - logout: Logout function
 * - clearError: Clear error function
 * - updateUser: Update user function
 * 
 * @throws {Error} outside of AuthProvider
 */
const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context)
    throw new Error('useAuth must be used within an AuthProvider.');

  return context;
};

export default useAuth;
