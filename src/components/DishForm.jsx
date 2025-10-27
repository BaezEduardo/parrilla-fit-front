// src/components/DishForm.jsx
import { useState } from "react";

const CATEGORIES = ["Entradas", "Platillos principales", "Postres", "Bebidas"];
const TAGS = ["Light", "Sin gluten", "Sin lactosa", "Picante", "Vegetariano"];

export default function DishForm({ dish = {}, onCancel, onSave }) {
  const [form, setForm] = useState({
    id: dish.id || null,
    Name: dish.Name || "",
    Category: dish.Category || "Entradas",
    Price: dish.Price || "",
    Available: dish.Available ?? true,
    Description: dish.Description || "",
    Image: dish.Image || "",
    Tags: dish.Tags || [],
  });

  const toggleTag = (tag) => {
    setForm((f) => ({
      ...f,
      Tags: f.Tags.includes(tag)
        ? f.Tags.filter((t) => t !== tag)
        : [...f.Tags, tag],
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(form);
  };

  return (
    <form className="dish-form" onSubmit={handleSubmit}>
      <h2>{form.id ? "Editar Platillo" : "Nuevo Platillo"}</h2>

      <label>Nombre</label>
      <input value={form.Name} onChange={(e) => setForm({ ...form, Name: e.target.value })} required />

      <label>Categoría</label>
      <select value={form.Category} onChange={(e) => setForm({ ...form, Category: e.target.value })}>
        {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
      </select>

      <label>Precio</label>
      <input type="number" value={form.Price} onChange={(e) => setForm({ ...form, Price: e.target.value })} required />

      <label>Disponible</label>
      <input type="checkbox" checked={form.Available} onChange={(e) => setForm({ ...form, Available: e.target.checked })} />

      <label>Descripción</label>
      <textarea value={form.Description} onChange={(e) => setForm({ ...form, Description: e.target.value })} />

      <label>Etiquetas</label>
      <div className="tags">
        {TAGS.map((t) => (
          <button
            type="button"
            key={t}
            onClick={() => toggleTag(t)}
            className={`tag-btn ${form.Tags.includes(t) ? "tag-btn--active" : ""}`}
          >
            {t}
          </button>
        ))}
      </div>

      <label>Imagen (URL)</label>
      <input value={form.Image} onChange={(e) => setForm({ ...form, Image: e.target.value })} />

      <div className="form-actions">
        <button className="btn btn--gold" type="submit">Guardar</button>
        <button className="btn" type="button" onClick={onCancel}>Cancelar</button>
      </div>
    </form>
  );
}
