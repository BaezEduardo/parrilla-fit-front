import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Button from "../ui/Button";
import useAuth from "../../hooks/useAuth";
import LoginModal from "../auth/LoginModal";

export default function Topbar() {
  const { user, isAdmin, logout } = useAuth();
  const [openLogin, setOpenLogin] = useState(false);
  const loc = useLocation();
  const navigate = useNavigate();

  const hasLoginQuery = useMemo(() => {
    const p = new URLSearchParams(loc.search);
    return p.get("login") === "1";
  }, [loc.search]);

  useEffect(() => { if (hasLoginQuery) setOpenLogin(true); }, [hasLoginQuery]);

  function closeLogin() {
    setOpenLogin(false);
    const p = new URLSearchParams(loc.search);
    p.delete("login");
    navigate({ pathname: loc.pathname, search: p.toString() }, { replace: true });
  }

  async function onLogout() {
    await logout();
    navigate("/", { replace: true });
  }

  return (
    <>
      <div
        style={{
          position: "sticky",
          top: 0,
          zIndex: 40,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "14px 24px",
          background: "var(--surface)",
          borderBottom: "2px solid var(--gold)",
          boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
        }}
      >
        <div style={{ fontWeight: 700, fontSize: "1.2rem", color: "var(--gold)", cursor: "pointer" }}
             onClick={() => navigate("/")}>
          Parrilla Fit
        </div>

        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          {!user ? (
            <Button onClick={() => setOpenLogin(true)}>Entrar</Button>
          ) : (
            <>
              <Button onClick={() => navigate("/perfil")}>Perfil</Button>
              {isAdmin && <Button onClick={() => navigate("/admin")}>Admin</Button>}
              <Button onClick={onLogout}>Cerrar sesión</Button>
            </>
          )}
        </div>
      </div>
      <LoginModal open={openLogin} onClose={closeLogin} />
    </>
  );
}
