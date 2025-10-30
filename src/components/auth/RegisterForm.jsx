import { useState } from "react";
import Input from "../ui/Input";
import Button from "../ui/Button";
import { auth } from "../../lib/api";
import useAuth from "../../hooks/useAuth";

export default function RegisterForm({ onSuccess }) {
  const { refresh } = useAuth();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [ok, setOk] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e){
    e.preventDefault();
    setErr(""); setOk("");
    try{
      setLoading(true);
      await auth.register({ name, phone, password });
      await refresh();
      setOk("Cuenta creada");
      onSuccess?.();
    }catch(e){
      setErr(e?.message || "Error al registrarse");
    }finally{
      setLoading(false);
    }
  }

  return (
    <form onSubmit={submit} style={{ display: "grid", gap: 12 }}>
      <div>
        <label>Nombre</label>
        <Input value={name} onChange={e=>setName(e.target.value)} placeholder="Tu nombre" />
      </div>
      <div>
        <label>Teléfono</label>
        <Input value={phone} onChange={e=>setPhone(e.target.value)} placeholder="5512345678" />
      </div>
      <div>
        <label>Contraseña</label>
        <Input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="••••••" />
      </div>
      {err && <p style={{ color: "#ff6b6b", margin: 0 }}>{err}</p>}
      {ok && <p style={{ color: "#6bcf6b", margin: 0 }}>{ok}</p>}
      <Button disabled={loading} type="submit">{loading ? "Creando..." : "Crear cuenta"}</Button>
    </form>
  );
}
