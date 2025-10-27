// client/src/components/DishCard.jsx
export default function DishCard({ dish }) {
  const { Name, Description, Price, imageUrl, Tags = [] } = dish;
  return (
    <article className="dish-card">
      <div className="dish-card__imgwrap">
        <img src={imageUrl || "/assets/placeholder-dish.jpg"} alt={Name} loading="lazy" />
      </div>
      <div className="dish-card__body">
        <h3 className="dish-card__title">{Name}</h3>
        {Description ? <p className="dish-card__desc">{Description}</p> : null}
        <div className="dish-card__meta">
          <span className="dish-card__price">${Number(Price).toFixed(0)}</span>
          <div className="dish-card__tags">
            {Tags.map((t) => <span key={t} className="dish-tag">{t}</span>)}
          </div>
        </div>
      </div>
    </article>
  );
}
