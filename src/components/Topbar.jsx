import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import AuthModal from "./AuthModal";
import ProfileMenu from "./ProfileMenu";
import ChangePasswordModal from "./ChangePasswordModal";
import PreferencesModal from "./PreferencesModal";
import { Link } from "react-router-dom";

export default function Topbar() {
  const { user } = useAuth();
  const [authOpen, setAuthOpen] = useState(false);
  const [pwdOpen, setPwdOpen] = useState(false);
  const [prefsOpen, setPrefsOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <>
      <header className="topbar">
        
        <div className="logo">
          <Link to="/" className="logo-link">
            La Parrilla <span className="accent">Fit</span>
          </Link>
        </div>
        <div className="topbar__actions">
          {user?.role === "admin" && (
            <button className="btn ghost" onClick={() => navigate("/admin")}>Admin</button>
          )}

          {!user ? (
            <button className="btn ghost" onClick={() => setAuthOpen(true)}>Iniciar sesión</button>
          ) : (
            <ProfileMenu
              onChangePassword={() => setPwdOpen(true)}
              onEditPrefs={() => setPrefsOpen(true)}
              onDeleteAccount={async () => {
                if (!confirm("¿Borrar tu cuenta? Esta acción es irreversible.")) return;
                try {
                  await fetch("/api/users/me", { method: "DELETE", credentials: "include" });
                  // al borrar cuenta, fuerza logout desde el servidor si es posible
                  location.reload();
                } catch (e) {
                  alert(e.message || "No se pudo borrar la cuenta");
                }
              }}
            />
          )}
        </div>
      </header>

      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} />
      <ChangePasswordModal open={pwdOpen} onClose={() => setPwdOpen(false)} />
      <PreferencesModal open={prefsOpen} onClose={() => setPrefsOpen(false)} />
    </>
  );
}
