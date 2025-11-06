import { useEffect, useMemo, useState } from "react";
import Hero from "../components/Hero";

const ORDER = ["Entradas", "Platos Principales", "Postres", "Bebidas"];

function normalizeCategory(raw) {
  const t = (raw || "").toLowerCase();
  if (t.startsWith("entrada")) return "Entradas";
  if (t.includes("principal")) return "Platos Principales";
  if (t.startsWith("postre")) return "Postres";
  if (t.startsWith("bebida")) return "Bebidas";
  return "Otros";
}

export default function Menu() {
  const [dishes, setDishes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
  (async () => {
    try {
      const res = await fetch("/api/dishes", { credentials: "include" });
      const data = await res.json();

      // 🔽🔽 INSERTA DESDE AQUÍ 🔽🔽
      console.clear();
      console.log("Dishes raw ->", data);
      console.log("Primer registro ->", Array.isArray(data?.records) ? data.records[0] : data?.[0]);
      // 🔼🔼 HASTA AQUÍ 🔼🔼

      // Si tu backend devuelve el objeto crudo de Airtable:
      if (Array.isArray(data?.records)) {
        const flat = data.records.map(r => ({ id: r.id, ...(r.fields || {}) }));
        console.log("Aplanado[0] ->", flat[0]);   // 👈 Verifica si trae Image
        setDishes(flat);
      } else if (Array.isArray(data)) {
        console.log("Plano[0] ->", data[0]);      // 👈 Verifica si trae Image
        setDishes(data);
      } else {
        setDishes([]);
      }
    } catch (e) {
      setErr(e.message || "Error cargando menú");
    } finally {
      setLoading(false);
    }
  })();
}, []);

  const grouped = useMemo(() => {
    const g = {};
    for (const d of dishes) {
      // Soporta campos capitalizados de Airtable
      const cat = normalizeCategory(d.category || d.Category || d.tipo || d.Tipo);
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
        (grouped[cat]?.length ? (
          <section key={cat} style={{ marginBottom: 28 }}>
            <h2>{cat}</h2>
            <div className="grid-plates">
              {grouped[cat].map((dish) => (
                <DishCard key={dish.id || dish.recordId || dish._id || dish.Name} dish={dish} />
              ))}
            </div>
          </section>
        ) : null)
      )}
    </main>
    </>
  );
}

function pickImageUrl(dish) {
  // 1) Si viene como string directa
  const direct =
    dish.imageUrl || dish.image || dish.img ||
    dish.Image || dish.Imagen || dish.Foto || dish.Photo;
  if (typeof direct === "string" && direct.trim()) return direct.trim();

  // 2) Si viene como arreglo de attachments (Airtable)
  const arr =
    dish.attachments || dish.Attachments ||
    dish.images || dish.Images ||
    dish.Imagenes || dish.Fotos ||
    dish.imageUrlArr || dish.ImageArr ||
    dish.image_urls || dish.ImageURLs;

  if (Array.isArray(arr) && arr.length) {
    // airtable attachments: [{ url, thumbnails: { ... } }, ...]
    const first = arr[0];
    if (first?.thumbnails?.large?.url) return first.thumbnails.large.url;
    if (first?.url) return first.url;
    if (typeof first === "string") return first;
  }

  // 3) Si viene anidado en `fields` (cuando tu backend pasa algo parecido a la respuesta cruda de Airtable)
  const f = dish.fields;
  if (f) {
    if (typeof f.Image === "string") return f.Image;
    if (typeof f.Imagen === "string") return f.Imagen;
    if (Array.isArray(f.Attachments) && f.Attachments[0]?.url) return f.Attachments[0].url;
    if (Array.isArray(f.Imagen) && f.Imagen[0]?.url) return f.Imagen[0].url;
  }

  // 4) Sin imagen
  return "";
}

function getAirtableImageUrl(d) {
  // d.Image es un arreglo de attachments [{ url, thumbnails, ... }]
  if (Array.isArray(d.Image) && d.Image.length) {
    const a = d.Image[0];
    return a?.thumbnails?.large?.url || a?.url || "";
  }
  return "";
}

function DishCard({ dish }) {
  const name = dish.Name || dish.name || "Platillo";
  const desc = dish.Description || dish.description || "";
  const price = dish.Price ?? dish.price ?? "";
  const img =
    (dish.Image?.[0]?.thumbnails?.large?.url) ||
    (dish.Image?.[0]?.url) ||
    dish.imageUrl ||
    "";

  return (
    <article className="dish-card">
      <div className="dish-card__info">
        <div className="dish-card__header">
          
          <h3 className="dish-card__name">{name} - <span className="dish-card__price">
            ${Number(price).toFixed(2)}
          </span></h3>
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

