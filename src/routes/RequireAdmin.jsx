// src/routes/RequireAdmin.jsx
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function RequireAdmin({ children }) {
  const { user, booting } = useAuth();
  const loc = useLocation();

  if (booting) {
    // Puedes personalizar este loader
    return <div className="container" style={{ padding: 24 }}>Cargando…</div>;
  }

  if (!user) {
    // Redirige al inicio (no tienes /login separado)
    return <Navigate to="/" replace state={{ from: loc }} />;
  }

  // 🔑 validación real de admin
  if (user.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return children;
}
