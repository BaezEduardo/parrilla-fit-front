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
        {options.map(opt => {
          const id = `${namePrefix}-${opt}`;
          const checked = values.includes(opt);
          return (
            <label key={opt} htmlFor={id} className="chk">
              <input
                id={id}
                type="checkbox"
                checked={checked}
                onChange={() => onToggle(opt)}
              />
              <span>{opt}</span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}

export default function PreferencesModal({ open, onClose, initial = {} }) {
  const { user, refresh } = useAuth(); // 👈 usaremos refresh() tras guardar
  const [likes, setLikes] = useState(initial.likes || []);
  const [dislikes, setDislikes] = useState(initial.dislikes || []);
  const [allergies, setAllergies] = useState(initial.allergies || []);
  const [err, setErr] = useState("");
  const [ok, setOk] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
  if (!open) return;

  // Toma un snapshot SOLO cuando se abre el modal
  const likes0     = (initial?.likes ?? user?.likes) ?? [];
  const dislikes0  = (initial?.dislikes ?? user?.dislikes) ?? [];
  const allergies0 = (initial?.allergies ?? user?.allergies) ?? [];

  setLikes(likes0);
  setDislikes(dislikes0);
  setAllergies(allergies0);
  setErr("");
  setOk("");
  setLoading(false);

  // IMPORTANT: dependemos SOLO de `open`
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [open]);


  if (!open) return null;

  const toggle = (arr, setArr) => (v) =>
    setArr(arr.includes(v) ? arr.filter(x => x !== v) : [...arr, v]);

  async function save(e){
    e.preventDefault();
    setErr(""); setOk("");
    try{
      setLoading(true);
      await profile.updatePrefs({ likes, dislikes, allergies }); // PUT /users/me/preferences
      setOk("Preferencias guardadas ✔");
      await refresh?.(); // 👈 vuelve a leer /auth/me para tener los datos actualizados
      setTimeout(() => onClose?.(), 900);
    } catch (e) {
      setErr(e.message || "No se pudo guardar");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={(e)=>e.stopPropagation()}>
        <div className="modal__header">
          <h3><span className="accent">Editar Preferencias</span></h3>
          <button className="btn icon" onClick={onClose}>✕</button>
        </div>

        <form className="modal__form" onSubmit={save}>
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

          {err && <div className="error">{err}</div>}
          {ok && <div className="ok">{ok}</div>}

          <button className="btn primary" disabled={loading}>
            {loading ? "Guardando..." : "Guardar"}
          </button>
        </form>
      </div>
    </div>
  );
}
