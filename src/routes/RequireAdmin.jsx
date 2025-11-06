import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function RequireAdmin({ children }) {
  const { user, booting } = useAuth();
  const loc = useLocation();

  if (booting) return null; // o un loader
  if (!user) return <Navigate to="/" state={{ from: loc }} replace />;
  if (user.role !== "admin") return <Navigate to="/" replace />;

  return children;
}
