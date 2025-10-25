import { createContext, useContext, useMemo, useState } from "react";

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [user, setUser] = useState(null);        // auth futuro
  const [favorites, setFavorites] = useState([]); // favoritos futuro
  const [cart, setCart] = useState([]);          // carrito futuro

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
