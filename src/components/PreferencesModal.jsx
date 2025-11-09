// src/components/PreferencesModal.jsx
import { useEffect, useState } from "react";
import { profile } from "../lib/api";
import { useAuth } from "../context/AuthContext";

const LIKES = ["Res","Pollo","Pescado","Mariscos","Vegetariano","Picante","Sin gluten"];
const DISLIKES = ["Res","Pollo","Pescado","Mariscos","Vegetariano","Picante","Sin gluten"];
const ALLERGIES = ["Lácteos","Gluten","Cacahuate","Mariscos","Huevo","Soya"];

function Group({ title, options, values, onToggle, namePrefix }) {
  return (
    <fieldset className="group">
      <legend>{title}</legend>
      <div className="group__grid">
        {options.map((opt) => {
          const id = `${namePrefix}-${opt}`;
          const checked = values.includes(opt);
          return (
            <label key={opt} htmlFor={id} className="chk-circle">
              <input
                id={id}
                type="checkbox"
                checked={checked}
                onChange={() => onToggle(opt)}
              />
              <i className="dot" aria-hidden="true" />
              <span className="label">{opt}</span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}

export default function PreferencesModal({ open, onClose, initial = {} }) {
  const { user, refresh } = useAuth();
  const [likes, setLikes] = useState(initial.likes || []);
  const [dislikes, setDislikes] = useState(initial.dislikes || []);
  const [allergies, setAllergies] = useState(initial.allergies || []);
  const [err, setErr] = useState("");
  const [ok, setOk] = useState("");
  const [loading, setLoading] = useState(false);

  // Reset cuando se abre
  useEffect(() => {
    if (!open) return;
    const likes0     = (initial?.likes ?? user?.likes) ?? [];
    const dislikes0  = (initial?.dislikes ?? user?.dislikes) ?? [];
    const allergies0 = (initial?.allergies ?? user?.allergies) ?? [];

    setLikes(likes0);
    setDislikes(dislikes0);
    setAllergies(allergies0);
    setErr("");
    setOk("");
    setLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  if (!open) return null;

  const toggle = (arr, setArr) => (v) =>
    setArr(arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v]);

  async function save(e) {
    e.preventDefault();
    setErr(""); setOk("");
    try {
      setLoading(true);
      await profile.updatePrefs({ likes, dislikes, allergies });
      setOk("Preferencias guardadas ✔");
      await refresh?.();
      setTimeout(() => onClose?.(), 900);
    } catch (e) {
      setErr(e.message || "No se pudo guardar");
    } finally {
      setLoading(false);
    }
  }

  // Cerrar al hacer click fuera
  function onBackdropClick(e) {
    if (e.target === e.currentTarget) onClose?.();
  }

  return (
    <div className="modal" role="dialog" aria-modal="true" onClick={onBackdropClick}>
      <div className="modal__dialog" onClick={(e) => e.stopPropagation()}>
        {/* Header fijo */}
        <div className="modal__header">
          <h3><span className="accent">Editar Preferencias</span></h3>
          <button className="btn icon" onClick={onClose} aria-label="Cerrar">✕</button>
        </div>

        {/* Body con scroll */}
        <div className="modal__body">
          <form onSubmit={save}>
            <Group
              title="Me gusta"
              options={LIKES}
              values={likes}
              onToggle={toggle(likes, setLikes)}
              namePrefix="likes"
            />
            <Group
              title="No me gusta"
              options={DISLIKES}
              values={dislikes}
              onToggle={toggle(dislikes, setDislikes)}
              namePrefix="dislikes"
            />
            <Group
              title="Alergias"
              options={ALLERGIES}
              values={allergies}
              onToggle={toggle(allergies, setAllergies)}
              namePrefix="allergies"
            />

            {err && <div className="pref-msg err">{err}</div>}
            {ok &&  <div className="pref-msg ok">{ok}</div>}
          </form>
        </div>

        {/* Footer fijo (botones siempre visibles) */}
        <div className="modal__footer">
          <button className="btn" onClick={onClose} type="button">Cancelar</button>
          <button className="btn primary" onClick={save} disabled={loading}>
            {loading ? "Guardando..." : "Guardar"}
          </button>
        </div>
      </div>
    </div>
  );
}
