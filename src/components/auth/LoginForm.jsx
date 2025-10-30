import { useState } from "react";
import Input from "../ui/Input";
import Button from "../ui/Button";
import useAuth from "../../hooks/useAuth";

export default function LoginForm({ onSuccess }) {
  const { login } = useAuth();
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e){
    e.preventDefault();
    setErr("");
    try{
      setLoading(true);
      await login({ phone, password });
      onSuccess?.();
    }catch(e){
      setErr(e?.message || "Error al iniciar sesión");
    }finally{
      setLoading(false);
    }
  }

  return (
    <form onSubmit={submit} style={{ display: "grid", gap: 12 }}>
      <div>
        <label>Teléfono</label>
        <Input value={phone} onChange={e=>setPhone(e.target.value)} placeholder="5512345678" />
      </div>
      <div>
        <label>Contraseña</label>
        <Input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="••••••" />
      </div>
      {err && <p style={{ color: "#ff6b6b", margin: 0 }}>{err}</p>}
      <Button disabled={loading} type="submit">{loading ? "Ingresando..." : "Iniciar sesión"}</Button>
    </form>
  );
}
