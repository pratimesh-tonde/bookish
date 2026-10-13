import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = () => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return null; // avoid flashing a redirect while session check is in flight
  if (!user) return <Navigate to="/login" state={{ from: location }} replace />;

  return <Outlet />;
};

export default ProtectedRoute;
