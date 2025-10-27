// src/pages/AdminPanel.jsx
import { useEffect, useState } from "react";
import { api, API_BASE } from "../lib/api";
import DishTable from "../components/DishTable";
import DishForm from "../components/DishForm";
import UsersTable from "../components/UsersTable";
import Toast from "../components/Toast.jsx";
import "../styles/admin.css";


export default function AdminPanel() {
  const [tab, setTab] = useState("dishes"); // "dishes" | "users"
  const [dishes, setDishes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selected, setSelected] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [toast, setToast] = useState({ msg: "", type: "ok" });

  const showToast = (msg, type = "ok") => {
    setToast({ msg, type });
    setTimeout(() => setToast({ msg: "", type: "ok" }), 2500);
  };
  
  async function fetchDishes() {
    try {
      setLoading(true);
      setError("");
      // Traer todos, incluidos no disponibles (el back soporta filtros; si no, omite available)
      const res = await api.listDishes({ available: "false" });
      setDishes(res);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { fetchDishes(); }, []);

  async function handleDelete(id) {
    if (!confirm("¿Seguro que deseas eliminar este platillo?")) return;
    try {
      await fetch(`${API_BASE}/api/dishes/${id}`, {
        method: "DELETE",
        headers: { "x-admin-key": import.meta.env.VITE_ADMIN_KEY || "clave-admin-local" },
      });
      await fetchDishes();
      showToast("Platillo eliminado", "ok");
    } catch (e) {
      showToast(e.message || "Error al eliminar", "err");
    }
  }

  async function handleSave(dish) {
    try {
      const method = dish.id ? "PATCH" : "POST";
      const url = dish.id
        ? `${API_BASE}/api/dishes/${dish.id}`
        : `${API_BASE}/api/dishes`;
      await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          "x-admin-key": import.meta.env.VITE_ADMIN_KEY || "clave-admin-local",
        },
        body: JSON.stringify(dish),
      });
      setShowForm(false);
      await fetchDishes();
      showToast("Platillo guardado", "ok");
    } catch (e) {
      showToast(e.message || "Error al guardar", "err");
    }
  }


  return (
    <main className="admin">
      <header className="admin__header">
        <h1>Panel de Administración</h1>
        {tab === "dishes" && (
          <button className="btn btn--gold" onClick={() => { setSelected(null); setShowForm(true); }}>
            + Nuevo Platillo
          </button>
        )}
      </header>

      {/* Tabs */}
      <div className="tabs">
        <button className={`tab ${tab === "dishes" ? "tab--active" : ""}`} onClick={() => setTab("dishes")}>
          Platillos
        </button>
        <button className={`tab ${tab === "users" ? "tab--active" : ""}`} onClick={() => setTab("users")}>
          Usuarios
        </button>
      </div>

      {/* Contenido por tab */}
      {tab === "dishes" && (
        <>
          {error && <p className="admin__error">{error}</p>}
          {loading && <div className="container"><Skeleton rows={6} /></div>}
          {!loading && !error && !showForm && (
            <DishTable
              dishes={dishes}
              onEdit={(d) => { setSelected(d); setShowForm(true); }}
              onDelete={handleDelete}
            />
          )}
          {showForm && (
            <DishForm
              dish={selected || undefined}
              onCancel={() => setShowForm(false)}
              onSave={handleSave}
            />
          )}
        </>
      )}
  
      {tab === "users" && <UsersTable />}
      <Toast msg={toast.msg} type={toast.type} onClose={() => setToast({ msg: "", type: "ok" })} />
    </main>
  );
}
