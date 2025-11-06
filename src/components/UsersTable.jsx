import { useEffect, useState } from "react";
import { users as apiUsers } from "../lib/api";

export default function UsersTable() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  async function load() {
    try {
      setLoading(true);
      const data = await apiUsers.list();
      setRows(Array.isArray(data) ? data : []);
    } catch (e) {
      setErr(e.message || "Error cargando usuarios");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  async function toggleRole(u) {
    const next = u.role === "admin" ? "user" : "admin";
    await apiUsers.setRole(u.id, next);
    setRows(prev => prev.map(r => r.id === u.id ? { ...r, role: next } : r));
  }

  async function removeUser(u) {
    if (!confirm(`¿Eliminar a ${u.name || u.phone}?`)) return;
    await apiUsers.remove(u.id);
    setRows(prev => prev.filter(r => r.id !== u.id));
  }

  if (loading) return <p>Cargando…</p>;
  if (err) return <p>{err}</p>;

  return (
    <div className="table">
      <div className="thead">
        <div>Nombre</div><div>Teléfono</div><div>Rol</div><div></div>
      </div>
      {rows.map(u => (
        <div className="trow" key={u.id}>
          <div>{u.name || "—"}</div>
          <div>{u.phone}</div>
          <div>
            <span className={`pill-role ${u.role}`}>{u.role}</span>
          </div>
          <div className="actions">
            <button className="btn ghost" onClick={() => toggleRole(u)}>
              {u.role === "admin" ? "Quitar admin" : "Hacer admin"}
            </button>
            <button className="btn ghost" onClick={() => removeUser(u)}>Eliminar</button>
          </div>
        </div>
      ))}
    </div>
  );
}
