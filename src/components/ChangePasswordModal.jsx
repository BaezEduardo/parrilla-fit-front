import { useEffect, useState } from "react";

export default function ChangePasswordModal({ open, onClose, recordId }) {
  const [currentPwd, setCurrentPwd] = useState("");
  const [newPwd, setNewPwd] = useState("");
  const [confirmPwd, setConfirmPwd] = useState("");
  const [err, setErr] = useState("");
  const [ok, setOk] = useState("");
  const [loading, setLoading] = useState(false);

  // reset al abrir
  useEffect(() => {
    if (open) {
      setCurrentPwd(""); setNewPwd(""); setConfirmPwd("");
      setErr(""); setOk(""); setLoading(false);
    }
  }, [open]);

  // cerrar con ESC
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => { if (e.key === "Escape") onClose?.(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  async function submit(e){
    e.preventDefault();
    setErr(""); setOk("");
    if (newPwd.length < 6) return setErr("La nueva contraseña debe tener al menos 6 caracteres");
    if (newPwd !== confirmPwd) return setErr("Las contraseñas no coinciden");
    try{
      setLoading(true);
      const res = await fetch("/api/auth/password",{
        method:"PUT",
        headers:{"Content-Type":"application/json"},
        body: JSON.stringify({ recordId, currentPassword: currentPwd, newPassword: newPwd })
      });
      const data = await res.json().catch(()=> ({}));
      if(!res.ok) throw new Error(data?.error || "No se pudo cambiar la contraseña");
      setOk("Contraseña actualizada");
      setTimeout(()=> onClose?.(), 900);
    }catch(e){ setErr(e.message); }
    finally{ setLoading(false); }
  }

  return (
    <div className="modal__backdrop" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal__close" onClick={onClose}>✖</button>

        <div className="modal__header">
          <h3 className="modal__heading">Cambiar Contraseña</h3>
          <p className="modal__subheading">Ingresa tu contraseña actual y la nueva contraseña</p>
        </div>

        <form className="form" onSubmit={submit}>
          <label className="form__group">
            <span>Contraseña actual</span>
            <input type="password" value={currentPwd} onChange={e=>setCurrentPwd(e.target.value)} required />
          </label>
          <label className="form__group">
            <span>Nueva contraseña</span>
            <input type="password" value={newPwd} onChange={e=>setNewPwd(e.target.value)} required />
          </label>
          <label className="form__group">
            <span>Confirmar nueva contraseña</span>
            <input type="password" value={confirmPwd} onChange={e=>setConfirmPwd(e.target.value)} required />
          </label>

          {err && <div className="form__error">{err}</div>}
          {ok && <div className="form__ok">{ok}</div>}

          <button className="btn-primary full" disabled={loading}>
            {loading? "Guardando..." : "Guardar"}
          </button>
        </form>
      </div>
    </div>
  );
}
