import { lazy, Suspense } from "react";
import Container from "../components/layout/Container";
import Card from "../components/ui/Card";
import Skeleton from "../components/ui/Skeleton.jsx";

const AdminPanel = lazy(() => import("../components/admin/AdminPanel"));

export default function Admin() {
  return (
    <Container style={{ padding: 24 }}>
      <h1>Admin</h1>
      <p style={{ color: "var(--muted)", marginTop: 4 }}>Gestiona platillos y usuarios.</p>
      <Suspense fallback={
        <div style={{ marginTop: 16 }}>
          <Card><Skeleton height={28} /><Skeleton height={18} /><Skeleton height={180} /></Card>
        </div>
      }>
        <div style={{ marginTop: 16 }}>
          <AdminPanel />
        </div>
      </Suspense>
    </Container>
  );
}
