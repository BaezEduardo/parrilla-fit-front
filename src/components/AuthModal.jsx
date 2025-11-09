// src/components/AuthModal.jsx
import { useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function AuthModal({ open, onClose }) {
  const { login, register } = useAuth();
  const [mode, setMode] = useState("login"); // "login" | "register"
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  if (!open) return null;

  function onBackdropClick(e) {
    if (e.target === e.currentTarget) onClose?.();
  }

  async function onSubmit(e) {
    e.preventDefault();
    setErr("");
    setLoading(true);
    try {
      if (mode === "login") {
        await login({ phone, password });
      } else {
        await register({ name, phone, password });
      }
      onClose?.(); // cerrar al éxito
    } catch (e2) {
      setErr(e2.message || "Error");
    } finally {
      setLoading(false);
    }
  }

  const subtitle =
    mode === "login" ? "¡Bienvenido! Inicia sesión" : "Crea una nueva cuenta";

  return (
    <div className="modal" role="dialog" aria-modal="true" onClick={onBackdropClick}>
      <div className="modal__dialog" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal__header">
          <h3>
            La Parrilla <span className="accent">Fit</span>
          </h3>
          <button className="btn icon" onClick={onClose} aria-label="Cerrar">✕</button>
        </div>

        {/* Body */}
        <div className="modal__body">
          <p className="modal__subtitle">{subtitle}</p>

          <form onSubmit={onSubmit} className="modal__form">
            <div className="form-card">
              {mode === "register" && (
                <div className="field">
                  <label>Nombre</label>
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
              )}

              <div className="field">
                <label>Número de teléfono</label>
                <input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="222-123-4567"
                  required
                />
              </div>

              <div className="field">
                <label>Contraseña</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Contraseña"
                  required
                />
              </div>

              {err && <div className="error">{err}</div>}
            </div>

            {/* Footer fijo */}
            <div className="modal__footer">
              <button className="btn" type="button" onClick={onClose}>
                Cancelar
              </button>
              <button className="btn primary" disabled={loading}>
                {loading
                  ? "Procesando..."
                  : mode === "login"
                  ? "Iniciar sesión"
                  : "Registrarse"}
              </button>
            </div>
          </form>

          {/* Switch de modo */}
          <div className="modal__switch">
            {mode === "login" ? (
              <button className="link" onClick={() => setMode("register")}>
                ¿No tienes cuenta? Regístrate
              </button>
            ) : (
              <button className="link" onClick={() => setMode("login")}>
                ¿Ya tienes cuenta? Inicia sesión
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
