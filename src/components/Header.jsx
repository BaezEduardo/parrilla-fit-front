import { useAuth } from "../context/AuthContext.jsx";
import { useState } from "react";

export default function Header({ onOpenLogin, onOpenPrefs }) {
  const { user, setUser, isAdmin } = useAuth();
  const [open, setOpen] = useState(false);

  return (
    <header className="site-header">
      <div className="container header-row">
        <div />
        <nav className="header-actions">
          {!user ? (
            <button className="btn" onClick={onOpenLogin}>Iniciar sesión</button>
          ) : (
            <div className="profile">
              <button className="btn" onClick={() => setOpen(v => !v)}>Perfil ▾</button>
              {open && (
                <div className="dropdown">
                  <div className="dropdown-item"><strong>{user.name}</strong></div>
                  <div className="dropdown-item">Tel: {user.phone}</div>
                  <hr/>
                  <button className="dropdown-item" onClick={onOpenPrefs}>Preferencias</button>
                  {isAdmin && <div className="dropdown-item">Admin: gestión de menú</div>}
                  <button
                    className="dropdown-item danger"
                    onClick={() => { setUser(null); setOpen(false); }}
                  >
                    Cerrar sesión
                  </button>
                </div>
              )}
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}
