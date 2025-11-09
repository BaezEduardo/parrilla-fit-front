// src/pages/Menu.jsx
import { useEffect, useMemo, useState } from "react";
import Hero from "../components/Hero";
import { dishes as apiDishes } from "../lib/api"; // ✅ usa wrapper que apunta al subdominio del API

const ORDER = ["Entradas", "Platillos Principales", "Postres", "Bebidas"];

function normalizeCategory(raw) {
  const t = (raw || "").toLowerCase();
  if (t.startsWith("entrada")) return "Entradas";
  if (t.includes("principal")) return "Platillos Principales";
  if (t.startsWith("postre")) return "Postres";
  if (t.startsWith("bebida")) return "Bebidas";
  return "Otros";
}

/* ---------- Helpers de normalización ---------- */
function toBool(v) {
  return (
    v === true ||
    v === 1 ||
    v === "1" ||
    (typeof v === "string" && v.toLowerCase() === "true")
  );
}

function normalizeDish(d) {
  // disponible puede venir en 'available' o 'Available'
  const availableRaw = d.available ?? d.Available;
  return {
    ...d,
    _available: toBool(availableRaw), // boolean unificado para filtrar
    _category: normalizeCategory(d.category || d.Category || d.tipo || d.Tipo),
  };
}

export default function Menu() {
  const [dishes, setDishes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const data = await apiDishes.list();

        console.clear();
        console.log("Dishes raw ->", data);
        console.log(
          "Primer registro ->",
          Array.isArray(data?.records) ? data.records[0] : data?.[0]
        );

        let flat = [];
        // Soporta respuesta cruda de Airtable o ya aplanada
        if (Array.isArray(data?.records)) {
          flat = data.records.map((r) => ({ id: r.id, ...(r.fields || {}) }));
        } else if (Array.isArray(data)) {
          flat = data;
        }
        // normalizamos cada platillo y guardamos
        setDishes(flat.map(normalizeDish));
      } catch (e) {
        setErr(e.message || "Error cargando menú");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const grouped = useMemo(() => {
    const g = {};
    // Solo mostramos disponibles en la página pública
    const visibles = dishes.filter((d) => d._available);
    for (const d of visibles) {
      const cat = d._category;
      (g[cat] ||= []).push(d);
    }
    return g;
  }, [dishes]);

  if (loading) return <main className="container"><p>Cargando menú…</p></main>;
  if (err) return <main className="container"><p>{err}</p></main>;

  return (
    <>
      <Hero />
      <main className="container">
        {ORDER.map((cat) =>
          grouped[cat]?.length ? (
            <section key={cat} style={{ marginBottom: 28 }}>
              <h2>{cat}</h2>
              <div className="grid-plates">
                {grouped[cat].map((dish) => (
                  <DishCard
                    key={dish.id || dish.recordId || dish._id || dish.Name}
                    dish={dish}
                  />
                ))}
              </div>
            </section>
          ) : null
        )}
        {/* Renderiza "Otros" al final si existen */}
        {grouped["Otros"]?.length ? (
          <section key="Otros" style={{ marginBottom: 28 }}>
            <h2>Otros</h2>
            <div className="grid-plates">
              {grouped["Otros"].map((dish) => (
                <DishCard
                  key={dish.id || dish.recordId || dish._id || dish.Name}
                  dish={dish}
                />
              ))}
            </div>
          </section>
        ) : null}
      </main>
    </>
  );
}

function DishCard({ dish }) {
  const name = dish.Name || dish.name || "Platillo";
  const desc = dish.Description || dish.description || "";
  const price = dish.Price ?? dish.price ?? "";
  const img =
    dish.Image?.[0]?.thumbnails?.large?.url ||
    dish.Image?.[0]?.url ||
    dish.imageUrl ||
    "";

  return (
    <article className="dish-card">
      <div className="dish-card__info">
        <div className="dish-card__header">
          <h3 className="dish-card__name">
            {name}{" "}
            <span className="dish-card__price">
              ${Number(price).toFixed(2)}
            </span>
          </h3>
        </div>
        <p className="dish-card__desc">{desc}</p>
      </div>

      {img ? (
        <img className="dish-card__img" src={img} alt={name} loading="lazy" />
      ) : (
        <div className="dish-card__img dish-card__img--placeholder" />
      )}
    </article>
  );
}
