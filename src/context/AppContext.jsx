import { createContext, useContext, useEffect, useMemo, useState } from "react";

export const AppContext = createContext(null);

export function AppProvider({ children }) {
  // Carga inicial desde localStorage
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem("pf_user") || "null"); }
    catch { return null; }
  });

  const [favorites, setFavorites] = useState(() => {
    try { return JSON.parse(localStorage.getItem("pf_favs") || "[]"); }
    catch { return []; }
  });

  const [cart, setCart] = useState(() => {
    try { return JSON.parse(localStorage.getItem("pf_cart") || "[]"); }
    catch { return []; }
  });

  // Persistencia al cambiar
  useEffect(() => {
    if (user) localStorage.setItem("pf_user", JSON.stringify(user));
    else localStorage.removeItem("pf_user");
  }, [user]);

  useEffect(() => {
    localStorage.setItem("pf_favs", JSON.stringify(favorites || []));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem("pf_cart", JSON.stringify(cart || []));
  }, [cart]);

  const value = useMemo(() => ({
    user, setUser,
    favorites, setFavorites,
    cart, setCart
  }), [user, favorites, cart]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp debe usarse dentro de <AppProvider>");
  return ctx;
}
