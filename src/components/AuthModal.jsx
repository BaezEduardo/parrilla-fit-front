// client/src/components/AuthModal.jsx
import { useEffect, useState } from "react";

export default function AuthModal({
  open,
  mode = "login",           // "login" | "register"
  onClose,
  onLoggedIn,               // recibe el usuario {id,name,phone,role,...}
  onSwitchMode
}) {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  useEffect(() => {
    if (open) {
      setErr("");
      setLoading(false);
      // limpia campos al abrir
      setPhone("");
      setPassword("");
      setName("");
    }
  }, [open, mode]);

  if (!open) return null;

  async function submit(e) {
    e.preventDefault();
    setErr("");
    setLoading(true);
    try {
      const res = await fetch(`/api/auth/${mode === "login" ? "login" : "register"}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          mode === "login"
            ? { phone, password }
            : { name, phone, password }
        )
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Error");
      onLoggedIn?.(data);
      onClose?.();
    } catch (e) {
      setErr(e.message || "No se pudo completar la acción");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="modal">
      <div className="modal__backdrop" onClick={onClose} />
      <div className="modal__card">
        <button className="modal__close" onClick={onClose}>✖</button>

        <h2 className="modal__title">
          La Parrilla <span className="accent">Fit</span>
        </h2>
        <p className="modal__subtitle">
          {mode === "login" ? "¡Bienvenido de nuevo! Inicia sesión en tu cuenta" : "Crea tu cuenta para guardar tus preferencias"}
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
