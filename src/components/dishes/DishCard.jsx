import Card from "../ui/Card";
import Button from "../ui/Button";
import { formatPrice } from "../../lib/formatters";

export default function DishCard({ dish, onView }) {
  const { Name, name, Price, price, Image, image, Description, description } = dish || {};
  const title = Name || name || "Platillo";
  const cost = Price ?? price;
  const img = (Image?.url) || Image || image || null;
  const desc = Description || description || "";

  return (
    <Card>
      {img && (
        <div style={{ aspectRatio: "16/9", overflow: "hidden", borderRadius: 12, marginBottom: 12 }}>
          <img src={img} alt={title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        </div>
      )}
      <h3 style={{ marginTop: 0 }}>{title}</h3>
      {cost != null && <p style={{ margin: "6px 0", color: "var(--muted)" }}>{formatPrice(cost)}</p>}
      {desc && <p style={{ margin: "6px 0", color: "var(--muted)" }}>{desc}</p>}
      {onView && <Button onClick={()=>onView(dish)} style={{ marginTop: 8 }}>Ver detalle</Button>}
    </Card>
  );
}
