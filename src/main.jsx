import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import App from "./app.jsx"; // página principal
import AdminPanel from "./pages/AdminPanel.jsx"; // panel admin

import { AuthProvider } from "./context/AuthContext.jsx";
import { AppProvider } from "./context/AppContext.jsx"; // si tienes estados globales adicionales
import RequireAdmin from "./routes/RequireAdmin.jsx"; // protección de rutas

import "./styles.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <AppProvider>
          <Routes>
            {/* Ruta pública */}
            <Route path="/" element={<App />} />

            {/* Ruta protegida */}
            <Route
              path="/admin"
              element={
                <RequireAdmin>
                  <AdminPanel />
                </RequireAdmin>
              }
            />

            {/* Ruta 404 opcional */}
            {/* 
            <Route
              path="*"
              element={<div className="container">404 — Página no encontrada</div>}
            />
            */}
          </Routes>
        </AppProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
