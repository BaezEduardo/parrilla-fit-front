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
    if (open) { setCurrentPwd(""); setNewPwd(""); setConfirmPwd(""); setErr(""); setOk(""); setLoading(false); }
  }, [open]);

  if (!open) return null;

  async function submit(e){
    e.preventDefault();
    setErr(""); setOk("");
    if (newPwd.length < 6) return setErr("La nueva contraseña debe tener al menos 6 caracteres");
    if (newPwd !== confirmPwd) return setErr("Las contraseñas no coinciden");
    try{
      setLoading(true);
      await profile.changePassword({ currentPassword: currentPwd, newPassword: newPwd });
      setOk("Contraseña actualizada");
      setTimeout(() => onClose?.(), 900);
    } catch (e) {
      setErr(e.message || "No se pudo actualizar");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={(e)=>e.stopPropagation()}>
        <div className="modal__header">
          <h3><span className="accent">Cambiar Contraseña</span></h3>
          <button className="btn icon" onClick={onClose}>✕</button>
        </div>
        <form className="modal__form" onSubmit={submit}>
          <div className="field">
            <label>Contraseña actual</label>
            <input type="password" value={currentPwd} onChange={(e)=>setCurrentPwd(e.target.value)} required />
          </div>
          <div className="field">
            <label>Nueva contraseña</label>
            <input type="password" value={newPwd} onChange={(e)=>setNewPwd(e.target.value)} required />
          </div>
          <div className="field">
            <label>Confirmar nueva contraseña</label>
            <input type="password" value={confirmPwd} onChange={(e)=>setConfirmPwd(e.target.value)} required />
          </div>

          {err && <div className="error">{err}</div>}
          {ok && <div className="ok">{ok}</div>}

          <button className="btn primary" disabled={loading}>{loading ? "Guardando..." : "Guardar cambios"}</button>
        </form>
      </div>
    </div>
  );
}
