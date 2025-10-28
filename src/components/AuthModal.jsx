// src/components/AuthModal.jsx
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function AuthModal({
  open,
  mode = "login",           // "login" | "register"
  onClose,
  onSwitchMode,
}) {
  const { login } = useAuth(); // 🔑 usamos el contexto
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  // limpiar al abrir / cambiar modo
  useEffect(() => {
    if (open) {
      setErr("");
      setLoading(false);
      setPhone("");
      setPassword("");
      setName("");
    }
  }, [open, mode]);

  // cerrar con ESC
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => { if (e.key === "Escape") onClose?.(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  function normalizePhone(p) {
    return String(p || "").replace(/\D+/g, "");
  }

  async function submit(e) {
    e.preventDefault();
    setErr("");
    setLoading(true);
    try {
      const cleanPhone = normalizePhone(phone);

      if (mode === "register") {
        // Usamos la misma ruta pero con fetch manual porque el contexto solo implementa login.
        const res = await fetch(`/api/auth/register`, {
          method: "POST",
          credentials: "include", // 🔑 guarda cookie pf_auth
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, phone: cleanPhone, password }),
        });
        const data = await res.json().catch(() => null);
        if (!res.ok) throw new Error(data?.error || "No se pudo registrar");

        // Después de registrar, el backend ya setea la cookie y regresa el usuario;
        // opcionalmente forzamos sesión en el contexto con login (no necesario).
        // Pero para consistencia, hacemos login explícito:
        await login({ phone: cleanPhone, password });
      } else {
        // login normal vía contexto (usa credentials:"include")
        await login({ phone: cleanPhone, password });
      }

      onClose?.();
    } catch (e) {
      setErr(e.message || "No se pudo completar la acción");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="modal__backdrop" onClick={onClose}>
      {/* Evita cerrar si hacen click dentro */}
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal__close" onClick={onClose} aria-label="Cerrar">✖</button>

        <h2 className="modal__title">
          La Parrilla <span className="accent">Fit</span>
        </h2>
        <p className="modal__subtitle">
          {mode === "login"
            ? "¡Bienvenido de nuevo! Inicia sesión en tu cuenta"
            : "Crea tu cuenta para guardar tus preferencias"}
        </p>

        <form onSubmit={submit} className="form">
          {mode === "register" && (
            <label className="form__group">
              <span>Nombre</span>
              <input
                type="text"
                required
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Tu nombre"
              />
            </label>
          )}

          <label className="form__group">
            <span>Número de Teléfono</span>
            <input
              type="tel"
              required
              value={phone}
              onChange={e => setPhone(e.target.value)}
              placeholder="222-223-4567"
              inputMode="numeric"
            />
          </label>

          <label className="form__group">
            <span>Contraseña</span>
            <input
              type="password"
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </label>

          {err && <div className="form__error">{err}</div>}

          <button className="btn-primary full" disabled={loading}>
            {loading ? "Procesando..." : (mode === "login" ? "Iniciar Sesión" : "Registrarme")}
          </button>
        </form>

        <div className="modal__switch">
          {mode === "login" ? (
            <>¿No tienes cuenta?{" "}
              <button className="link" onClick={() => onSwitchMode?.("register")}>Regístrate</button>
            </>
          ) : (
            <>¿Ya tienes cuenta?{" "}
              <button className="link" onClick={() => onSwitchMode?.("login")}>Inicia sesión</button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
