import { useEffect, useRef } from "react";

export default function ConfirmDialog({
  open,
  title = "Confirmar",
  text = "¿Estás seguro?",
  onCancel,
  onConfirm,
  confirmLabel = "Confirmar",
  cancelLabel = "Cancelar",
  loading = false,               // opcional: deshabilita acciones mientras confirma
  disableBackdropClose = false,  // opcional: no cerrar al hacer clic fuera
}) {
  const confirmBtnRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    // Focus en el botón de confirmación al abrir
    const t = setTimeout(() => confirmBtnRef.current?.focus(), 0);

    // Cerrar con ESC (si no está cargando)
    const onKey = (e) => {
      if (e.key === "Escape" && !loading) onCancel?.();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      clearTimeout(t);
      window.removeEventListener("keydown", onKey);
    };
  }, [open, loading, onCancel]);

  if (!open) return null;

  return (
    <div
      className="modal__backdrop"
      onClick={() => { if (!loading && !disableBackdropClose) onCancel?.(); }}
      aria-hidden="true"
    >
      <div
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-dialog-title"
        aria-describedby="confirm-dialog-desc"
        onClick={(e) => e.stopPropagation()} // evita cerrar si clic dentro
      >
        <div className="modal__header">
          <h3 id="confirm-dialog-title" className="modal__heading">{title}</h3>
        </div>

        <p id="confirm-dialog-desc" className="modal__subheading">{text}</p>

        <div className="modal__actions" style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
          <button
            type="button"
            className="btn-outline"
            onClick={onCancel}
            disabled={loading}
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            ref={confirmBtnRef}
            className="btn btn--danger"
            onClick={onConfirm}
            disabled={loading}
          >
            {loading ? "Procesando..." : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
