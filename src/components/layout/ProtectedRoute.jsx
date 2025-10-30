import { Navigate, useLocation } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

export default function ProtectedRoute({ children }) {
  const { user, booting } = useAuth();
  const loc = useLocation();
  if (booting) return null;
  if (!user) return <Navigate to={`/?login=1`} state={{ from: loc }} replace />;
  return children;
}
