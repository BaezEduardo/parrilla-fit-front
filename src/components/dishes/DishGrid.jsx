import DishCard from "./DishCard";

export default function DishGrid({ dishes = [], onView }) {
  if (!dishes.length) {
    return <p style={{ color: "var(--muted)" }}>No hay platillos para mostrar.</p>;
  }
  return (
    <div className="grid-2" style={{ marginTop: 16 }}>
      {dishes.map((d, i) => (
        <DishCard key={d.id || d.recordId || i} dish={d} onView={onView} />
      ))}
    </div>
  );
}
