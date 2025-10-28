// src/hooks/useDishes.js
import { useEffect, useState } from "react";
import { dishes } from "../lib/api"; // <-- usa el export nuevo

export function useDishes({ category, tag, q } = {}) {
  const [dishesData, setDishesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let alive = true;
    setLoading(true);
    setError("");

    // creamos el objeto params
    const params = { category, tag, q };

    dishes.list(params)
      .then((data) => { if (alive) setDishesData(data); })
      .catch((e) => { if (alive) setError(e.message || "Error al cargar platillos"); })
      .finally(() => { if (alive) setLoading(false); });

    return () => { alive = false; };
  }, [category, tag, q]);

  return { dishes: dishesData, loading, error };
}
