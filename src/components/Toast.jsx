export default function Toast({ msg, type = "ok", onClose }) {
  if (!msg) return null;
  return (
    <div className={`toast toast--${type}`} onClick={onClose} title="Cerrar">
      {msg}
    </div>
  );
}
