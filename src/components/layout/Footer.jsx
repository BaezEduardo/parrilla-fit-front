import Container from "./Container";

export default function Footer() {
  return (
    <footer style={{ borderTop: "1px solid #2a2a2a", marginTop: 24 }}>
      <Container style={{ padding: "16px 0", fontSize: 14, color: "var(--muted)" }}>
        © {new Date().getFullYear()} Parrilla Fit — Todos los derechos reservados
      </Container>
    </footer>
  );
}
