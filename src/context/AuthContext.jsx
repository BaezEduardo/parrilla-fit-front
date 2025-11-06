import { createContext, useContext, useEffect, useState } from "react";
import { auth } from "../lib/api";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [booting, setBooting] = useState(true);
  const navigate = useNavigate();

  // Rehidratar sesión desde cookie
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const u = await auth.me();
        if (alive) setUser(u);
      } catch {
        if (alive) setUser(null);
      } finally {
        if (alive) setBooting(false);
      }
    })();
    return () => { alive = false; };
  }, []);

  async function login(payload) {
    const u = await auth.login(payload);
    setUser(u);
    // redirigir según rol
    if (u?.role === "admin") navigate("/admin", { replace: true });
    else navigate("/", { replace: true });
    return u;
  }

  async function register(payload) {
    const u = await auth.register(payload);
    setUser(u);
    // nuevo usuario: ir al menú (si por alguna razón es admin, al panel)
    if (u?.role === "admin") navigate("/admin", { replace: true });
    else navigate("/", { replace: true });
    return u;
  }

  async function logout() {
    await auth.logout();
    setUser(null);
    navigate("/", { replace: true });
  }

  async function refresh() {
    try {
      const u = await auth.me();
      setUser(u);
      return u;
    } catch {
      setUser(null);
      throw new Error("No autenticado");
    }
  }

  return (
    <AuthContext.Provider value={{ user, booting, login, register, logout, refresh }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within <AuthProvider>");
  return ctx;
}
