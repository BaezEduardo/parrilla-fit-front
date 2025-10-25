// client/src/components/PreferencesModal.jsx
import { useEffect, useState } from "react";

const LIKES_OPTIONS = ["Res", "Pollo", "Pescado", "Mariscos", "Vegetariano", "Picante", "Sin gluten"];
const DISLIKES_OPTIONS = ["Res", "Pollo", "Pescado", "Mariscos", "Vegetariano", "Picante", "Sin gluten"];
const ALLERGY_OPTIONS = ["Lácteos", "Gluten", "Cacahuate", "Mariscos", "Huevo", "Soya"];

export default function PreferencesModal({ open, onClose, recordId }) {
  const [likes, setLikes] = useState([]);
  const [dislikes, setDislikes] = useState([]);
  const [allergies, setAllergies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [ok, setOk] = useState("");

  useEffect(() => {
    if (!open || !recordId) return;
    setErr(""); setOk(""); setLoading(true);
    // Cargar preferencias actuales
    fetch(`/api/preferences/${recordId}`)
      .then(r => r.json())
      .then(d => {
        setLikes(d.likes || []);
        setDislikes(d.dislikes || []);
        setAllergies(d.allergies || []);
      })
      .catch(() => setErr("No se pudieron cargar tus preferencias"))
      .finally(() => setLoading(false));
  }, [open, recordId]);

  if (!open) return null;

  const toggle = (list, setList, value) =>
    setList(prev => prev.includes(value) ? prev.filter(v => v !== value) : [...prev, value]);

  async function save() {
    try {
      setLoading(true); setErr(""); setOk("");
      const res = await fetch(`/api/preferences/${recordId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ likes, dislikes, allergies })
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "No se pudo guardar");
      setOk("Preferencias guardadas");
      setTimeout(() => onClose?.(), 900);
    } catch (e) {
      setErr(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
  <div className="modal">
    <div className="modal__backdrop" onClick={onClose} />
    <div className="modal__card">
      <button className="modal__close" onClick={onClose}>✖</button>

      <div className="modal__header">
        <h3 className="modal__heading">Preferencias</h3>
        <p className="modal__subheading">Personaliza tu experiencia en La Parrilla Fit</p>
      </div>

      {loading && <p>Cargando…</p>}

      {!loading && (
        <>
          <div className="pref-group">
            <h4 className="pref-title">Me gusta</h4>
            <div className="options-grid">
              {LIKES_OPTIONS.map(opt => (
                <label key={opt} className="option">
                  <input
                    type="checkbox"
                    checked={likes.includes(opt)}
                    onChange={() => toggle(likes, setLikes, opt)}
                  />
                  <span>{opt}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="pref-group">
            <h4 className="pref-title">No me gusta</h4>
            <div className="options-grid">
              {DISLIKES_OPTIONS.map(opt => (
                <label key={opt} className="option">
                  <input
                    type="checkbox"
                    checked={dislikes.includes(opt)}
                    onChange={() => toggle(dislikes, setDislikes, opt)}
                  />
                  <span>{opt}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="pref-group">
            <h4 className="pref-title">Alergias</h4>
            <div className="options-grid">
              {ALLERGY_OPTIONS.map(opt => (
                <label key={opt} className="option">
                  <input
                    type="checkbox"
                    checked={allergies.includes(opt)}
                    onChange={() => toggle(allergies, setAllergies, opt)}
                  />
                  <span>{opt}</span>
                </label>
              ))}
            </div>
          </div>

          {err && <div className="form__error">{err}</div>}
          {ok && <div className="form__ok">{ok}</div>}

          <div style={{display:"flex", gap:"8px", marginTop:"12px", justifyContent:"flex-end"}}>
            <button className="btn-outline" onClick={onClose}>Cancelar</button>
            <button className="btn-primary" onClick={save} disabled={loading}>Guardar Preferencias</button>
          </div>
        </>
      )}
    </div>
  </div>
);
}
