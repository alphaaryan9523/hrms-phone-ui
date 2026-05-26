import { Navigate, Outlet, useLocation } from 'react-router-dom';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import { useAuth } from '../context/AuthContext.jsx';

export default function ProtectedRoute() {
  const { isAuthenticated, tokenReady } = useAuth();
  const location = useLocation();

  if (!tokenReady) {
    return (
      <div className="screen-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
}
