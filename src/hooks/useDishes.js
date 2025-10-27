// src/hooks/useDishes.js
import { useEffect, useState } from "react";
import { api } from "../lib/api";

export function useDishes({ category, tag, q } = {}) {
  const [dishes, setDishes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState("");

  useEffect(() => {
    let alive = true;
    setLoading(true);
    setError("");
    api.listDishes({ category, tag, q })
      .then((data) => { if (alive) setDishes(data); })
      .catch((e) => { if (alive) setError(e.message || "Error"); })
      .finally(() => { if (alive) setLoading(false); });
    return () => { alive = false; };
  }, [category, tag, q]);

  return { dishes, loading, error };
}
