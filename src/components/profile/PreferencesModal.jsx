import { useEffect, useState } from "react";
import Modal from "../ui/Modal";
import Button from "../ui/Button";
import Toast from "../ui/Toast.jsx";
import useAuth from "../../hooks/useAuth";

const LIKES_OPTIONS = ["Res", "Pollo", "Pescado", "Mariscos", "Vegetariano", "Picante", "Sin gluten"];
const DISLIKES_OPTIONS = ["Res", "Pollo", "Pescado", "Mariscos", "Vegetariano", "Picante", "Sin gluten"];
const ALLERGY_OPTIONS = ["Lácteos", "Gluten", "Cacahuate", "Mariscos", "Huevo", "Soya"];

export default function PreferencesModal({ open, onClose }) {
  const { user, refresh } = useAuth();
  const [likes, setLikes] = useState([]);
  const [dislikes, setDislikes] = useState([]);
  const [allergies, setAllergies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, type: "success", message: "" });

  useEffect(() => {
    if (!open) return;
    const L = user?.Likes || user?.likes || [];
    const D = user?.Dislikes || user?.dislikes || [];
    const A = user?.Allergies || user?.allergies || [];
    setLikes(Array.isArray(L) ? L : (L ? [String(L)] : []));
    setDislikes(Array.isArray(D) ? D : (D ? [String(D)] : []));
    setAllergies(Array.isArray(A) ? A : (A ? [String(A)] : []));
    setToast({ show: false, type: "success", message: "" });
  }, [open, user]);

  function toggle(list, setList, value) {
    setList(prev => prev.includes(value) ? prev.filter(v => v !== value) : [...prev, value]);
    }

  async function save(e) {
    e.preventDefault();
    setLoading(true); setToast({ show: false, type: "success", message: "" });
    try {
      const res = await fetch("/api/users/me", {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ Likes: likes, Dislikes: dislikes, Allergies: allergies }),
      });
      if (!res.ok) {
        const ct = res.headers.get("content-type") || "";
        const data = ct.includes("application/json") ? await res.json().catch(() => null) : await res.text();
        const msg = (data && (data.error || data.message)) || `HTTP ${res.status}`;
        throw new Error(msg);
      }
      await refresh();
      setToast({ show: true, type: "success", message: "Preferencias guardadas" });
      setTimeout(() => onClose?.(), 800);
    } catch (err) {
      setToast({ show: true, type: "error", message: err?.message || "No se pudieron guardar" });
    } finally {
      setLoading(false);
    }
  }

  if (!open) return null;

  return (
    <Modal open={open} onClose={onClose}>
      <form onSubmit={save} style={{ display: "grid", gap: 12 }}>
        <h3 style={{ marginTop: 0 }}>Preferencias</h3>

        <div>
          <strong>Me gusta</strong>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 8 }}>
            {LIKES_OPTIONS.map(opt => (
              <label key={opt} style={{ display: "inline-flex", gap: 6, alignItems: "center", border: "1px solid #2a2a2a", padding: "6px 10px", borderRadius: 12 }}>
                <input type="checkbox" checked={likes.includes(opt)} onChange={() => toggle(likes, setLikes, opt)} />
                {opt}
              </label>
            ))}
          </div>
        </div>

        <div>
          <strong>No me gusta</strong>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 8 }}>
            {DISLIKES_OPTIONS.map(opt => (
              <label key={opt} style={{ display: "inline-flex", gap: 6, alignItems: "center", border: "1px solid #2a2a2a", padding: "6px 10px", borderRadius: 12 }}>
                <input type="checkbox" checked={dislikes.includes(opt)} onChange={() => toggle(dislikes, setDislikes, opt)} />
                {opt}
              </label>
            ))}
          </div>
        </div>

        <div>
          <strong>Alergias</strong>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 8 }}>
            {ALLERGY_OPTIONS.map(opt => (
              <label key={opt} style={{ display: "inline-flex", gap: 6, alignItems: "center", border: "1px solid #2a2a2a", padding: "6px 10px", borderRadius: 12 }}>
                <input type="checkbox" checked={allergies.includes(opt)} onChange={() => toggle(allergies, setAllergies, opt)} />
                {opt}
              </label>
            ))}
          </div>
        </div>

        <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
          <Button type="button" onClick={onClose}>Cancelar</Button>
          <Button type="submit" disabled={loading}>{loading ? "Guardando..." : "Guardar"}</Button>
        </div>

        {toast.show && (
          <Toast type={toast.type} message={toast.message} />
        )}
      </form>
    </Modal>
  );
}
