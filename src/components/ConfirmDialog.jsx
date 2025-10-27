export default function ConfirmDialog({ open, title, text, onCancel, onConfirm }) {
  if (!open) return null;
  return (
    <div className="modal__backdrop">
      <div className="modal">
        <h3>{title}</h3>
        <p>{text}</p>
        <div className="modal__actions">
          <button onClick={onCancel}>Cancelar</button>
          <button className="btn btn--danger" onClick={onConfirm}>Eliminar</button>
        </div>
      </div>
    </div>
  );
}
