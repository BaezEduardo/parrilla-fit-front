import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { auth } from "../lib/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [booting, setBooting] = useState(true);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const me = await auth.me();
        if (alive) setUser(me);
      } catch {
        if (alive) setUser(null);
      } finally {
        if (alive) setBooting(false);
      }
    })();
    return () => { alive = false; };
  }, []);

  async function login(payload) {
    const me = await auth.login(payload);
    setUser(me);
    return me;
  }

  async function logout() {
    try { await auth.logout(); } catch {}
    setUser(null);
  }

  async function refresh() {
    const me = await auth.me();
    setUser(me);
    return me;
  }

  const value = useMemo(() => ({
    user, booting, login, logout, refresh,
    isAdmin: !!user && (user.role === "admin" || user.Role === "admin"),
  }), [user, booting]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthCtx() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuthCtx debe usarse dentro de <AuthProvider>");
  return ctx;
}
