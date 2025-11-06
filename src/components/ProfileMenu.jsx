import { useEffect, useRef, useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function ProfileMenu({ onChangePassword, onEditPrefs, onDeleteAccount }) {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  // cerrar al hacer click fuera o con ESC
  useEffect(() => {
    function onDoc(e){ if (open && ref.current && !ref.current.contains(e.target)) setOpen(false); }
    function onKey(e){ if (e.key === "Escape") setOpen(false); }
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => { document.removeEventListener("mousedown", onDoc); document.removeEventListener("keydown", onKey); };
  }, [open]);

  if (!user) return null;

  return (
    <div className="profile" ref={ref}>
      <button className="btn ghost" onClick={() => setOpen(v => !v)}>
        Mi Perfil
      </button>

      {open && (
        <div className="dropdown">
          <div className="dropdown__header">
            <div className="dropdown__name">{user.name || "Usuario"}</div>
            <div className="dropdown__phone">{user.phone}</div>
          </div>

          <button className="dropdown__item" onClick={() => { setOpen(false); onEditPrefs?.(); }}>
            Editar preferencias
          </button>
          <button className="dropdown__item" onClick={() => { setOpen(false); onChangePassword?.(); }}>
            Cambiar contraseña
          </button>

          <div className="dropdown__sep" />

          {user.role === "admin" && (
            <div className="dropdown__pill">Admin</div>
          )}

          <button className="dropdown__item warn" onClick={() => { setOpen(false); onDeleteAccount?.(); }}>
            Borrar cuenta
          </button>
          <button className="dropdown__item" onClick={() => { setOpen(false); logout(); }}>
            Cerrar sesión
          </button>
        </div>
      )}
    </div>
  );
}
