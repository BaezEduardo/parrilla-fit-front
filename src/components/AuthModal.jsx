import { useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function AuthModal({ open, onClose }) {
  const { login, register } = useAuth();
  const [mode, setMode] = useState("login"); // "login" | "register"
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user"); // user | admin
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  if (!open) return null;

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
    } catch (e) {
      setErr(e.message || "Error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal__header">
          <h3>La Parrilla <span className="accent">Fit</span></h3>
          <button className="btn icon" onClick={onClose} aria-label="Cerrar">✕</button>
        </div>

        <p className="modal__subtitle">
          {mode === "login" ? "¡Bienvenido! Inicia sesión" : "Crea una nueva cuenta"}
        </p>

        <form onSubmit={onSubmit} className="modal__form">
          {mode === "register" && (
            <div className="field">
              <label>Nombre</label>
              <input value={name} onChange={(e) => setName(e.target.value)} required />
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
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Contraseña" required />
          </div>

          

          {err && <div className="error">{err}</div>}

          <button className="btn primary" disabled={loading}>
            {loading ? "Procesando..." : mode === "login" ? "Iniciar sesión" : "Registrarse"}
          </button>
        </form>

        <div className="modal__switch">
          {mode === "login" ? (
            <button className="link" onClick={() => setMode("register")}>¿No tienes cuenta? Regístrate</button>
          ) : (
            <button className="link" onClick={() => setMode("login")}>¿Ya tienes cuenta? Inicia sesión</button>
          )}
        </div>
      </div>
    </div>
  );
}
