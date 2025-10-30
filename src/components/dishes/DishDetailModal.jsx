import Modal from "../ui/Modal";
import Button from "../ui/Button";
import { formatPrice } from "../../lib/formatters";

export default function DishDetailModal({ open, onClose, dish }) {
  if (!open || !dish) return null;

  const { Name, name, Price, price, Image, image, Description, description } = dish || {};
  const title = Name || name || "Platillo";
  const cost = Price ?? price;
  const img = (Image?.url) || Image || image || null;
  const desc = Description || description || "";

  return (
    <Modal open={open} onClose={onClose}>
      <div style={{ display: "grid", gap: 12 }}>
        {img && (
          <div style={{ aspectRatio: "16/9", overflow: "hidden", borderRadius: 12 }}>
            <img src={img} alt={title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </div>
        )}
        <h2 style={{ margin: "4px 0 0" }}>{title}</h2>
        {cost != null && <p style={{ margin: 0, color: "var(--muted)" }}>{formatPrice(cost)}</p>}
        {desc && <p style={{ margin: 0 }}>{desc}</p>}
        <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", marginTop: 8 }}>
          <Button onClick={onClose}>Cerrar</Button>
        </div>
      </div>
    </Modal>
  );
}
