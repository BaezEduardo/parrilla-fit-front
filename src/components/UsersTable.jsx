// src/components/UsersTable.jsx
import { useEffect, useState } from "react";
import { admin } from "../lib/api";

export default function UsersTable() {
  const [users, setUsers] = useState([]);
  const [q, setQ] = useState("");
  const [role, setRole] = useState(""); // "", "user", "admin"
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [count, setCount] = useState(0);

  async function load() {
    try {
      setLoading(true);
      setErr("");
      const data = await admin.listUsers({ role: role || undefined, q });
      // Backend devuelve { items, count }; soporta fallback por si es array
      const items = Array.isArray(data) ? data : (data?.items || []);
      setUsers(items);
      setCount(Array.isArray(data) ? items.length : (data?.count ?? items.length));
    } catch (e) {
      setErr(e.message || "Error listando usuarios");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []); // primera carga

  async function handleDelete(id) {
    if (!confirm("¿Eliminar este usuario? Esta acción es permanente.")) return;
    try {
      await admin.deleteUser(id);
      await load();
    } catch (e) {
      alert(e.message || "Error eliminando usuario");
    }
  }

  return (
    <section>
      <div className="admin__controls">
        <input
          className="admin__input"
          placeholder="Buscar por nombre o teléfono…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <select className="admin__select" value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="">Todos</option>
          <option value="user">Solo user</option>
          <option value="admin">Solo admin</option>
        </select>
        <button className="btn" onClick={load} disabled={loading}>
          {loading ? "Buscando..." : "Buscar"}
        </button>
      </div>

      {loading && <p className="admin__msg">Cargando usuarios…</p>}
      {err && <p className="admin__error">{err}</p>}

      {!loading && !err && (
        <>
          <p style={{ opacity: .8, marginTop: 8 }}>Resultados: <b>{count}</b></p>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Teléfono</th>
                <th>Rol</th>
                <th>Likes</th>
                <th>Allergies</th>
                <th style={{ width: 120 }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id}>
                  <td>{u.Name}</td>
                  <td>{u.Phone}</td>
                  <td>{u.Role}</td>
                  <td>{u.Likes?.join(", ")}</td>
                  <td>{u.Allergies?.join(", ")}</td>
                  <td>
                    <button
                      className="btn btn--small btn--danger"
                      onClick={() => handleDelete(u.id)}
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr><td colSpan={6} style={{ textAlign: "center" }}>Sin resultados</td></tr>
              )}
            </tbody>
          </table>
        </>
      )}
    </section>
  );
}
