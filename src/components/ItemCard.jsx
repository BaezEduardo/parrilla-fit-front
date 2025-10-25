export default function ItemCard({ title, desc, price, priceRange }) {
  const priceTag = priceRange ?? (price ? `$${price}` : null);
  return (
    <article className="card">
      <div>
        <h3>{title}</h3>
        <p className="muted">{desc}</p>
      </div>
      {priceTag && <span className="price">{priceTag}</span>}
    </article>
  );
}
