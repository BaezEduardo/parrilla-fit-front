import Container from "./Container";

export default function Header() {
  return (
    <header style={{ borderBottom: "1px solid #2a2a2a", background: "var(--surface)" }}>
      <Container style={{ padding: "12px 0", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{ fontWeight: 700 }}>Parrilla Fit</span>
        <span style={{ color: "var(--muted)", fontSize: 14 }}>Delicioso y sano</span>
      </Container>
    </header>
  );
}
