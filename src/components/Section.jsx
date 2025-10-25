import ItemCard from "./ItemCard";

export default function Section({ name, items }) {
  return (
    <section className="section">
      <h2>{name}</h2>
      <div className="grid">
        {items.map((it, idx) => (
          <ItemCard key={idx} {...it} />
        ))}
      </div>
    </section>
  );
}
