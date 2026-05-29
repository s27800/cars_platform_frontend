import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks';


const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const { isAuthenticated, isAdmin, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-500 border-t-transparent" />
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
