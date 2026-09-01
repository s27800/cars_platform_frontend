import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';


// Reads the authentication context and fails loudly outside its provider
const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context)
    throw new Error('useAuth must be used within an AuthProvider');

  return context;
};

export default useAuth;
