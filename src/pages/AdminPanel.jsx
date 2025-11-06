import { useEffect, useState } from "react";
import { dishes as apiDishes } from "../lib/api";
import DishForm from "../components/DishForm";
import UsersTable from "../components/UsersTable";

export default function AdminPanel() {
  const [tab, setTab] = useState("dishes"); // "dishes" | "users"
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null); // null = crear, objeto = editar

  async function load() {
    try {
      setLoading(true);
      const data = await apiDishes.list();
      setItems(Array.isArray(data) ? data : []);
    } catch (e) {
      setErr(e.message || "Error cargando platillos");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function reload() {
    await load();
  }

  async function onCreate(payload) {
    await apiDishes.create(payload);
    await reload();
  }

  async function onUpdate(payload) {
    if (!editing) return;
    await apiDishes.update(editing.id, payload);
    await reload();
  }

  async function onDelete(dish) {
    if (!dish?.id) return;
    const ok = confirm(
      `¿Eliminar "${dish.Name || dish.name}"? Esta acción no se puede deshacer.`
    );
    if (!ok) return;
    try {
      await apiDishes.remove(dish.id);
      // Actualización optimista
      setItems((prev) => prev.filter((x) => x.id !== dish.id));
    } catch (e) {
      alert(e.message || "No se pudo eliminar");
    }
  }

  return (
  <main className="admin container">
    <div className="admin__tabs">
      <button
        className={`tab ${tab === "dishes" ? "on" : ""}`}
        onClick={() => setTab("dishes")}
      >
        Platillos
      </button>
      <button
        className={`tab ${tab === "users" ? "on" : ""}`}
        onClick={() => setTab("users")}
      >
        Usuarios
      </button>
    </div>

    {tab === "dishes" && (
      <>
        <div className="admin__bar">
          <h2>Platillos</h2>
          <button
            className="btn primary"
            onClick={() => {
              setEditing(null);
              setFormOpen(true);
            }}
          >
            Agregar platillo
          </button>
        </div>

        {loading ? (
          <p>Cargando…</p>
        ) : err ? (
          <p>{err}</p>
        ) : (
          <div className="table">
            <div className="thead">
              <div>Nombre</div>
              <div>Precio</div>
              <div>Categoría</div>
              <div>Disp.</div>
              <div></div>
            </div>
            {items.map((d) => (
              <div className="trow" key={d.id}>
                <div>{d.Name || d.name}</div>
                <div>${Number(d.Price ?? d.price ?? 0).toFixed(2)}</div>
                <div>{d.Category || d.category || "-"}</div>
                <div>{(d.Available ?? d.available) ? "✔" : "—"}</div>
                <div className="actions">
                  <button
                    className="btn ghost"
                    onClick={() => {
                      setEditing({
                        id: d.id,
                        name: d.Name ?? d.name,
                        price: d.Price ?? d.price,
                        category: d.Category ?? d.category,
                        available: d.Available ?? d.available,
                        description: d.Description ?? d.description,
                        imageUrl:
                          d.imageUrl ||
                          d.Image?.[0]?.thumbnails?.large?.url ||
                          d.Image?.[0]?.url ||
                          "",
                      });
                      setFormOpen(true);
                    }}
                  >
                    Editar
                  </button>
                  <button className="btn ghost" onClick={() => onDelete(d)}>
                    Eliminar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal Crear/Editar SOLO en tab de platillos */}
        <DishForm
          open={formOpen}
          onClose={() => setFormOpen(false)}
          initial={editing}
          onSave={editing ? onUpdate : onCreate}
        />
      </>
    )}

    {tab === "users" && (
      <>
        <div className="admin__bar">
          <h2>Usuarios</h2>
        </div>
        <UsersTable />
      </>
    )}
  </main>
);
}
