import { useEffect, useState } from "react";
import Modal from "../ui/Modal";
import Button from "../ui/Button";
import Toast from "../ui/Toast.jsx";

export default function ChangePasswordModal({ open, onClose }) {
  const [currentPwd, setCurrentPwd] = useState("");
  const [newPwd, setNewPwd] = useState("");
  const [confirmPwd, setConfirmPwd] = useState("");
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, type: "success", message: "" });

  useEffect(() => {
    if (open) {
      setCurrentPwd(""); setNewPwd(""); setConfirmPwd("");
      setLoading(false);
      setToast({ show: false, type: "success", message: "" });
    }
  }, [open]);

  if (!open) return null;

  async function submit(e){
    e.preventDefault();
    setToast({ show: false, type: "success", message: "" });

    if (!newPwd || newPwd.length < 6)
      return setToast({ show: true, type: "error", message: "La nueva contraseña debe tener al menos 6 caracteres" });

    if (newPwd !== confirmPwd)
      return setToast({ show: true, type: "error", message: "Las contraseñas no coinciden" });

    try{
      setLoading(true);
      const res = await fetch("/api/auth/change-password", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword: currentPwd, newPassword: newPwd }),
      });
      if (!res.ok) {
        const ct = res.headers.get("content-type") || "";
        const data = ct.includes("application/json") ? await res.json().catch(() => null) : await res.text();
        const msg = (data && (data.error || data.message)) || `HTTP ${res.status}`;
        throw new Error(msg);
      }
      setToast({ show: true, type: "success", message: "Contraseña actualizada" });
      setTimeout(() => onClose?.(), 800);
    }catch(e){
      setToast({ show: true, type: "error", message: e?.message || "No se pudo actualizar la contraseña" });
    }finally{
      setLoading(false);
    }
  }

  return (
    <Modal open={open} onClose={onClose}>
      <form onSubmit={submit} style={{ display: "grid", gap: 12 }}>
        <h3 style={{ marginTop: 0 }}>Cambiar contraseña</h3>

        <div>
          <label>Contraseña actual</label>
          <input className="input" type="password" value={currentPwd} onChange={e=>setCurrentPwd(e.target.value)} placeholder="••••••" />
        </div>

        <div>
          <label>Nueva contraseña</label>
          <input className="input" type="password" value={newPwd} onChange={e=>setNewPwd(e.target.value)} placeholder="mín. 6 caracteres" />
        </div>

        <div>
          <label>Confirmar nueva contraseña</label>
          <input className="input" type="password" value={confirmPwd} onChange={e=>setConfirmPwd(e.target.value)} placeholder="repite la nueva contraseña" />
        </div>

        <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
          <Button type="button" onClick={onClose}>Cancelar</Button>
          <Button type="submit" disabled={loading}>{loading ? "Actualizando..." : "Actualizar"}</Button>
        </div>

        {toast.show && (
          <Toast type={toast.type} message={toast.message} />
        )}
      </form>
    </Modal>
  );
}
