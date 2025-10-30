import { useState } from "react";
import Button from "../ui/Button";

export default function ChatBubble() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Ventana del chat */}
      {open && (
        <div style={{
          position: "fixed", right: 16, bottom: 84, width: 320, maxWidth: "calc(100vw - 32px)",
          background: "var(--surface)", border: "1px solid #2a2a2a", borderRadius: 16, padding: 12, zIndex: 60
        }}>
          <div style={{ fontWeight: 600, marginBottom: 8 }}>Asistente</div>
          <div style={{ height: 200, overflow: "auto", fontSize: 14, color: "var(--muted)", border: "1px solid #2a2a2a", borderRadius: 12, padding: 8 }}>
            Hola 👋, ¿en qué te ayudo? (UI de demo)
          </div>
          <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
            <input className="input" placeholder="Escribe un mensaje..." style={{ flex: 1 }} />
            <Button type="button">Enviar</Button>
          </div>
        </div>
      )}

      {/* Botón flotante */}
      <button
        type="button"
        onClick={() => setOpen(v => !v)}
        title="Chat"
        className="btn"
        style={{
          position: "fixed", right: 16, bottom: 16, width: 56, height: 56, borderRadius: "50%",
          display: "grid", placeItems: "center", zIndex: 60
        }}
      >
        💬
      </button>
    </>
  );
}
