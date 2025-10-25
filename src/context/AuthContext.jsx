import { createContext, useContext, useMemo, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null); // {name, phone, role: 'user'|'admin', prefs:{likes:[], allergens:[]}}

  const value = useMemo(() => ({
    user,
    setUser,
    isAdmin: !!user && user.role === "admin"
  }), [user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
