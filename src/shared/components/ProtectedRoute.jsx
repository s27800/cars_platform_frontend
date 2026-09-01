import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks';
import { Spinner } from './ui';


// Route guard: sends anonymous visitors to the login page, non-admins home
const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const { isAuthenticated, isAdmin, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!isAuthenticated)
    return <Navigate to="/login" state={{ from: location }} replace />;

  if (requireAdmin && !isAdmin)
    return <Navigate to="/" replace />;

  return children;
};

export default ProtectedRoute;
