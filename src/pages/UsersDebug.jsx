import { useEffect, useState } from "react";
//import { users } from "../lib/api";

export default function UsersDebug(){
  const [data, setData] = useState([]);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(()=>{ let alive=true; (async()=>{
    try{
      const res = await users.list();
      if (alive) setData(Array.isArray(res) ? res : (res?.items || []));
    }catch(e){ if (alive) setErr(e.message); }
    finally{ if (alive) setLoading(false); }
  })(); return ()=>{ alive=false }; },[]);

  if (loading) return <div className="container" style={{padding:'18px 0'}}>Cargando usuarios…</div>;
  if (err) return <div className="container alert err">{err}</div>;

  return (
    <div className="container" style={{padding:'18px 0'}}>
      <h2>Debug usuarios (campos)</h2>
      <div className="grid">
        {data.map(u => (
          <article key={u.id || u.recordId} className="card">
            <h3>{u.name || u.Nombre || "(sin nombre)"}</h3>
            <div className="meta">
              Tel: {u.phone || u.Telefono || u.Phone || "—"} ·
              Rol: {u.role || u.Rol || "—"}
            </div>
            <pre style={{whiteSpace:'pre-wrap',marginTop:8}}>
              {JSON.stringify(u, null, 2)}
            </pre>
          </article>
        ))}
      </div>
    </div>
  );
}
