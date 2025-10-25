// client/src/components/TopBar.jsx
import { useState } from "react";

export default function TopBar({ user, onLoginClick, onLogoutClick, onChangePasswordClick, onPreferencesClick }) {
  const [open, setOpen] = useState(false);

  return (
    <header className="topbar">
      <div className="topbar__inner container">
        <div className="brand">La Parrilla <span className="accent">Fit</span></div>

        {!user ? (
        <button className="btn-outline" onClick={onLoginClick}>
            Iniciar
        </button>
        ) : (
        <div className="profile">
            <button className="btn-profile" onClick={() => setOpen(v => !v)}>
            <span className="icon">👤</span>
            <span>Mi Perfil</span>
            <span className={`chev ${open ? "up" : ""}`}>▾</span>
            </button>

            {open && (
            <div className="dropdown dropdown--glass">
                <div className="dropdown__header">
                <div className="name">{user.name}</div>
                <div className="phone">{user.phone}</div>
                </div>

                <button className="dropdown__item" onClick={() => { setOpen(false); onChangePasswordClick?.(); }}>
                <span className="item-icon">🔒</span>
                Cambiar Contraseña
                </button>

                <button className="dropdown__item" onClick={() => { setOpen(false); onPreferencesClick?.(); }}>
                <span className="item-icon">⚙️</span>
                Preferencias
                </button>

                <button className="dropdown__item danger" onClick={() => { setOpen(false); onLogoutClick(); }}>
                <span className="item-icon">🚪</span>
                Cerrar sesión
                </button>
            </div>
            )}
        </div>
        )}

      </div>
    </header>
  );
}
