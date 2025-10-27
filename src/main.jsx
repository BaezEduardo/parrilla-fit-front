import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import App from "./app.jsx";               // Home (tu menú público)
import AdminPanel from "./pages/AdminPanel.jsx"; // Panel admin
import { AppProvider } from "./context/AppContext.jsx";
import RequireAdmin from "./routes/RequireAdmin.jsx"; // guard de admin (paso 1)

import "./styles.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <AppProvider>
        <Routes>
          <Route path="/" element={<App />} />
          <Route
            path="/admin"
            element={
              <RequireAdmin>
                <AdminPanel />
              </RequireAdmin>
            }
          />
          {/* Opcional: 404
          <Route path="*" element={<div className="container">404 — Página no encontrada</div>} />
          */}
        </Routes>
      </AppProvider>
    </BrowserRouter>
  </React.StrictMode>
);
