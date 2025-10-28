// src/components/ChangePasswordModal.jsx
import { useEffect, useState } from "react";
import { auth } from "../lib/api";

export default function ChangePasswordModal({ open, onClose }) {
  const [currentPwd, setCurrentPwd] = useState("");
  const [newPwd, setNewPwd] = useState("");
  const [confirmPwd, setConfirmPwd] = useState("");
  const [err, setErr] = useState("");
  const [ok, setOk] = useState("");
  const [loading, setLoading] = useState(false);

  // Reset al abrir
  useEffect(() => {
    if (open) {
      setCurrentPwd("");
      setNewPwd("");
      setConfirmPwd("");
      setErr("");
      setOk("");
      setLoading(false);
    }
  }, [open]);

  // Cerrar con ESC
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => { if (e.key === "Escape" && !loading) onClose?.(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose, loading]);

  if (!open) return null;

  async function submit(e) {
    e.preventDefault();
    setErr(""); 
    setOk("");

    const cur = currentPwd.trim();
    const next = newPwd.trim();
    const conf = confirmPwd.trim();

    if (next.length < 6)
      return setErr("La nueva contraseña debe tener al menos 6 caracteres");
    if (next !== conf)
      return setErr("Las contraseñas no coinciden");

    try {
      setLoading(true);
      await auth.changePassword({
        currentPassword: cur,
        newPassword: next,
      });
      setOk("Contraseña actualizada correctamente");
      // Limpieza y cierre suave
      setCurrentPwd("");
      setNewPwd("");
      setConfirmPwd("");
      setTimeout(() => onClose?.(), 900);
    } catch (e) {
      setErr(e?.message || "No se pudo cambiar la contraseña");
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
        <button className="modal__close" onClick={onClose} disabled={loading}>✖</button>

        <div className="modal__header">
          <h3 className="modal__heading">Cambiar Contraseña</h3>
          <p className="modal__subheading">
            Ingresa tu contraseña actual y la nueva contraseña
          </p>
        </div>

        <form className="form" onSubmit={submit}>
          <label className="form__group">
            <span>Contraseña actual</span>
            <input
              type="password"
              value={currentPwd}
              onChange={(e) => setCurrentPwd(e.target.value)}
              required
            />
          </label>

          <label className="form__group">
            <span>Nueva contraseña</span>
            <input
              type="password"
              value={newPwd}
              onChange={(e) => setNewPwd(e.target.value)}
              required
              minLength={6}
            />
          </label>

          <label className="form__group">
            <span>Confirmar nueva contraseña</span>
            <input
              type="password"
              value={confirmPwd}
              onChange={(e) => setConfirmPwd(e.target.value)}
              required
              minLength={6}
            />
          </label>

          {err && <div className="form__error">{err}</div>}
          {ok && <div className="form__ok">{ok}</div>}

          <button className="btn-primary full" disabled={loading}>
            {loading ? "Guardando..." : "Guardar"}
          </button>
        </form>
      </div>
    </div>
  );
}
