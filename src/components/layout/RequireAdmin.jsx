import { Navigate, useLocation } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

export default function RequireAdmin({ children }) {
  const { user, isAdmin, booting } = useAuth();
  const loc = useLocation();
  if (booting) return null;
  if (!user) return <Navigate to={`/?login=1`} state={{ from: loc }} replace />;
  if (!isAdmin) return <Navigate to="/perfil" replace />;
  return children;
}
