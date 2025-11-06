import { useEffect, useMemo, useState } from "react";
import { users as apiUsers } from "../lib/api";

export default function UsersTable() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [q, setQ] = useState("");

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

  // Filtro local por nombre o teléfono
  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return rows;
    return rows.filter(r =>
      String(r.name || "").toLowerCase().includes(term) ||
      String(r.phone || "").toLowerCase().includes(term)
    );
  }, [rows, q]);

  if (loading) return <p>Cargando…</p>;
  if (err) return <p>{err}</p>;

  return (
    <>
      <div className="admin__search">
        <input
          className="search"
          value={q}
          onChange={e => setQ(e.target.value)}
          placeholder="Buscar por nombre o teléfono…"
        />
        {q && (
          <button className="btn ghost" onClick={() => setQ("")}>Limpiar</button>
        )}
      </div>

      <div className="table">
        <div className="thead">
          <div>Nombre</div><div>Teléfono</div><div>Rol</div><div></div>
        </div>
        {filtered.map(u => (
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
        {!filtered.length && <p style={{opacity:.7, marginTop:8}}>Sin resultados para “{q}”.</p>}
      </div>
    </>
  );
}
