import Container from "../components/layout/Container";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";

export default function Home() {
  return (
    <Container style={{ padding: 24 }}>
      <h1>Bienvenido a Parrilla Fit</h1>
      <p style={{ color: "var(--muted)" }}>Comida rica y balanceada.</p>
      <div className="grid-2" style={{ marginTop: 16 }}>
        <Card>
          <h3>Platillos destacados</h3>
          <p>Muy pronto verás nuestros favoritos.</p>
          <Button onClick={() => (window.location.href = "/menu")}>Ver menú</Button>
        </Card>
        <Card>
          <h3>Tu perfil</h3>
          <p>Configura preferencias y más.</p>
          <Button onClick={() => (window.location.href = "/perfil")}>Ir a perfil</Button>
        </Card>
      </div>
    </Container>
  );
}
