const CATS = ["Entradas","Platillos principales","Postres","Bebidas"];
const TAGS = ["Light","Sin gluten","Sin lactosa","Picante","Vegetariano"];

export default function MenuFilters({ value, onChange }) {
  const { category, q = "", tags = [] } = value;

  const toggle = (t) => {
    onChange({
      ...value,
      tags: tags.includes(t) ? tags.filter(x => x !== t) : [...tags, t],
    });
  };

  return (
    <div className="menu-filters">
      <div className="menu-filters__row">
        <select value={category || ""} onChange={(e) => onChange({ ...value, category: e.target.value || undefined })}>
          <option value="">Todas las categorías</option>
          {CATS.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        <input
          placeholder="Buscar..."
          value={q}
          onChange={(e) => onChange({ ...value, q: e.target.value })}
        />
      </div>
      <div className="menu-filters__tags">
        {TAGS.map((t) => (
          <button
            key={t}
            type="button"
            className={`tag-btn ${tags.includes(t) ? "tag-btn--active" : ""}`}
            onClick={() => toggle(t)}
          >
            {t}
          </button>
        ))}
      </div>
    </div>
  );
}
