// src/routes/RequireAdmin.jsx
import { useContext } from "react";
import { AppContext } from "../context/AppContext.jsx";
import { Navigate } from "react-router-dom";

export default function RequireAdmin({ children }) {
  const { user } = useContext(AppContext);
  if (!user) return <Navigate to="/" replace />;
  if (user.role !== "admin") return <Navigate to="/" replace />;
  return children;
}
