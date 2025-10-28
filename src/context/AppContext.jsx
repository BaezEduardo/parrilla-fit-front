// src/context/AppContext.jsx
import { createContext, useContext, useEffect, useMemo, useState } from "react";

export const AppContext = createContext(null);

export function AppProvider({ children }) {
  // 👇 Mantén sólo estados de app NO relacionados con auth
  const [favorites, setFavorites] = useState(() => {
    try { return JSON.parse(localStorage.getItem("pf_favs") || "[]"); }
    catch { return []; }
  });

  const [cart, setCart] = useState(() => {
    try { return JSON.parse(localStorage.getItem("pf_cart") || "[]"); }
    catch { return []; }
  });

  // Persistencia
  useEffect(() => {
    localStorage.setItem("pf_favs", JSON.stringify(favorites || []));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem("pf_cart", JSON.stringify(cart || []));
  }, [cart]);

  const value = useMemo(() => ({
    favorites, setFavorites,
    cart, setCart
  }), [favorites, cart]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp debe usarse dentro de <AppProvider>");
  return ctx;
}
