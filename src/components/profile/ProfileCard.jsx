import Card from "../ui/Card";
import Button from "../ui/Button";
import useAuth from "../../hooks/useAuth";

export default function ProfileCard({ onOpenPrefs, onOpenPwd }) {
  const { user } = useAuth();
  const name = user?.Name || user?.name || "—";
  const phone = user?.Phone || user?.phone || "—";
  const role = user?.Role || user?.role || "user";

  return (
    <Card>
      <h3 style={{ marginTop: 0 }}>Tu perfil</h3>
      <p style={{ margin: "6px 0", color: "var(--muted)" }}>
        <strong>Nombre:</strong> {name}<br/>
        <strong>Teléfono:</strong> {phone}<br/>
        <strong>Rol:</strong> {role}
      </p>
      <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
        <Button onClick={onOpenPrefs}>Preferencias</Button>
        <Button onClick={onOpenPwd}>Cambiar contraseña</Button>
      </div>
    </Card>
  );
}
