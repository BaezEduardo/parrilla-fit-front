// src/context/AuthContext.jsx
import { createContext, useContext, useEffect, useState } from "react";
import { auth } from "../lib/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [booting, setBooting] = useState(true);

  // Rehidrata sesión desde cookie (pf_auth)
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

  async function login({ phone, password }) {
    const u = await auth.login({ phone, password }); // guarda cookie
    setUser(u); // refleja login inmediatamente
    return u;
  }

  async function logout() {
    try { await auth.logout(); } finally { setUser(null); }
  }

  return (
    <AuthContext.Provider value={{ user, setUser, booting, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// 🔑 Named export que necesitas
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth debe usarse dentro de <AuthProvider>");
  return ctx;
}
