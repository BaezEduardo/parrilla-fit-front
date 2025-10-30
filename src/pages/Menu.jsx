import { useEffect, useState } from "react";
import Hero from "../components/Hero";
import DishGrid from "../components/dishes/DishGrid";
import Card from "../components/ui/Card";
import Skeleton from "../components/ui/Skeleton.jsx";
import DishDetailModal from "../components/dishes/DishDetailModal";
import { dishes as apiDishes } from "../lib/api";

export default function SimpleMenu() {
  const [dishes, setDishes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [selected, setSelected] = useState(null);
  const [openDetail, setOpenDetail] = useState(false);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setLoading(true);
        setErr("");
        const res = await apiDishes.list();
        if (!alive) return;
        const items = Array.isArray(res) ? res : (res?.items || []);
        setDishes(items);
      } catch (e) {
        if (!alive) return;
        setErr(e?.message || "No se pudo cargar el menú");
      } finally {
        if (!alive) return;
        setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, []);

  function openModal(dish) {
    setSelected(dish);
    setOpenDetail(true);
  }

  return (
    <>
      <Hero />
      <div className="container" style={{ padding: "32px 16px" }}>
        <h2>Menú</h2>
        <p style={{ color: "var(--muted)" }}>Descubre nuestros platillos saludables.</p>

        {loading ? (
          <div className="grid-2" style={{ marginTop: 16 }}>
            <Card><Skeleton height={180} /><Skeleton height={20} /><Skeleton height={16} /></Card>
            <Card><Skeleton height={180} /><Skeleton height={20} /><Skeleton height={16} /></Card>
          </div>
        ) : err ? (
          <Card style={{ marginTop: 16, color: "#ff6b6b" }}>{err}</Card>
        ) : (
          <DishGrid dishes={dishes} onView={openModal} />
        )}

        <DishDetailModal
          open={openDetail}
          onClose={() => setOpenDetail(false)}
          dish={selected}
        />
      </div>
    </>
  );
}
