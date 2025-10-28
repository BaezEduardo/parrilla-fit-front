// src/components/Header.jsx
import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function Header({ onOpenLogin, onOpenPrefs }) {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const ddRef = useRef(null);

  // Cerrar dropdown con clic afuera o ESC
  useEffect(() => {
    if (!open) return;
    const onClick = (e) => { if (ddRef.current && !ddRef.current.contains(e.target)) setOpen(false); };
    const onKey = (e) => { if (e.key === "Escape") setOpen(false); };
    window.addEventListener("mousedown", onClick);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("mousedown", onClick);
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const isAdmin = user?.role === "admin";

  return (
    <header className="site-header">
      <div className="container header-row">
        <div className="brand">
          <Link to="/" className="brand__link">La Parrilla <span className="accent">Fit</span></Link>
        </div>

        <nav className="header-actions">
          {!user ? (
            <button className="btn" onClick={onOpenLogin}>Iniciar sesión</button>
          ) : (
            <div className="profile" ref={ddRef}>
              <button className="btn" onClick={() => setOpen(v => !v)}>
                {user.name || "Perfil"} ▾
              </button>

              {open && (
                <div className="dropdown">
                  <div className="dropdown-item"><strong>{user.name}</strong></div>
                  <div className="dropdown-item">Tel: {user.phone}</div>
                  <hr/>
                  <button className="dropdown-item" onClick={onOpenPrefs}>Preferencias</button>
                  {isAdmin && (
                    <Link className="dropdown-item" to="/admin" onClick={() => setOpen(false)}>
                      Panel de administración
                    </Link>
                  )}
                  <button
                    className="dropdown-item danger"
                    onClick={() => { logout(); setOpen(false); }}
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
