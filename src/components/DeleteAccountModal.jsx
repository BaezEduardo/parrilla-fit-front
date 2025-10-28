// src/components/DeleteAccountModal.jsx
import { useState, useEffect } from "react";
import { auth } from "../lib/api";
import { useAuth } from "../context/AuthContext";

export default function DeleteAccountModal({ open, onClose, onDeleted }) {
  const [pwd, setPwd] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  const { logout } = useAuth();

  useEffect(() => {
    if (open) {
      setPwd("");
      setErr("");
      setLoading(false);
    }
  }, [open]);

  if (!open) return null;

  async function handleSubmit(e) {
    e.preventDefault();
    setErr("");
    if (!pwd.trim()) return setErr("Ingresa tu contraseña para confirmar");
    try {
      setLoading(true);
      await auth.deleteAccount({ currentPassword: pwd.trim() });
      // backend borra cookie; limpiamos estado del contexto
      logout();
      onDeleted?.();
      onClose?.();
    } catch (e) {
      setErr(e?.message || "No se pudo eliminar la cuenta");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="modal__backdrop"
      onClick={() => { if (!loading) onClose?.(); }}
    >
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal__close" onClick={onClose} disabled={loading}>✕</button>

        <div className="modal__header">
          <h3 className="modal__heading">Eliminar cuenta</h3>
          <p className="modal__subheading">
            Esta acción es <b>permanente</b>. Escribe tu contraseña para confirmar.
          </p>
        </div>

        {err && <div className="form__error">{err}</div>}

        <form className="form" onSubmit={handleSubmit}>
          <label className="form__group">
            <span>Contraseña actual</span>
            <input
              type="password"
              value={pwd}
              onChange={(e) => setPwd(e.target.value)}
              placeholder="••••••••"
              disabled={loading}
              required
            />
          </label>

          <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
            <button type="button" className="btn-outline" onClick={onClose} disabled={loading}>
              Cancelar
            </button>
            <button type="submit" className="btn-outline" disabled={loading}>
              {loading ? "Eliminando..." : "Eliminar definitivamente"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
