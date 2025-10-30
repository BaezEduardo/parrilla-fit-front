import Input from "../ui/Input";
import Button from "../ui/Button";

export default function DishFilters({ search, onSearch, category, onCategory, categories = [] }) {
  return (
    <form onSubmit={(e)=>e.preventDefault()} style={{ display:"flex", flexWrap: "wrap", gap:8, marginTop: 8 }}>
      <Input
        placeholder="Buscar platillo..."
        value={search}
        onChange={(e)=>onSearch?.(e.target.value)}
        style={{ flex: "1 1 240px" }}
      />
      {!!categories.length && (
        <select
          className="select"
          value={category ?? ""}
          onChange={(e)=>onCategory?.(e.target.value || null)}
          style={{ padding: "10px 12px", borderRadius: "12px", background: "var(--surface)", border: "1px solid #2a2a2a" }}
        >
          <option value="">Todas las categorías</option>
          {categories.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      )}
      <Button onClick={()=>{ onSearch?.(""); onCategory?.(null); }}>Limpiar</Button>
    </form>
  );
}
