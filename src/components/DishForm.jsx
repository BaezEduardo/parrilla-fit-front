import { useEffect, useState } from "react";

const CATEGORIES = ["Entradas","Platillos principales","Postres","Bebidas"];

export default function DishForm({ open, onClose, onSave, initial }) {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [available, setAvailable] = useState(true);
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) return;
    setErr(""); setLoading(false);
    setName(initial?.name || initial?.Name || "");
    setPrice(initial?.price ?? initial?.Price ?? "");
    setCategory(initial?.category || initial?.Category || CATEGORIES[0]);
    setAvailable(!!(initial?.available ?? initial?.Available ?? true));
    setDescription(initial?.description || initial?.Description || "");
    // si viene attachment usar su url grande
    const att = initial?.Image?.[0];
    setImageUrl(initial?.imageUrl || att?.thumbnails?.large?.url || att?.url || "");
  }, [open, initial]);

  if (!open) return null;

  function onBackdropClick(e) {
    if (e.target === e.currentTarget) onClose?.();
  }

  async function submit(e){
    e.preventDefault();
    setErr("");
    if (!name.trim()) return setErr("Nombre requerido");
    if (price === "" || isNaN(Number(price))) return setErr("Precio numérico requerido");

    try {
      setLoading(true);
      await onSave?.({
        name: name.trim(),
        price: Number(price),
        category,
        available,
        description: description.trim(),
        imageUrl: imageUrl.trim() || undefined, // backend la transforma a attachments
      });
      onClose?.();
    } catch (e2) {
      setErr(e2.message || "No se pudo guardar");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="modal" role="dialog" aria-modal="true" onClick={onBackdropClick}>
      <div className="modal__dialog" onClick={(e)=>e.stopPropagation()}>
        {/* Header */}
        <div className="modal__header">
          <h3>{initial ? "Editar" : "Agregar"} <span>Platillo</span></h3>
          <button className="btn icon" onClick={onClose} aria-label="Cerrar">✕</button>
        </div>

        {/* Body */}
        <div className="modal__body">
          <form className="modal__form" onSubmit={submit}>
            <div className="form-card">
              <div className="field">
                <label>Nombre</label>
                <input value={name} onChange={(e)=>setName(e.target.value)} required />
              </div>

              <div className="field form-grid-2">
                <div>
                  <label>Precio</label>
                  <input
                    value={price}
                    onChange={(e)=>setPrice(e.target.value)}
                    inputMode="decimal"
                    placeholder="150.00"
                  />
                </div>
                <div>
                  <label>Categoría</label>
                  <select value={category} onChange={(e)=>setCategory(e.target.value)}>
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>

              <div className="field">
                <label>Descripción</label>
                <textarea rows={3} value={description} onChange={(e)=>setDescription(e.target.value)} />
              </div>

              <div className="field">
                <label>Imagen (URL)</label>
                <input value={imageUrl} onChange={(e)=>setImageUrl(e.target.value)} placeholder="https://..." />
                {imageUrl && (
                  <div className="img-preview">
                    <img src={imageUrl} alt="preview" />
                  </div>
                )}
              </div>

              <label className="chk-circle" style={{width:"fit-content"}}>
                <input
                  type="checkbox"
                  checked={available}
                  onChange={(e)=>setAvailable(e.target.checked)}
                />
                <i className="dot" aria-hidden="true" />
                <span className="label">Disponible</span>
              </label>

              {err && <div className="error" style={{marginTop:10}}>{err}</div>}
            </div>

            {/* Footer */}
            <div className="modal__footer">
              <button className="btn" type="button" onClick={onClose}>Cancelar</button>
              <button className="btn primary" disabled={loading}>
                {loading ? "Guardando..." : (initial ? "Guardar cambios" : "Crear platillo")}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
