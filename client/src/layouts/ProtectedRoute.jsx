import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function ProtectedRoute() {
  const { user, hydrated } = useAuth();
  if (!hydrated) {
    // Optionally show a spinner or nothing while hydrating
    return null;
  }
  if (!user) {
    return <Navigate to="/" replace />;
  }
  return <Outlet />;
}

export default ProtectedRoute;
