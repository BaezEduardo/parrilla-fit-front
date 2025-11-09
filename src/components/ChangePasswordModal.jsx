import { useEffect, useState } from "react";
import { profile } from "../lib/api";

export default function ChangePasswordModal({ open, onClose }) {
  const [currentPwd, setCurrentPwd] = useState("");
  const [newPwd, setNewPwd] = useState("");
  const [confirmPwd, setConfirmPwd] = useState("");
  const [err, setErr] = useState("");
  const [ok, setOk] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      setCurrentPwd(""); setNewPwd(""); setConfirmPwd("");
      setErr(""); setOk(""); setLoading(false);
    }
  }, [open]);

  if (!open) return null;

  function onBackdropClick(e) {
    if (e.target === e.currentTarget) onClose?.();
  }

  async function submit(e) {
    e.preventDefault();
    setErr(""); setOk("");
    if (newPwd.length < 6) return setErr("La nueva contraseña debe tener al menos 6 caracteres");
    if (newPwd !== confirmPwd) return setErr("Las contraseñas no coinciden");
    try {
      setLoading(true);
      await profile.changePassword({ currentPassword: currentPwd, newPassword: newPwd });
      setOk("Contraseña actualizada ✔");
      setTimeout(() => onClose?.(), 900);
    } catch (e2) {
      setErr(e2.message || "No se pudo actualizar");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="modal" role="dialog" aria-modal="true" onClick={onBackdropClick}>
      <div className="modal__dialog" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal__header">
          <h3><span className="accent">Cambiar Contraseña</span></h3>
          <button className="btn icon" onClick={onClose} aria-label="Cerrar">✕</button>
        </div>

        {/* Form: body + footer */}
        <form className="modal__form" onSubmit={submit}>
          <div className="modal__body">
            <div className="form-card">
              <div className="field">
                <label>Contraseña actual</label>
                <input
                  type="password"
                  value={currentPwd}
                  onChange={(e)=>setCurrentPwd(e.target.value)}
                  required
                />
              </div>
              <div className="field">
                <label>Nueva contraseña</label>
                <input
                  type="password"
                  value={newPwd}
                  onChange={(e)=>setNewPwd(e.target.value)}
                  required
                />
              </div>
              <div className="field">
                <label>Confirmar nueva contraseña</label>
                <input
                  type="password"
                  value={confirmPwd}
                  onChange={(e)=>setConfirmPwd(e.target.value)}
                  required
                />
              </div>

              {err && <div className="error">{err}</div>}
              {ok &&  <div className="ok">{ok}</div>}
            </div>
          </div>

          <div className="modal__footer">
            <button className="btn" type="button" onClick={onClose}>Cancelar</button>
            <button className="btn primary" disabled={loading}>
              {loading ? "Guardando..." : "Guardar cambios"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
