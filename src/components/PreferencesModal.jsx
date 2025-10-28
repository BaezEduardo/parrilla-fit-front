// src/components/PreferencesModal.jsx
import { useEffect, useState } from "react";
import { prefs } from "../lib/api";

const LIKES_OPTIONS = ["Res", "Pollo", "Pescado", "Mariscos", "Vegetariano", "Picante", "Sin gluten"];
const DISLIKES_OPTIONS = ["Res", "Pollo", "Pescado", "Mariscos", "Vegetariano", "Picante", "Sin gluten"];
const ALLERGY_OPTIONS = ["Lácteos", "Gluten", "Cacahuate", "Mariscos", "Huevo", "Soya"];

export default function PreferencesModal({ open, onClose }) {
  const [likes, setLikes] = useState([]);
  const [dislikes, setDislikes] = useState([]);
  const [allergies, setAllergies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [ok, setOk] = useState("");

  // cargar prefs al abrir
  useEffect(() => {
    if (!open) return;
    let alive = true;
    setErr(""); setOk(""); setLoading(true);
    prefs.getMe()
      .then(d => {
        if (!alive) return;
        setLikes(d?.likes || []);
        setDislikes(d?.dislikes || []);
        setAllergies(d?.allergies || []);
      })
      .catch(() => { if (alive) setErr("No se pudieron cargar tus preferencias"); })
      .finally(() => { if (alive) setLoading(false); });
    return () => { alive = false; };
  }, [open]);

  // cerrar con ESC
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => { if (e.key === "Escape" && !loading) onClose?.(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose, loading]);

  if (!open) return null;

  const toggle = (list, setList, value) => {
    setList(prev => {
      const set = new Set(prev);
      set.has(value) ? set.delete(value) : set.add(value);
      return Array.from(set);
    });
  };

  async function save() {
    try {
      setLoading(true); setErr(""); setOk("");
      await prefs.updateMe({ likes, dislikes, allergies });
      setOk("Preferencias guardadas");
      setTimeout(() => onClose?.(), 900);
    } catch (e) {
      setErr(e?.message || "No se pudo guardar");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="modal__backdrop" onClick={() => { if (!loading) onClose?.(); }}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal__close" onClick={onClose} disabled={loading}>✖</button>

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
                  <label key={`like-${opt}`} className="option">
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
                  <label key={`dislike-${opt}`} className="option">
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
                  <label key={`allergy-${opt}`} className="option">
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
              <button className="btn-outline" onClick={onClose} disabled={loading}>Cancelar</button>
              <button className="btn-outline" onClick={save} disabled={loading}>Guardar Preferencias</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
