import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const AdminRoute = () => {
  const { user, loading, isAdmin } = useAuth();

  if (loading) return null;
  if (!user || !isAdmin) return <Navigate to="/" replace />;

  return <Outlet />;
};

export default AdminRoute;
