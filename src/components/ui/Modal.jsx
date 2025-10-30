import { useEffect } from "react";

export default function Modal({ open, onClose, children }) {
  useEffect(() => {
    function onKey(e){ if (e.key === "Escape") onClose?.(); }
    if (open) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div
      style={{
        position: "fixed", inset: 0, background: "rgba(0,0,0,.6)",
        display: "grid", placeItems: "center", padding: 16, zIndex: 50
      }}
      onMouseDown={(e) => { if (e.target === e.currentTarget) onClose?.(); }}
    >
      <div className="card" style={{ maxWidth: 520, width: "100%" }}>
        {children}
      </div>
    </div>
  );
}
