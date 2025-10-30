import { useEffect, useMemo, useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import Container from "./Container";
import Button from "../ui/Button";
import useAuth from "../../hooks/useAuth";
import LoginModal from "../auth/LoginModal";

const linkStyle = ({ isActive }) => ({
  padding: "8px 12px",
  borderRadius: "12px",
  border: isActive ? "1px solid var(--gold)" : "1px solid #2a2a2a",
  boxShadow: isActive ? "0 0 0 2px var(--gold)" : "none",
});

export default function Navbar() {
  const { user, logout } = useAuth();
  const [openLogin, setOpenLogin] = useState(false);
  const loc = useLocation();
  const navigate = useNavigate();

  const hasLoginQuery = useMemo(() => {
    const p = new URLSearchParams(loc.search);
    return p.get("login") === "1";
  }, [loc.search]);

  useEffect(() => {
    if (hasLoginQuery) setOpenLogin(true);
  }, [hasLoginQuery]);

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
      <nav style={{ borderBottom: "1px solid #2a2a2a", background: "var(--surface)" }}>
        <Container style={{ display: "flex", gap: 12, alignItems: "center", padding: "12px 0", justifyContent: "space-between" }}>
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <NavLink to="/" style={linkStyle}>Inicio</NavLink>
            <NavLink to="/menu" style={linkStyle}>Menú</NavLink>
            <NavLink to="/perfil" style={linkStyle}>Perfil</NavLink>
            <NavLink to="/admin" style={linkStyle}>Admin</NavLink>
          </div>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            {user ? (
              <>
                <span style={{ color: "var(--muted)", fontSize: 14 }}>
                  Hola, {user.Name || user.name || "usuario"}
                </span>
                <Button onClick={onLogout}>Cerrar sesión</Button>
              </>
            ) : (
              <Button onClick={() => setOpenLogin(true)}>Entrar</Button>
            )}
          </div>
        </Container>
      </nav>
      <LoginModal open={openLogin} onClose={closeLogin} />
    </>
  );
}
